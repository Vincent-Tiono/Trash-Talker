import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // No caching to ensure live stream
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    // The URL of the MJPEG stream you want to proxy
    const streamUrl = "http://pendelcam.kip.uni-heidelberg.de/mjpg/video.mjpg";
    // const streamUrl = "http://192.168.0.100:5000/fe/mjpeg_stream?";

    // Fetch the stream from the source
    const response = await fetch(streamUrl, {
      headers: {
        Accept: "multipart/x-mixed-replace; boundary=--BoundaryString",
      },
    });

    // Check if the fetch was successful
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch stream: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the content type and other headers from the original response
    const contentType = response.headers.get("Content-Type");

    // Create a ReadableStream transform to pass through the data
    const { readable, writable } = new TransformStream();

    // Pipe the original response body to our transform stream
    if (response.body) {
      response.body.pipeTo(writable).catch((error) => {
        console.error("Error piping stream:", error);
      });
    }

    // Return the stream as the response with appropriate headers
    return new NextResponse(readable, {
      headers: {
        "Content-Type":
          contentType || "multipart/x-mixed-replace; boundary=--BoundaryString",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy the video stream" },
      { status: 500 }
    );
  }
}
