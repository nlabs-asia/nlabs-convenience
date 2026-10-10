/**
 * VideoBackground (PRD §4.1): poster prioritas tinggi (LCP candidate),
 * video lazy setelahnya. Fallback poster saat:
 * - prefers-reduced-motion aktif, atau
 * - hemat data (saveData / koneksi 2G), atau
 * - URL video belum tersedia, atau video gagal dimuat.
 * Kontrol pause/play untuk aksesibilitas.
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useSaveData } from "../../hooks/useSaveData";
import type { HeroContent } from "../../types/content";

interface VideoBackgroundProps {
  content: HeroContent;
  /** Ref wrapper — dipakai Hero untuk efek parallax. */
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function VideoBackground({ content, containerRef }: VideoBackgroundProps) {
  const reducedMotion = useReducedMotion();
  const saveData = useSaveData();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const hasVideo = Boolean(content.videoDesktopMp4 || content.videoDesktopWebm);
  const showVideo = hasVideo && !reducedMotion && !saveData && !videoFailed;

  // Poster saja → tidak ada video yang diputar
  useEffect(() => {
    if (!showVideo) setIsPlaying(false);
    else setIsPlaying(true);
  }, [showVideo]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      {/* Poster — dimuat prioritas tinggi, tidak menunggu video */}
      <picture>
        <source media="(max-width: 767px)" srcSet={content.posterMobile} />
        <img
          src={content.posterDesktop}
          alt=""
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </picture>

      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={content.posterDesktop}
          onError={() => setVideoFailed(true)}
        >
          <source media="(min-width: 768px)" src={content.videoDesktopWebm} type="video/webm" />
          <source media="(min-width: 768px)" src={content.videoDesktopMp4} type="video/mp4" />
          <source src={content.videoMobileWebm} type="video/webm" />
          <source src={content.videoMobileMp4} type="video/mp4" />
        </video>
      )}

      {/* Kontrol pause/play — hanya tampil jika video benar-benar jalan */}
      {showVideo && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Jeda video latar" : "Putar video latar"}
          className="absolute bottom-24 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 active:scale-95 sm:bottom-8"
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
