"use client";

import { supabase } from "@/components/supabase";
import { useState, useEffect } from "react";

export default function MjpegStream() {
  const [isLoading, setIsLoading] = useState(true);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const streamUrl = "/api/proxy";

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Prepare the audio element when component mounts
    const fetchAudio = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const access_token = session?.access_token;
        const text = "Hello, this is a test message.";

        if (access_token) {
          const audio = await fetchAndPrepareAudio(access_token, text);
          setAudioElement(audio);
        } else {
          console.error("No access token available");
        }
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };

    fetchAudio();
  }, []);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Error loading MJPEG stream:", e);
    setIsLoading(false);
  };

  const handlePlayAudio = async () => {
    if (audioElement) {
      try {
        setIsAudioLoading(true);
        await audioElement.play();
        console.log("Audio playing");
      } catch (error) {
        console.error("Failed to play audio:", error);
      } finally {
        setIsAudioLoading(false);
      }
    } else {
      console.error("No audio element available to play");
    }
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

      <button
        onClick={handlePlayAudio}
        disabled={!audioElement || isAudioLoading}
        className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isAudioLoading ? "Loading Audio..." : "Play Audio"}
      </button>
    </div>
  );
}

// Modified to prepare audio without autoplay
async function fetchAndPrepareAudio(
  access_token: string,
  text: string
): Promise<HTMLAudioElement> {
  try {
    console.log("Fetching audio...");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/trash/tts_polly`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token,
          text,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Error fetching audio:",
        response.status,
        response.statusText
      );
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }

    console.log("Audio fetched successfully, processing...");

    const data = await response.json();
    const base64Audio = data.audio;
    const contentType = data.content_type || "audio/mpeg";

    if (!base64Audio) {
      console.error("No audio data received");
      throw new Error("No audio data received");
    }

    const byteCharacters = atob(base64Audio);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const audioBlob = new Blob([byteArray], { type: contentType });

    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.controls = true; // Optional: you can show native browser controls if you want
    audio.preload = "auto";

    console.log("Audio element prepared.");

    return audio;
  } catch (error) {
    console.error("Error in fetchAndPrepareAudio:", error);
    throw error;
  }
}
