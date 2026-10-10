/**
 * Router aplikasi — Family Mart Indonesia landing page.
 * Route sesuai PRD: `/`, `/promo`, `/promo/:slug` (+ fallback 404).
 * Halaman promo di-code-split (React.lazy) agar tidak masuk bundle awal.
 */
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const PromoList = lazy(() => import("./pages/PromoList"));
const PromoDetail = lazy(() => import("./pages/PromoDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageFallback() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-label="Memuat halaman"
    >
      <div className="h-10 w-10 animate-pulse rounded-full bg-primary-light" />
    </div>
  );
}

export function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/promo" element={<PromoList />} />
          <Route path="/promo/:slug" element={<PromoDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
