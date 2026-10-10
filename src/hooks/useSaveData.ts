/**
 * Deteksi hemat data (PRD §4.1): navigator.connection.saveData /
 * koneksi lambat → hero menampilkan poster saja, tanpa video.
 */
import { useEffect, useState } from "react";

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

function readSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const connection = (
    navigator as Navigator & { connection?: NetworkInformationLike }
  ).connection;
  if (!connection) return false;
  if (connection.saveData) return true;
  // Anggap koneksi 2G sebagai "hemat data"
  return connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
}

export function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(readSaveData);

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: NetworkInformationLike }
    ).connection;
    if (!connection?.addEventListener) return;
    const onChange = () => setSaveData(readSaveData());
    connection.addEventListener("change", onChange);
    return () => connection.removeEventListener?.("change", onChange);
  }, []);

  return saveData;
}
