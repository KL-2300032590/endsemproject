import React, { useEffect, useRef, useState } from "react";
import intro from "../assets/intro3.mp4";

const Loading = ({ muted }) => {
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasVideoPlayed = localStorage.getItem("hasIntroVideoPlayed");

    if (hasVideoPlayed) {
      setShowVideo(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      video.play().catch(console.error);
    };

    const handleEnded = () => {
      localStorage.setItem("hasIntroVideoPlayed", "true");
      setShowVideo(false);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);

    video.load();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  if (!showVideo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      <video
        ref={videoRef}
        playsInline
        muted={muted}
        className="h-screen w-screen object-cover"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <source src={intro} type="video/mp4" />
      </video>
    </div>
  );
};

export default Loading;
