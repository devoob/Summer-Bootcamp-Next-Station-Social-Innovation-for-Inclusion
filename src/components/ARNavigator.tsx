import { useState, useEffect, useRef } from "react";
import { Camera, Compass, ArrowUp, ArrowLeft, ArrowRight, Volume2, VolumeX, RotateCcw, ArrowUpRight, AlertCircle, CheckCircle2, Play, Pause, ChevronRight, Info, MapPin, Accessibility } from "lucide-react";
import { MTR_STATIONS, ARRoute, ARWaypoint, MtrStation } from "../data/mtrData";

interface ARNavigatorProps {
  initialStationId?: string;
}

type LocalizationPhase = "localizing" | "positioned" | "navigating";

export default function ARNavigator({ initialStationId = "central" }: ARNavigatorProps) {
  const [selectedStation, setSelectedStation] = useState<MtrStation>(
    MTR_STATIONS.find(s => s.id === initialStationId) || MTR_STATIONS[0]
  );
  const [selectedRoute, setSelectedRoute] = useState<ARRoute | null>(null);
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
    if (selectedStation.arRoutes.length > 0) {
      setSelectedRoute(selectedStation.arRoutes[0]);
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
      const toNavigating = setTimeout(() => setLocalizationPhase("navigating"), 1500);
      return () => clearTimeout(toNavigating);
    }
  }, [localizationPhase]);

  const speakInstruction = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (selectedRoute && selectedRoute.waypoints[currentStepIndex]) {
      const step = selectedRoute.waypoints[currentStepIndex];
      speakInstruction(step.instruction);
      setSimulatedDistance(step.distance);
    }
  }, [currentStepIndex, selectedRoute]);

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

  useEffect(() => {
    if (isWalking && selectedRoute) {
      const activeStep = selectedRoute.waypoints[currentStepIndex];
      if (activeStep.distance <= 0) { handleNextStep(); return; }

      walkIntervalRef.current = setInterval(() => {
        setSimulatedDistance(prev => {
          if (prev <= 0.5) {
            clearInterval(walkIntervalRef.current!);
            setIsWalking(false);
            handleNextStep();
            return 0;
          }
          return Number((prev - 0.5).toFixed(1));
        });
      }, 150);
    } else {
      if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
    }
    return () => { if (walkIntervalRef.current) clearInterval(walkIntervalRef.current); };
  }, [isWalking, currentStepIndex, selectedRoute]);

  const handleNextStep = () => {
    if (!selectedRoute) return;
    if (currentStepIndex < selectedRoute.waypoints.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsWalking(false);
    } else {
      setIsRouteCompleted(true);
      setIsWalking(false);
      speakInstruction("You have arrived at your destination successfully.");
    }
  };

  const handleRestartRoute = () => {
    setCurrentStepIndex(0);
    setIsRouteCompleted(false);
    setIsWalking(false);
    setLocalizationPhase("localizing");
    if (selectedRoute) setSimulatedDistance(selectedRoute.waypoints[0].distance);
  };

  const activeWaypoint: ARWaypoint | null = selectedRoute && selectedRoute.waypoints[currentStepIndex]
    ? selectedRoute.waypoints[currentStepIndex] : null;

  const renderDirectionIcon = (dir: string) => {
    const size = 40;
    switch (dir) {
      case "forward": return <ArrowUp size={size} className="animate-pulse text-emerald-400" />;
      case "left": return <ArrowLeft size={size} className="animate-bounce text-amber-400" />;
      case "right": return <ArrowRight size={size} className="animate-bounce text-amber-400" />;
      case "up_elevator": return (
        <div className="flex flex-col items-center justify-center animate-pulse text-sky-400">
          <span className="text-base font-bold mb-1">LIFT UP</span>
          <div className="border border-sky-400 px-4 py-2 rounded bg-sky-950/80 font-bold text-xl flex items-center gap-1"><Accessibility size={20} /> ▲</div>
        </div>
      );
      case "down_elevator": return (
        <div className="flex flex-col items-center justify-center animate-pulse text-sky-400">
          <span className="text-base font-bold mb-1">LIFT DOWN</span>
          <div className="border border-sky-400 px-4 py-2 rounded bg-sky-950/80 font-bold text-xl flex items-center gap-1"><Accessibility size={20} /> ▼</div>
        </div>
      );
      case "up_escalator": return (
        <div className="flex flex-col items-center justify-center text-indigo-400 animate-pulse">
          <span className="text-base font-bold mb-1">ESCALATOR UP</span>
          <ArrowUpRight size={size} />
        </div>
      );
      case "arrive": return <CheckCircle2 size={size} className="text-emerald-400 animate-bounce" />;
      default: return <Compass size={size} className="text-white animate-spin" />;
    }
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
          <h3 className="text-base md:text-lg font-bold text-zinc-600 mb-3">2. Accessible Path</h3>
          {selectedStation.arRoutes.length > 0 ? (
            <div className="flex flex-col gap-2">
              {selectedStation.arRoutes.map((route) => (
                <button key={route.id} onClick={() => setSelectedRoute(route)}
                  className={`flex flex-col p-4 rounded-lg transition-all border text-left ${
                    selectedRoute?.id === route.id
                      ? "bg-white border-[#ac2e44] shadow-sm"
                      : "bg-white border-zinc-200 hover:border-zinc-300"
                  }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-3 py-1 rounded text-sm font-semibold bg-[#ac2e44] text-white flex items-center gap-1"><Accessibility size={14} /> Accessible Path</span>
                  </div>
                  <div className="text-lg font-semibold text-zinc-900">{route.from}</div>
                  <div className="text-base text-zinc-500 mt-1 flex items-center gap-1.5">
                    <span>to</span>
                    <span className="font-semibold text-[#ac2e44]">{route.to}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-base text-zinc-400 italic p-4 text-center border border-dashed border-zinc-300 rounded-lg">
              No AR routes mapped yet. Choose Central or Mong Kok.
            </div>
          )}
        </div>

        {selectedRoute && (
          <div className="flex-1 border-t border-zinc-200 pt-4 overflow-y-auto max-h-[300px] pr-1">
            <h4 className="text-base md:text-lg font-bold text-zinc-600 mb-3">Path Steps</h4>
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
                      index === currentStepIndex ? "bg-[#ac2e44] text-white" : index < currentStepIndex ? "bg-zinc-300 text-zinc-600" : "bg-zinc-100 text-zinc-500 border border-zinc-200"
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

              <button onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="p-2 md:p-3 rounded bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 border border-zinc-700 shadow-lg backdrop-blur-md flex items-center justify-center"
                title={voiceEnabled ? "Mute Voice" : "Enable Voice"}>
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>

            <div className="hidden md:flex bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded text-sm font-semibold items-center gap-2 border border-zinc-700 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#ac2e44] animate-ping" />
              <span className="text-zinc-300">AR NAV</span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-950 min-h-[360px]">
          {isLiveCamera ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover absolute inset-0" referrerPolicy="no-referrer" />
          ) : (
            <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[150%] border-t-[3px] border-[#ac2e44] origin-bottom [transform:rotateX(75deg)] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              </div>

              {localizationPhase === "navigating" && selectedRoute && !isRouteCompleted && (
                <div className="relative z-10 flex flex-col items-center justify-center transition-transform duration-500 scale-100">
                  <div className="absolute w-48 h-48 rounded-full border border-[#ac2e44]/30 animate-ping" />
                  <div className="absolute w-36 h-36 rounded-full border border-[#ac2e44]/40 animate-[pulse_2s_infinite]" />
                  <div className="absolute w-24 h-24 rounded bg-zinc-950 border-2 border-[#ac2e44] shadow-[0_0_25px_rgba(172,46,68,0.35)] flex items-center justify-center">
                    <Compass size={28} className="text-[#ac2e44] animate-spin-slow" />
                  </div>
                  <div className="mt-32 bg-white text-zinc-900 p-5 rounded shadow-2xl border-l-8 border-[#ac2e44] min-w-[200px] max-w-[260px] pointer-events-none">
                    <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Target</div>
                    <div className="text-lg font-bold text-zinc-900">{activeWaypoint?.landmark || selectedRoute.to}</div>
                    <div className="text-base text-zinc-600 font-medium">Step-Free Lift Path</div>
                  </div>
                </div>
              )}

              {localizationPhase === "navigating" && isRouteCompleted && (
                <div className="relative z-10 flex flex-col items-center justify-center bg-zinc-900 border-2 border-[#ac2e44] p-8 rounded-lg shadow-2xl max-w-sm text-center mx-4">
                  <div className="w-20 h-20 bg-zinc-950 border-2 border-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} className="text-green-500 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Destination Arrived!</h4>
                  <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                    You have safely navigated to <strong className="text-[#ac2e44]">{selectedRoute?.to}</strong>.
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
                <p className="text-white text-lg md:text-xl font-semibold">Scanning station environment...</p>
                <p className="text-zinc-400 text-base mt-1.5">Point camera at station signs or landmarks</p>
              </div>
              <style>{`@keyframes scanLine{0%,100%{top:8%}50%{top:88%}}`}</style>
            </div>
          )}

          {localizationPhase === "positioned" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                <CheckCircle2 size={48} className="text-green-500 animate-[bounce_0.5s_ease-in-out]" />
              </div>
              <p className="text-white text-xl md:text-2xl font-bold mt-4">Position locked!</p>
            </div>
          )}

          {localizationPhase === "navigating" && selectedRoute && !isRouteCompleted && (
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
              <div />
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded bg-zinc-950/90 border-2 border-zinc-700 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
                  {activeWaypoint && renderDirectionIcon(activeWaypoint.direction)}
                </div>
                <div className="mt-3 bg-zinc-950 border border-zinc-700 px-6 py-2.5 rounded flex items-center gap-2 shadow-xl backdrop-blur-md">
                  <span className="text-base text-zinc-400 font-medium">Distance:</span>
                  <span className="text-xl font-bold text-[#FFD700]">{simulatedDistance}m</span>
                </div>
              </div>

              {activeWaypoint?.direction.includes("escalator") && (
                <div className="bg-zinc-950/95 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3 max-w-lg mx-auto shadow-lg backdrop-blur-sm mb-2">
                  <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-base text-zinc-300 leading-snug">
                    <strong className="text-amber-500 block mb-0.5">ESCALATOR ALERT:</strong> This step involves an escalator. If you need assistance, request station staff help or take an alternative lift.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {localizationPhase === "navigating" && selectedRoute && (
          <div className="bg-white border-t border-zinc-200 p-4 md:p-5 relative z-20">
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#ac2e44] transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / selectedRoute.waypoints.length) * 100}%` }} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-semibold text-white bg-[#ac2e44] px-4 py-1.5 rounded">
                    Step {currentStepIndex + 1} of {selectedRoute.waypoints.length}
                  </span>
                  {activeWaypoint?.landmark && (
                    <span className="text-base text-zinc-500 flex items-center gap-1"><MapPin size={16} /> {activeWaypoint.landmark}</span>
                  )}
                </div>
                <p className="text-lg md:text-xl font-bold text-zinc-900 leading-snug">{activeWaypoint?.instruction}</p>
                <p className="text-base text-zinc-500 mt-1">{activeWaypoint?.chineseInstruction}</p>
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
                        isWalking ? "bg-amber-500 hover:bg-amber-400 text-zinc-900" : "bg-[#ac2e44] hover:bg-red-800 text-white"
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
          <div className="absolute top-24 left-4 right-4 bg-zinc-900/95 border border-amber-500/40 px-4 py-3 rounded flex items-center gap-3 z-30 text-base text-amber-200 shadow-xl backdrop-blur-md">
            <Info size={18} className="text-amber-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
