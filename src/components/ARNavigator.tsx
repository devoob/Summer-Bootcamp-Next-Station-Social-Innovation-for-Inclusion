import { useState, useEffect, useRef } from "react";
import { Camera, Compass, ArrowRight, ArrowLeftRight, Volume2, VolumeX, RotateCcw, CheckCircle2, Play, Pause, ChevronRight, Info, MapPin, Accessibility, ExternalLink } from "lucide-react";
import { MTR_STATIONS, ExternalARRoute, ExternalWaypoint, MtrStation } from "../data/mtrData";

interface ARNavigatorProps {
  initialStationId?: string;
}

type LocalizationPhase = "localizing" | "positioned" | "navigating";

export default function ARNavigator({ initialStationId = "hku" }: ARNavigatorProps) {
  const [selectedStation, setSelectedStation] = useState<MtrStation>(
    MTR_STATIONS.find(s => s.id === initialStationId) || MTR_STATIONS[0]
  );
  const [selectedRoute, setSelectedRoute] = useState<ExternalARRoute | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isLiveCamera, setIsLiveCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [simulatedDistance, setSimulatedDistance] = useState<number>(0);
  const [isRouteCompleted, setIsRouteCompleted] = useState<boolean>(false);
  const [localizationPhase, setLocalizationPhase] = useState<LocalizationPhase>("localizing");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const walkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (selectedStation.externalRoutes.length > 0) {
      setSelectedRoute(selectedStation.externalRoutes[0]);
    } else {
      setSelectedRoute(null);
    }
    setCurrentStepIndex(0);
    setIsRouteCompleted(false);
    setIsWalking(false);
    setSimulatedDistance(0);
    setLocalizationPhase("localizing");
  }, [selectedStation]);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsRouteCompleted(false);
    setIsWalking(false);
    setSimulatedDistance(0);
    setLocalizationPhase("localizing");
  }, [selectedRoute]);

  useEffect(() => {
    if (isLiveCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isLiveCamera]);

  useEffect(() => {
    if (localizationPhase === "localizing") {
      const toPositioned = setTimeout(() => setLocalizationPhase("positioned"), 3000);
      return () => clearTimeout(toPositioned);
    }
    if (localizationPhase === "positioned") {
      const toNavigating = setTimeout(() => setLocalizationPhase("navigating"), 3000);
      return () => clearTimeout(toNavigating);
    }
  }, [localizationPhase]);

  const speakInstruction = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (selectedRoute && selectedRoute.waypoints[currentStepIndex]) {
      const step = selectedRoute.waypoints[currentStepIndex];
      setSimulatedDistance(step.distance);
      if (localizationPhase === "navigating") {
        speakInstruction(step.instruction);
      }
    }
  }, [currentStepIndex, selectedRoute, localizationPhase]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err: any) {
      console.error("Camera access failed:", err);
      setCameraError("Could not access camera. Displaying simulator instead.");
      setIsLiveCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleNextStep = () => {
    if (!selectedRoute || isRouteCompleted) return;
    if (currentStepIndex < selectedRoute.waypoints.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsWalking(false);
    } else {
      setIsRouteCompleted(true);
      setIsWalking(false);
      speakInstruction("You have arrived at your destination successfully.");
    }
  };

  useEffect(() => {
    if (!isWalking || !selectedRoute || isRouteCompleted) {
      if (walkIntervalRef.current) { clearInterval(walkIntervalRef.current); walkIntervalRef.current = null; }
      return;
    }
    const activeStep = selectedRoute.waypoints[currentStepIndex];
    if (!activeStep) return;
    if (activeStep.distance <= 0) {
      setIsWalking(false);
      handleNextStep();
      return;
    }
    walkIntervalRef.current = setInterval(() => {
      setSimulatedDistance(prev => {
        const next = Number((prev - 0.5).toFixed(1));
        return next <= 0 ? 0 : next;
      });
    }, 150);
    return () => { if (walkIntervalRef.current) { clearInterval(walkIntervalRef.current); walkIntervalRef.current = null; } };
  }, [isWalking, currentStepIndex, selectedRoute, isRouteCompleted]);

  useEffect(() => {
    if (isWalking && selectedRoute && !isRouteCompleted && simulatedDistance <= 0) {
      const activeStep = selectedRoute.waypoints[currentStepIndex];
      if (activeStep && activeStep.distance > 0) {
        setIsWalking(false);
        handleNextStep();
      }
    }
  }, [simulatedDistance, isWalking]);

  const handleRestartRoute = () => {
    setCurrentStepIndex(0);
    setIsRouteCompleted(false);
    setIsWalking(false);
    setLocalizationPhase("localizing");
    if (selectedRoute && selectedRoute.waypoints.length > 0) setSimulatedDistance(selectedRoute.waypoints[0].distance);
  };

  const activeWaypoint: ExternalWaypoint | null = selectedRoute && selectedRoute.waypoints[currentStepIndex]
    ? selectedRoute.waypoints[currentStepIndex] : null;

  const renderDirectionIcon = (dir: string) => {
    const isLeft = dir === "walk_left";
    const isRight = dir === "walk_right";

    if (dir === "cross_road") {
      return (
        <div className="flex flex-col items-center justify-center animate-pulse">
          <div className="px-4 py-2 rounded-xl bg-amber-500/90 text-black font-black text-sm tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center gap-2 border border-amber-300">
            <ArrowLeftRight size={20} /> CROSS ROAD
          </div>
        </div>
      );
    }

    if (dir === "enter_station") {
      return (
        <div className="flex flex-col items-center justify-center animate-bounce">
          <div className="px-4 py-2 rounded-xl bg-sky-500/90 text-white font-black text-sm tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.6)] flex items-center gap-2 border border-sky-300">
            <ExternalLink size={20} /> ENTER STATION LIFT
          </div>
        </div>
      );
    }

    if (dir === "arrive") {
      return (
        <div className="flex flex-col items-center justify-center animate-bounce">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.8)]">
            <CheckCircle2 size={36} className="text-emerald-400" />
          </div>
        </div>
      );
    }

    return (
      <div className="relative flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
        {/* Ground Pulse Rings (Google Maps AR ground anchor) */}
        <div className="absolute w-36 h-36 rounded-full border-2 border-sky-400/30 animate-ping [transform:rotateX(75deg)_translateZ(-20px)] pointer-events-none" />
        <div className="absolute w-28 h-28 rounded-full bg-sky-500/10 [transform:rotateX(75deg)_translateZ(-20px)] blur-md pointer-events-none" />

        {/* 3D Floating Arrow Body */}
        <div
          className="relative transition-transform duration-500 ease-out [transform-style:preserve-3d]"
          style={{
            transform: `rotateX(55deg) rotateZ(0deg)`,
            animation: 'ar3DFloat 2.5s ease-in-out infinite'
          }}
        >
          <svg width="110" height="110" viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]">
            <defs>
              <linearGradient id="googleArrowGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="bevelGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {isLeft ? (
              // Left turn arrow — L-shape pointing left
              <>
                <path d="M 45 88 L 45 40 L 5 40 L 25 28 L 25 52 L 45 40 L 55 40 L 55 88 Z" fill="#082f49" transform="translate(0, 5)" />
                <path d="M 45 88 L 45 40 L 5 40 L 25 28 L 25 52 L 45 40 L 55 40 L 55 88 Z" fill="url(#googleArrowGrad)" stroke="#7dd3fc" strokeWidth="2" />
                <path d="M 45 88 L 45 40 L 5 40 L 25 28 Z" fill="url(#bevelGrad)" />
              </>
            ) : isRight ? (
              // Right turn arrow — L-shape pointing right
              <>
                <path d="M 45 88 L 45 40 L 55 40 L 95 40 L 75 28 L 75 52 L 55 40 L 55 88 Z" fill="#082f49" transform="translate(0, 5)" />
                <path d="M 45 88 L 45 40 L 55 40 L 95 40 L 75 28 L 75 52 L 55 40 L 55 88 Z" fill="url(#googleArrowGrad)" stroke="#7dd3fc" strokeWidth="2" />
                <path d="M 45 88 L 45 40 L 55 40 L 95 40 L 75 28 Z" fill="url(#bevelGrad)" />
              </>
            ) : (
              // Straight forward arrow
              <>
                <path d="M50 5 L90 85 L50 68 L10 85 Z" fill="#082f49" transform="translate(0, 6)" />
                <path d="M50 5 L90 85 L50 68 L10 85 Z" fill="url(#googleArrowGrad)" stroke="#7dd3fc" strokeWidth="2" />
                <path d="M50 5 L50 68 L10 85 Z" fill="url(#bevelGrad)" />
              </>
            )}
          </svg>
        </div>

        <style>{`
          @keyframes ar3DFloat {
            0%, 100% { transform: rotateX(55deg) rotateZ(0deg) translateY(0px); }
            50% { transform: rotateX(55deg) rotateZ(0deg) translateY(-12px); }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col-reverse md:flex-row gap-4 md:gap-6" id="ar-navigator-panel">
      <div className="w-full md:w-80 bg-white border border-zinc-200 rounded-xl p-4 md:p-5 flex flex-col gap-4 md:gap-5 shadow-sm">
        <div>
          <h3 className="text-base md:text-lg font-bold text-zinc-600 mb-3">1. Select Station</h3>
          <div className="flex flex-col gap-2">
            {MTR_STATIONS.map((station) => (
              <button key={station.id} onClick={() => setSelectedStation(station)}
                className={`flex items-center justify-between p-4 rounded-lg transition-all border text-left ${
                  selectedStation.id === station.id
                    ? "bg-white border-[#ac2e44] shadow-sm"
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                }`}>
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full ${station.color} shrink-0`} />
                  <div>
                    <div className="font-semibold text-lg text-zinc-900">{station.name}</div>
                    <div className="text-base text-zinc-500">{station.chineseName}</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-zinc-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-4">
          <h3 className="text-base md:text-lg font-bold text-zinc-600 mb-3">2. Find Lift Exit</h3>
          {selectedStation.externalRoutes.length > 0 ? (
            <div className="flex flex-col gap-2">
              {selectedStation.externalRoutes.map((route) => {
                const fromExitData = selectedStation.exits.find(e => e.name === route.fromExit);
                return (
                  <button key={route.id} onClick={() => setSelectedRoute(route)}
                    className={`flex flex-col p-4 rounded-lg transition-all border text-left ${
                      selectedRoute?.id === route.id
                        ? "bg-white border-[#ac2e44] shadow-sm"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="px-3 py-1 rounded text-sm font-semibold bg-blue-600 text-white flex items-center gap-1"><Accessibility size={14} /> Lift Exit</span>
                      <span className="text-sm text-zinc-500 font-medium">{route.distance}m walk</span>
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <span className={`font-semibold ${fromExitData && !fromExitData.hasLift ? 'text-orange-600' : 'text-zinc-900'}`}>
                        Exit {route.fromExit}
                      </span>
                      <ArrowRight size={16} className="text-zinc-400" />
                      <span className="font-semibold text-[#ac2e44]">Exit {route.toExit}</span>
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">{route.fromDescription.split('-')[0]?.trim()}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-base text-zinc-400 italic p-4 text-center border border-dashed border-zinc-300 rounded-lg">
              All exits at this station have lifts available.
            </div>
          )}
        </div>

        {selectedRoute && (
          <div className="flex-1 border-t border-zinc-200 pt-4 overflow-y-auto max-h-[300px] pr-1">
            <h4 className="text-base md:text-lg font-bold text-zinc-600 mb-3">Street Steps</h4>
            <div className="flex flex-col gap-2">
              {selectedRoute.waypoints.map((wp, index) => (
                <div key={wp.step} onClick={() => setCurrentStepIndex(index)}
                  className={`flex gap-3 p-4 rounded-lg transition-all text-left cursor-pointer border ${
                    index === currentStepIndex
                      ? "bg-white border-[#ac2e44] shadow-sm"
                      : index < currentStepIndex
                      ? "bg-zinc-50 border-zinc-200 opacity-70"
                      : "bg-white border-zinc-200"
                  }`}>
                  <div className="flex flex-col items-center">
                    <span className={`w-10 h-10 rounded flex items-center justify-center text-base font-bold ${
                      index === currentStepIndex ? "bg-blue-600 text-white" : index < currentStepIndex ? "bg-zinc-300 text-zinc-600" : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                    }`}>{wp.step}</span>
                    {index < selectedRoute.waypoints.length - 1 && <div className="w-0.5 h-8 bg-zinc-200 my-1" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-base md:text-lg font-semibold text-zinc-900 leading-snug">{wp.instruction}</div>
                    {wp.landmark && <div className="text-base text-zinc-500 mt-1 flex items-center gap-1"><MapPin size={16} /> {wp.landmark}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden relative flex flex-col min-h-[460px] md:min-h-[560px] shadow-sm">
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-zinc-950/90 to-transparent px-4 pt-4 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsLiveCamera(!isLiveCamera)}
                className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded text-sm md:text-base font-semibold shadow-lg backdrop-blur-md transition-all border ${
                  isLiveCamera ? "bg-[#ac2e44] text-white border-transparent" : "bg-zinc-900/90 text-zinc-200 border-zinc-700 hover:bg-zinc-800"
                }`}>
                <Camera size={16} className={isLiveCamera ? "animate-pulse" : ""} />
                {isLiveCamera ? "Live" : "Simulated"}
              </button>

              <button onClick={() => {
                  const next = !voiceEnabled;
                  setVoiceEnabled(next);
                  if (!next && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="p-2 md:p-3 rounded bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 border border-zinc-700 shadow-lg backdrop-blur-md flex items-center justify-center"
                title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
                aria-label={voiceEnabled ? "Mute Voice" : "Enable Voice"}>
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>

            <div className="hidden md:flex bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded text-sm font-semibold items-center gap-2 border border-zinc-700 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span className="text-zinc-300">LIFT FINDER</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-950 min-h-[360px]">
          {isLiveCamera ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover absolute inset-0" />
          ) : (
            <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[150%] border-t-[3px] border-[#ac2e44] origin-bottom [transform:rotateX(75deg)] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              </div>

              {localizationPhase === "navigating" && isRouteCompleted && (
                <div className="relative z-10 flex flex-col items-center justify-center bg-zinc-900 border-2 border-[#ac2e44] p-8 rounded-lg shadow-2xl max-w-sm text-center mx-4">
                  <div className="w-20 h-20 bg-zinc-950 border-2 border-blue-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} className="text-blue-500 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Lift Exit Reached!</h4>
                  <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                    You have safely reached <strong className="text-[#ac2e44]">Exit {selectedRoute?.toExit}</strong> with step-free lift access.
                  </p>
                  <button onClick={handleRestartRoute}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded text-lg font-semibold bg-[#ac2e44] hover:bg-red-800 text-white transition-all shadow-md w-full">
                    <RotateCcw size={20} /> Navigate Again
                  </button>
                </div>
              )}
            </div>
          )}

          {localizationPhase === "localizing" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white/70 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-white/70 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-white/70 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white/70 rounded-br-xl" />
                <div className="absolute left-4 right-4 h-0.5 bg-[#ac2e44] shadow-[0_0_10px_rgba(172,46,68,0.9)]"
                  style={{ animation: 'scanLine 2.5s ease-in-out infinite' }} />
              </div>
              <div className="absolute w-52 h-52 rounded-full border border-[#ac2e44]/10 animate-ping pointer-events-none" />
              <div className="mt-6 text-center">
                <p className="text-white text-lg md:text-xl font-semibold">Scanning street environment...</p>
                <p className="text-zinc-400 text-base mt-1.5">Point camera at street signs or building numbers</p>
              </div>
              <style>{`@keyframes scanLine{0%,100%{top:8%}50%{top:88%}}`}</style>
            </div>
          )}

          {localizationPhase === "positioned" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                <CheckCircle2 size={48} className="text-blue-500 animate-[bounce_0.5s_ease-in-out]" />
              </div>
              <p className="text-white text-xl md:text-2xl font-bold mt-4">Position locked!</p>
            </div>
          )}

          {localizationPhase === "navigating" && selectedRoute && !isRouteCompleted && (
            <>
              {/* Layer 1: Google AR Center Navigation HUD */}
              <div className="absolute inset-x-0 top-12 bottom-28 pointer-events-none z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                  {/* 3D AR Arrow Component */}
                  {activeWaypoint && renderDirectionIcon(activeWaypoint.direction)}

                  {/* Compact Distance Badge Floating Below */}
                  <div className="bg-zinc-950/90 border border-zinc-700/80 px-5 py-2 md:px-6 md:py-2.5 rounded-full flex items-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
                    <span className="text-xs md:text-sm text-zinc-400 font-medium uppercase tracking-wider">Distance</span>
                    <span className="text-lg md:text-xl font-black text-[#FFD700]">{simulatedDistance}m</span>
                  </div>
                </div>
              </div>

              {/* Layer 2: Compact Bottom Info Sheet */}
              <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-1.5rem)] max-w-md pointer-events-auto">
                <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-xl p-4 md:p-5 shadow-xl">
                  <div className="text-xs md:text-sm font-semibold text-zinc-400 uppercase tracking-wider">Target</div>
                  <div className="text-base md:text-xl font-bold text-white mt-1">
                    Exit {selectedRoute.toExit} (Lift)
                  </div>
                  <div className="text-sm md:text-base text-zinc-400 mt-1 truncate">
                    Step-Free Street Path — No stairs or slopes
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {localizationPhase === "navigating" && selectedRoute && (
          <div className="bg-white border-t border-zinc-200 p-4 md:p-5 relative z-20">
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${selectedRoute.waypoints.length > 0 ? ((currentStepIndex + 1) / selectedRoute.waypoints.length) * 100 : 0}%` }} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-semibold text-white bg-blue-600 px-4 py-1.5 rounded">
                    Step {currentStepIndex + 1} of {selectedRoute.waypoints.length}
                  </span>
                  {activeWaypoint?.landmark && (
                    <span className="text-base text-zinc-500 flex items-center gap-1">
                      <MapPin size={16} /> {activeWaypoint.landmark}
                    </span>
                  )}
                </div>
                <p className="text-lg md:text-xl font-bold text-zinc-900 leading-snug">
                  {activeWaypoint?.instruction}
                </p>
                <p className="text-base text-zinc-500 mt-1">
                  {activeWaypoint?.chineseInstruction}
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                {isRouteCompleted ? (
                  <button onClick={handleRestartRoute}
                    className="w-full md:w-auto px-6 py-3 text-base font-semibold bg-zinc-100 text-zinc-700 rounded-lg border border-zinc-200 hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5">
                    <RotateCcw size={16} /> Restart
                  </button>
                ) : (
                  <>
                    <button onClick={() => setIsWalking(!isWalking)}
                      className={`w-full md:w-auto px-6 py-3 text-base font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm ${
                        isWalking ? "bg-orange-500 hover:bg-orange-400 text-zinc-900" : "bg-[#ac2e44] hover:bg-red-800 text-white"
                      }`}>
                      {isWalking ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Walk</>}
                    </button>
                    <button onClick={handleNextStep} disabled={isWalking}
                      className="w-full md:w-auto px-6 py-3 text-base font-semibold bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      Next Step
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="absolute top-24 left-4 right-4 bg-zinc-900/95 border border-orange-500/40 px-4 py-3 rounded flex items-center gap-3 z-30 text-base text-orange-200 shadow-xl backdrop-blur-md">
            <Info size={18} className="text-orange-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
