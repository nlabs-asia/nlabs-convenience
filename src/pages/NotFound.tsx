/** Halaman 404 — fallback route. */
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-primary-dark">404</p>
      <h1 className="mt-2 text-3xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
