"use client";

import { useState, useEffect } from "react";

export default function MjpegStream() {
  const [isLoading, setIsLoading] = useState(true);
  const streamUrl = "/api/proxy";

  // Simple handler for when the image loads
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Simple handler for image errors
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Error loading MJPEG stream:", e);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">MJPEG Stream Test</h1>

      <div className="relative w-full max-w-lg aspect-video bg-gray-200 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        <img
          src={streamUrl}
          alt="MJPEG Stream"
          className="w-full h-full object-contain"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      <p className="mt-4 text-center text-gray-600">
        {isLoading
          ? "Loading stream..."
          : "Stream is active - if you see video, the proxy is working!"}
      </p>
    </div>
  );
}
