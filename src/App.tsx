import { useState } from "react";
import { MessageSquare, Map } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import StationOverview from "./components/StationOverview";
import AccessibilityChat from "./components/AccessibilityChat";

type TabId = "stations" | "chat";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("stations");

  return (
    <div className="h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans overflow-hidden" id="app-root">

      <header className="bg-white border-b border-zinc-200 shrink-0 sticky top-0 z-50 shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl w-full mx-auto">
          <div className="flex items-center justify-between px-4 md:px-8 h-14 md:h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-full flex items-center justify-center shadow shrink-0 overflow-hidden border border-zinc-200">
                <img src="/HK_MTR_logo.svg" alt="HK MTR Logo" className="w-8 h-8 md:w-9 md:h-9" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-zinc-900 leading-tight">
                MTR Access+
              </h1>
            </div>

            <div className="flex items-center bg-zinc-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("stations")}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-base font-semibold transition-all min-w-[100px] ${
                  activeTab === "stations"
                    ? "bg-white text-[#ac2e44] shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Map size={18} />
                <span>Stations</span>
              </button>

              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-base font-semibold transition-all min-w-[100px] ${
                  activeTab === "chat"
                    ? "bg-white text-[#ac2e44] shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <MessageSquare size={18} />
                <span>Chat</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto max-w-7xl w-full mx-auto px-3 md:px-8 py-4 md:py-8">
        <div className="relative flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === "stations" && (
              <motion.div
                key="stations-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <StationOverview />
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <AccessibilityChat />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-white border-t border-zinc-200 text-zinc-500 py-4 md:py-5 px-4 shrink-0 text-center text-sm md:text-base pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-7xl mx-auto">
          MTR Access+ Guide for Wheelchair Users &amp; Seniors
        </div>
      </footer>
    </div>
  );
}
