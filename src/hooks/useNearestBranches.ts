/**
 * Urutkan cabang berdasarkan jarak dari posisi user (Haversine, PRD §4.6).
 * Koordinat user hanya dipakai di browser — tidak dikirim ke server.
 */
import { useMemo } from "react";
import { haversineKm } from "../utils/haversine";
import type { Branch } from "../types/content";
import type { UserPosition } from "./useGeolocation";

export interface BranchWithDistance {
  branch: Branch;
  /** null bila posisi user belum tersedia */
  distance: number | null;
}

export function useNearestBranches(
  branches: Branch[],
  position: UserPosition | null,
): BranchWithDistance[] {
  return useMemo(() => {
    if (!position) {
      return branches.map((branch) => ({ branch, distance: null }));
    }
    return branches
      .map((branch) => ({
        branch,
        distance: haversineKm(position.lat, position.lng, branch.lat, branch.lng),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [branches, position]);
}
