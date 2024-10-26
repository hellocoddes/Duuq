// dashboard/live/page.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DAMAGE_THRESHOLD = 70;
const FRAME_PROCESSING_INTERVAL = 100; // Process every 100ms instead of every frame
const DETECTION_BATCH_SIZE = 3; // Process every 3rd frame
const IMAGE_SEND_INTERVAL = 10000; // Send image every 10 seconds

interface AlertType {
  id: number;
  message: string;
  severity: string;
  timestamp: string;
}

const LiveVideoPlayerUI: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processingRef = useRef<boolean>(false);
  const frameCountRef = useRef<number>(0);
  const lastProcessedTimeRef = useRef<number>(0);

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [damageLevel, setDamageLevel] = useState<number>(0);

  const addAlert = useCallback((message: string, severity: string) => {
    setAlerts((prev) => [{
      id: Date.now(),
      message,
      severity,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 5));
  }, []);

  const processFrame = useCallback(async () => {
    if (!canvasRef.current || !videoRef.current || processingRef.current) return;

    const now = performance.now();
    if (now - lastProcessedTimeRef.current < FRAME_PROCESSING_INTERVAL) return;

    frameCountRef.current++;
    if (frameCountRef.current % DETECTION_BATCH_SIZE !== 0) return;

    processingRef.current = true;
    lastProcessedTimeRef.current = now;

    const ctx = canvasRef.current?.getContext("2d", { alpha: false });
    ctx?.drawImage(videoRef.current, 0, 0, 640, 480);


    try {
      const imageData = canvasRef.current.toDataURL("image/png");

      if (imageData) {
        setTimeout(async () => {
          const formData = new FormData();
          formData.append('file', dataURItoBlob(imageData), 'image.png');

          const response = await fetch("http://127.0.0.1:8000/detect-threat/", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (result.alert) {
            const currentDamageLevel = result.alert === "dangerous" ? DAMAGE_THRESHOLD + 1 : 0;
            setDamageLevel(currentDamageLevel);
            if (currentDamageLevel > DAMAGE_THRESHOLD) {
              addAlert(result.description || "Threat analysis completed.", result.alert);
            }
          }

        }, IMAGE_SEND_INTERVAL);
      } else {
        console.warn("No valid image data found. Skipping server request.");
      }

    } catch (error) {
      console.error("Detection error:", error);
    } finally {
      processingRef.current = false;
    }
  }, [addAlert]);

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'environment',
            frameRate: { ideal: 30 }
          },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsStreaming(true);

          const animate = () => {
            processFrame();
            if (streamRef.current) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setIsStreaming(false);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [processFrame]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto p-4">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Live Video</h1>
          {damageLevel > DAMAGE_THRESHOLD && (
            <Alert variant="destructive" className="w-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>High Damage Detected!</AlertTitle>
              <AlertDescription>
                Current damage level: {damageLevel.toFixed(1)}%
              </AlertDescription>
            </Alert>
          )}
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <video ref={videoRef} className="w-full h-auto" autoPlay muted />
            <canvas ref={canvasRef} className="hidden" width="640" height="480" />
          </div>
          <div className="md:col-span-1">
            {alerts.map(alert => (
              <Alert key={alert.id}  className="mt-2">
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveVideoPlayerUI;
