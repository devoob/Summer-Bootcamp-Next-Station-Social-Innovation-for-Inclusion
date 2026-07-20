import { useState } from "react";
import { Map, MessageSquare, Scan } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import StationOverview from "./components/StationOverview";
import AccessibilityChat from "./components/AccessibilityChat";
import CameraScanner from "./components/CameraScanner";

type TabId = "home" | "camera" | "chat";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  return (
    <div className="h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans overflow-hidden" id="app-root">

      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200 shrink-0 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-3 px-4 md:px-8 h-14">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow shrink-0 overflow-hidden border border-zinc-200">
            <img src="/HK_MTR_logo.svg" alt="HK MTR Logo" className="w-7 h-7" />
          </div>
          <h1 className="text-lg font-bold text-zinc-900 leading-tight">
            MTR Access+
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="relative flex-1 flex flex-col min-h-0 max-w-7xl w-full mx-auto px-3 md:px-8 py-4 md:py-8">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                <StationOverview />
              </motion.div>
            )}

            {activeTab === "camera" && (
              <motion.div
                key="camera-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <CameraScanner />
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <AccessibilityChat />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-zinc-200 shrink-0 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-start justify-around pt-2 pb-1 relative">
          {/* Home */}
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-lg transition-all ${
              activeTab === "home" ? "text-[#ac2e44]" : "text-zinc-500"
            }`}
          >
            <Map size={22} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          {/* FAB */}
          <div className="relative -mt-5 flex flex-col items-center">
            <button
              onClick={() => setActiveTab("camera")}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                activeTab === "camera"
                  ? "bg-[#ac2e44] text-white ring-4 ring-[#ac2e44]/20 scale-110"
                  : "bg-[#ac2e44] text-white hover:bg-red-800"
              }`}
            >
              <Scan size={26} />
            </button>
            <span className={`text-[10px] font-semibold mt-0.5 ${activeTab === "camera" ? "text-[#ac2e44]" : "text-zinc-500"}`}>
              Scan
            </span>
          </div>

          {/* Chat */}
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-lg transition-all ${
              activeTab === "chat" ? "text-[#ac2e44]" : "text-zinc-500"
            }`}
          >
            <MessageSquare size={22} />
            <span className="text-[10px] font-semibold">Chat</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
