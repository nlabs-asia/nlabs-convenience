/**
 * Peta Leaflet + OpenStreetMap (keputusan: bukan Google Maps JS API —
 * docs/technical-decisions.md §3). Lazy-loaded oleh Location.tsx sehingga
 * bundle peta tidak masuk initial load.
 *
 * Fitur (PRD §4.6):
 * - Viewport default mencakup Sabang–Merauke
 * - Marker clustering (chunkedLoading untuk skala 1.000+ pin)
 * - Pin custom brand (divIcon — tanpa aset marker default Leaflet)
 * - Popup detail + tombol "Buka di Google Maps"
 * - scrollWheelZoom nonaktif agar tidak bentrok dengan scroll halaman
 * - Fokus ke pin saat item daftar diklik; terbang ke posisi user
 */
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { Branch } from "../../types/content";
import type { UserPosition } from "../../hooks/useGeolocation";
import { buildGoogleMapsUrl } from "../../utils/googleMaps";
import { track, ANALYTICS_EVENTS } from "../../services/analytics";

/** Bounds seluruh Indonesia (Sabang–Merauke). */
const INDONESIA_BOUNDS: L.LatLngBoundsExpression = [
  [-11, 94],
  [6, 141],
];

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

/** Pin custom bernuansa brand (garis hijau-putih khas FamilyMart). */
function createPinIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="width:34px;height:34px;border-radius:12px 12px 12px 2px;background:#0ea5e9;border:2px solid #fff;box-shadow:0 2px 8px rgb(2 132 199 / 0.45);display:flex;align-items:center;justify-content:center;transform:rotate(-45deg)"><span style="transform:rotate(45deg);width:12px;height:12px;border-radius:4px;background:linear-gradient(180deg,#16a34a 50%,#fff 50%)"></span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 32],
    popupAnchor: [0, -30],
  });
}

function popupHtml(branch: Branch): string {
  const url = buildGoogleMapsUrl(branch);
  return `<div style="font-family:inherit;min-width:200px">
    <strong style="font-size:14px">${escapeHtml(branch.name)}</strong>
    <p style="margin:6px 0 0;font-size:12px;color:#64748b">${escapeHtml(branch.address)}</p>
    ${branch.openingHours ? `<p style="margin:4px 0 0;font-size:12px;color:#15803d;font-weight:600">Jam: ${escapeHtml(branch.openingHours)}</p>` : ""}
    ${branch.phone ? `<p style="margin:4px 0 0;font-size:12px;color:#64748b">Telp: ${escapeHtml(branch.phone)}</p>` : ""}
    <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" data-gmaps-branch="${escapeHtml(branch.id)}" data-gmaps-city="${escapeHtml(branch.city)}" style="display:inline-block;margin-top:10px;padding:8px 14px;background:#0ea5e9;color:#fff;border-radius:9999px;font-size:12px;font-weight:700;text-decoration:none">Buka di Google Maps</a>
  </div>`;
}

interface ClusterLayerProps {
  branches: Branch[];
  activeBranchId: string | null;
  userPosition: UserPosition | null;
  onPinClick: (branch: Branch) => void;
}

/** Lapisan marker + clustering; hidup di dalam MapContainer. */
function ClusterLayer({ branches, activeBranchId, userPosition, onPinClick }: ClusterLayerProps) {
  const map = useMap();
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  // Bangun ulang cluster saat data cabang berubah
  useEffect(() => {
    const group = L.markerClusterGroup({
      chunkedLoading: true, // tetap ringan untuk 1.000+ pin
      maxClusterRadius: 52,
      showCoverageOnHover: false,
    });
    const markers = markersRef.current;
    markers.clear();
    const icon = createPinIcon();

    branches.forEach((branch) => {
      const marker = L.marker([branch.lat, branch.lng], {
        icon,
        title: branch.name,
      });
      marker.bindPopup(popupHtml(branch), { closeButton: true });
      marker.on("click", () => {
        track(ANALYTICS_EVENTS.LOCATION_PIN_CLICK, {
          branchId: branch.id,
          city: branch.city,
        });
        onPinClick(branch);
      });
      markers.set(branch.id, marker);
      group.addLayer(marker);
    });

    map.addLayer(group);
    groupRef.current = group;

    // Tracking klik "Buka di Google Maps" dari popup (event delegation)
    const container = map.getContainer();
    const onContainerClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[data-gmaps-branch]",
      );
      if (anchor) {
        track(ANALYTICS_EVENTS.OPEN_GOOGLE_MAPS_CLICK, {
          branchId: anchor.dataset.gmapsBranch ?? "",
          city: anchor.dataset.gmapsCity ?? "",
        });
      }
    };
    container.addEventListener("click", onContainerClick);

    return () => {
      container.removeEventListener("click", onContainerClick);
      map.removeLayer(group);
      groupRef.current = null;
    };
  }, [map, branches, onPinClick]);

  // Fokus ke pin saat item daftar diklik
  useEffect(() => {
    if (!activeBranchId) return;
    const marker = markersRef.current.get(activeBranchId);
    const group = groupRef.current;
    if (!marker) return;
    // zoomToShowLayer menangani marker yang masih tergabung di cluster
    group?.zoomToShowLayer(marker, () => marker.openPopup());
  }, [activeBranchId]);

  // Terbang ke posisi user + tandai dengan circle marker
  useEffect(() => {
    if (!userPosition) return;
    userMarkerRef.current?.remove();
    const marker = L.circleMarker([userPosition.lat, userPosition.lng], {
      radius: 9,
      color: "#ffffff",
      weight: 3,
      fillColor: "#16a34a",
      fillOpacity: 1,
    })
      .bindTooltip("Lokasi Anda")
      .addTo(map);
    userMarkerRef.current = marker;
    map.flyTo([userPosition.lat, userPosition.lng], 13);
  }, [map, userPosition]);

  return null;
}

export interface MapViewProps {
  branches: Branch[];
  activeBranchId: string | null;
  userPosition: UserPosition | null;
  onPinClick: (branch: Branch) => void;
}

export default function MapView({ branches, activeBranchId, userPosition, onPinClick }: MapViewProps) {
  return (
    <MapContainer
      bounds={INDONESIA_BOUNDS}
      boundsOptions={{ padding: [8, 8] }}
      scrollWheelZoom={false} // cegah konflik dengan scroll halaman (PRD §4.6)
      zoomControl
      attributionControl
      className="h-full w-full rounded-card"
      style={{ minHeight: "420px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClusterLayer
        branches={branches}
        activeBranchId={activeBranchId}
        userPosition={userPosition}
        onPinClick={onPinClick}
      />
    </MapContainer>
  );
}
