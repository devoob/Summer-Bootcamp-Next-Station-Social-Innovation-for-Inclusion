import { useState, useEffect, useRef } from "react";
import { Scan, Navigation, X, MapPin, Accessibility, ArrowRight, QrCode, Play, ExternalLink, ChevronRight } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { findExitByBarcode, MTR_STATIONS, MtrExit, MtrStation, ExternalARRoute } from "../data/mtrData";
import ARNavigator from "./ARNavigator";

interface ScanResult {
  station: MtrStation;
  exit: MtrExit;
}

type ScannerMode = "ar" | "barcode";

export default function CameraScanner() {
  const [mode, setMode] = useState<ScannerMode>("ar");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [externalArMode, setExternalArMode] = useState<{ stationId: string; routeId: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const decoderRef = useRef<Html5Qrcode | null>(null);

  // Initialize decoder once
  useEffect(() => {
    if (!decoderRef.current) {
      const el = document.createElement("div");
      el.id = "qr-decoder-hidden";
      el.style.display = "none";
      document.body.appendChild(el);
      decoderRef.current = new Html5Qrcode("qr-decoder-hidden");
    }
    return () => {
      if (decoderRef.current) {
        decoderRef.current.clear();
        decoderRef.current = null;
      }
    };
  }, []);

  const startCamera = async () => {
    // Timeout fallback for environments without camera
    const timeoutId = setTimeout(() => {
      if (!streamRef.current) {
        setScanError("Could not access camera. Please ensure camera permissions are granted.");
        setIsScanning(false);
      }
    }, 5000);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      clearTimeout(timeoutId);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
      setScanError(null);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Camera error:", err);
      setScanError("Could not access camera. Please ensure camera permissions are granted.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  // Periodic barcode scanning from video frames
  const startPeriodicScan = () => {
    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || scanResult || !decoderRef.current) return;
      const video = videoRef.current;
      if (video.readyState < 2) return;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", 0.5));
        if (!blob) return;

        const file = new File([blob], "scan.jpeg", { type: "image/jpeg" });
        const result = await decoderRef.current.scanFileV2(file, false);
        const match = findExitByBarcode(result.decodedText);
        if (match) {
          setScanResult(match);
          stopCamera();
        }
      } catch {
        // No barcode found in this frame
      }
    }, 800);
  };

  // Camera + scanner lifecycle
  useEffect(() => {
    if (mode !== "barcode") {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
      setScanResult(null);
    };
  }, [mode]);

  // Start periodic scan when camera is ready
  useEffect(() => {
    if (isScanning && mode === "barcode") {
      startPeriodicScan();
    }
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    };
  }, [isScanning, mode]);

  const dismissResult = () => {
    setScanResult(null);
  };

  const simulateScan = () => {
    // Pick a random exit that has barcode data for demo
    const barcodeExits: { station: MtrStation; exit: MtrExit }[] = [];
    for (const station of MTR_STATIONS) {
      for (const exit of station.exits) {
        if (exit.barcodeId) {
          barcodeExits.push({ station, exit });
        }
      }
    }
    if (barcodeExits.length === 0) return;
    const pick = barcodeExits[Math.floor(Math.random() * barcodeExits.length)];
    setScanResult(pick);
    stopCamera();
  };

  const switchMode = (newMode: ScannerMode) => {
    setScanResult(null);
    setScanError(null);
    setMode(newMode);
  };

  return (
    <div className="flex flex-col h-full" id="camera-scanner-panel">
      {/* Mode toggle */}
      <div className="bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg">
          <button
            onClick={() => switchMode("ar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              mode === "ar" ? "bg-white text-[#ac2e44] shadow-sm" : "text-zinc-600"
            }`}
          >
            <Navigation size={16} />
            AR Navigation
          </button>
          <button
            onClick={() => switchMode("barcode")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              mode === "barcode" ? "bg-white text-[#ac2e44] shadow-sm" : "text-zinc-600"
            }`}
          >
            <QrCode size={16} />
            Scan Barcode
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {mode === "ar" ? (
          <div className="h-full overflow-y-auto">
            {externalArMode ? (
              <div>
                <button onClick={() => setExternalArMode(null)}
                  className="flex items-center gap-2 text-blue-600 text-base font-semibold hover:underline py-2 px-1">
                  <ChevronRight size={20} className="rotate-180" /> Back to Scanner
                </button>
                <ARNavigator initialStationId={externalArMode.stationId} />
              </div>
            ) : (
              <ARNavigator />
            )}
          </div>
        ) : (
          <div className="relative h-full bg-zinc-950 overflow-hidden">
            {/* Native camera video */}
            {scanError ? (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center max-w-sm">
                  <Scan size={48} className="text-orange-400 mx-auto mb-4" />
                  <p className="text-zinc-300 text-lg font-semibold mb-2">Camera unavailable</p>
                  <p className="text-zinc-400 text-base">{scanError}</p>
                  <button onClick={() => switchMode("ar")}
                    className="mt-4 px-5 py-2.5 bg-[#ac2e44] text-white rounded-lg text-base font-semibold">
                    Switch to AR Navigation
                  </button>
                </div>
              </div>
            ) : (
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            )}

            {/* Scanning overlay + demo button */}
            {isScanning && !scanResult && (
              <>
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#ac2e44]/60 rounded-lg">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#ac2e44] rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#ac2e44] rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#ac2e44] rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#ac2e44] rounded-br-lg" />
                  </div>
                </div>
                <div className="absolute bottom-8 left-4 right-4 text-center flex flex-col items-center gap-3">
                  <div>
                    <p className="text-white text-base font-semibold">Point camera at an exit barcode</p>
                    <p className="text-zinc-400 text-sm mt-1">Barcode scanners are located at station exits</p>
                  </div>
                  <button onClick={simulateScan}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#ac2e44] rounded-full text-sm font-semibold shadow-lg hover:bg-zinc-100 transition-all">
                    <Play size={16} /> Demo Scan
                  </button>
                </div>
              </>
            )}

            {/* Scanning text */}
            {!isScanning && !scanResult && !scanError && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                <div className="text-center">
                  <Scan size={48} className="text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400 text-lg mb-4">Starting camera...</p>
                  <button onClick={simulateScan}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#ac2e44] rounded-full text-sm font-semibold shadow-lg hover:bg-zinc-100 transition-all mx-auto">
                    <Play size={16} /> Demo Scan
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {scanError && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 p-6">
                <div className="text-center max-w-sm">
                  <Scan size={48} className="text-orange-400 mx-auto mb-4" />
                  <p className="text-zinc-300 text-lg font-semibold mb-2">Camera unavailable</p>
                  <p className="text-zinc-400 text-base">{scanError}</p>
                  <div className="flex flex-col gap-2 mt-4">
                    <button onClick={() => switchMode("ar")}
                      className="px-5 py-2.5 bg-[#ac2e44] text-white rounded-lg text-base font-semibold">
                      Switch to AR Navigation
                    </button>
                    <button onClick={simulateScan}
                      className="px-5 py-2.5 bg-white text-[#ac2e44] rounded-lg text-base font-semibold border border-[#ac2e44] hover:bg-zinc-50 transition-all">
                      Demo Scan (No Camera)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Scan result card */}
            {scanResult && (
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
                  <div className="bg-[#ac2e44] px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Barcode Scanned</p>
                      <p className="text-white text-lg font-bold">{scanResult.station.name} Station ({scanResult.station.chineseName})</p>
                    </div>
                    <button onClick={dismissResult} className="p-1 rounded hover:bg-white/20 text-white">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-lg bg-[#ac2e44]/10 flex items-center justify-center text-[#ac2e44] font-bold text-base shrink-0">
                        {scanResult.exit.name}
                      </span>
                      <div>
                        <p className="font-semibold text-lg text-zinc-900">Exit {scanResult.exit.name}</p>
                        <p className="text-sm text-zinc-500">{scanResult.exit.description}</p>
                        <p className="text-sm text-zinc-500">{scanResult.exit.chineseDescription}</p>
                      </div>
                    </div>

                    {scanResult.exit.hasLift && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                        <Accessibility size={18} className="text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 font-medium">This exit has a passenger lift (step-free).</p>
                      </div>
                    )}

                    {!scanResult.exit.hasLift && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                        <Accessibility size={18} className="text-orange-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-orange-800 font-medium">No lift at this exit.</p>
                      </div>
                    )}

                    {scanResult.exit.liftLocationHint && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                        <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-800 mb-0.5">Lift Location</p>
                          <p className="text-sm text-blue-700">{scanResult.exit.liftLocationHint}</p>
                        </div>
                      </div>
                    )}

                    {scanResult.exit.alternativeExit && (
                      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex items-start gap-2">
                        <ArrowRight size={18} className="text-zinc-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-zinc-800 mb-0.5">Alternative</p>
                          <p className="text-sm text-zinc-600">{scanResult.exit.alternativeExit}</p>
                        </div>
                      </div>
                    )}

                    {!scanResult.exit.hasLift && (() => {
                      const matchingRoute = scanResult.station.externalRoutes.find(
                        r => r.fromExit === scanResult.exit.name
                      );
                      return matchingRoute ? (
                        <button onClick={() => setExternalArMode({ stationId: scanResult.station.id, routeId: matchingRoute.id })}
                          className="w-full py-3 rounded-lg bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                          <ExternalLink size={18} /> Navigate to Exit {matchingRoute.toExit} (Lift) — {matchingRoute.distance}m
                        </button>
                      ) : null;
                    })()}

                    <button onClick={dismissResult}
                      className={`w-full py-3 rounded-lg text-base font-semibold transition-all ${
                        scanResult.exit.hasLift
                          ? "bg-[#ac2e44] text-white hover:bg-red-800"
                          : "bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200"
                      }`}>
                      Scan Another Barcode
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
