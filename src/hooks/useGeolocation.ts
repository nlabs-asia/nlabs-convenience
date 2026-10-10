/**
 * Geolocation on-demand (PRD §4.6): izin HANYA diminta saat dipanggil
 * (buka list view / tekan "Lokasi Saya"), tidak saat halaman dimuat.
 * Koordinat user hanya dipakai di browser — tidak dikirim ke server.
 */
import { useCallback, useState } from "react";

export interface UserPosition {
  lat: number;
  lng: number;
}

export type GeolocationStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "error";

export function useGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [position, setPosition] = useState<UserPosition | null>(null);

  const request = useCallback((): Promise<UserPosition | null> => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return Promise.resolve(null);
    }
    setStatus("requesting");
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(next);
          setStatus("granted");
          resolve(next);
        },
        (err) => {
          setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
      );
    });
  }, []);

  return { status, position, request };
}
