import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Globe, ExternalLink, Volume2, VolumeX, User, Trash2, Mic, MicOff, MapPin, Accessibility, Luggage, TrainFront } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  sources?: Array<{ title: string; uri: string }>;
  timestamp: Date;
}

export default function AccessibilityChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: "### Welcome to HK MTR Accessibility Chat!\nI am your live assistant. You can ask me anything about elevator (lift) or escalator locations at any Hong Kong MTR station.\n\n*Examples:*\n- *'Which exits at Admiralty have elevators to street level?'*\n- *'Is there a direct lift at Mong Kok Exit C3?'*\n- *'What is the step-free path for a wheelchair user traveling through Causeway Bay?'*",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[#*`_~]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = speechRate;

    utterance.onstart = () => setVoiceActive(true);
    utterance.onend = () => setVoiceActive(false);
    utterance.onerror = () => setVoiceActive(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setVoiceActive(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onerror = () => { stopListening(); };
    recognition.onend = () => { setIsListening(false); };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const PRESETS = [
    {
      label: "HKU Lifts",
      icon: <MapPin size={16} />,
      query: "Which exits at HKU station have passenger elevators?",
      answer: "HKU Station (Hong Kong University) Accessibility\n\nExits with Passenger Lift (wheelchair accessible):\n- Exit A1: Pok Fu Lam Road / The University of Hong Kong -- High-speed lift directly to street level.\n- Exit A2: Pok Fu Lam Road / Hill Road -- Lift access near HKU sports centre.\n- Exit B2: Pok Fu Lam Road / Queen's College -- Lift near the park entrance.\n- Exit C1: Bonham Road / Pok Fu Lam Road -- Lift access.\n\nExits with Escalator Only (not wheelchair friendly):\n- Exit B1: Pok Fu Lam Road / Queen Mary Hospital (use Exit B2 for lift nearby)\n- Exit C2: St. John's College / Bonham Road (use Exit C1 for lift nearby)\n\nTip: HKU station is a modern station with lifts at 4 of 6 exits. Use Exit A1 for the University main gate or Exit B2 for Queen's College area. Barcode scanners at each exit provide detailed lift location info."
    },
    {
      label: "Mong Kok Wheelchair",
      icon: <Accessibility size={16} />,
      query: "Is there a step-free wheelchair path from Mong Kok platforms to Langham Place?",
      answer: "Mong Kok Station (Mong Kok) -- Wheelchair Route to Langham Place\n\nStep-free path from platforms to Langham Place:\n1. Take the lift from the platform level to the concourse.\n2. Exit through Exit C3 (Langham Place Basement).\n3. Take the mall passenger lift from the basement up to Portland Street / Langham Place.\n\nExits with Passenger Lift (wheelchair accessible):\n- Exit C3: Langham Place Basement -- Direct mall lift to street level.\n- Exit E1: Grand Plaza / Nathan Road -- Staff-assisted wheelchair lift. Call 2881-8888.\n\nExits with Escalator Only (not wheelchair friendly):\n- Exits A1, A2, B1, B2, B3, B4, C1, C2, C4, D1, D2, D3, E2\n\nTip: For the most direct path to Langham Place, use Exit C3 which connects directly into the mall via a lift."
    },
    {
      label: "Admiralty Luggage Path",
      icon: <Luggage size={16} />,
      query: "I have heavy bags. Which Admiralty exit has an escalator and lift close to the bus station?",
      answer: "Admiralty Station (Admiralty) -- Luggage-Friendly Route\n\nBest exit for heavy luggage: Exit E (Rodney Street / Tamar Park).\n\nExit E is the only exit with a passenger lift. It connects the concourse to Rodney Street, which is near the bus routes and Tamar Park.\n\nExits with Passenger Lift:\n- Exit E: Rodney Street / Tamar Park / Civic Centre\n\nExits with Stairs Only (not suitable for luggage):\n- Exit A: Admiralty Centre / Bus Terminus (stairs only to concourse)\n- Exit B: Drake Street / Lippo Centre\n- Exit C1: Queensway Plaza\n- Exit C2: Queensway / Pacific Place\n- Exit D: Pacific Place (stairs to concourse, mall lift available after exiting concourse)\n\nTip: Exit E is your best choice for step-free access. From Rodney Street, the bus stops are a short walk away."
    },
    {
      label: "Tsim Sha Tsui Mall Connects",
      icon: <TrainFront size={16} />,
      query: "Does Tsim Sha Tsui have a direct lift connection to iSQUARE?",
      answer: "Tsim Sha Tsui Station (Tsim Sha Tsui) -- Mall Connections\n\niSQUARE Connection:\nYes, Exit H has a direct step-free pedestrian connection to iSQUARE mall. Take the lift from the Tsim Sha Tsui concourse to Exit H, which opens into iSQUARE's basement level.\n\nExits with Passenger Lift:\n- Exit A1: Kowloon Park / Haiphong Road\n- Exit H: iSQUARE (Direct Mall Lift)\n\nExits with Escalator Only (not wheelchair friendly):\n- Exit A2: Kowloon Park / Haiphong Road (South)\n- Exit B1: Cameron Road / The ONE\n- Exit B2: Cameron Road / Mira Place\n- Exit C1: Peking Road / Chungking Mansions\n- Exit C2: Peking Road / Knutsford Terrace\n- Exit D1: Nathan Road / Carnarvon Road\n- Exit D2: Nathan Road / Observatory Court\n\nExits with Stairs Only:\n- Exit E: Mody Road / Chatham Road South\n\nTip: For iSQUARE, use Exit H. For Star Ferry / Kowloon Park, use Exit A1."
    }
  ];

  const handleSendMessage = async (userQuery: string) => {
    if (!userQuery.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: userQuery,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQuery, history })
      });

      if (!res.ok) throw new Error("Server responded with error status");

      const data = await res.json();

      const botMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: "model",
        content: data.text,
        sources: data.groundingSources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);

      if (voiceActive) {
        speakResponse(data.text);
      }

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        role: "model",
        content: "Something went wrong. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([{
      id: "welcome",
      role: "model",
      content: "### Welcome to HK MTR Accessibility Chat!\nI am your live assistant. You can ask me anything about elevator (lift) or escalator locations at any Hong Kong MTR station.\n\n*Examples:*\n- *'Which exits at Admiralty have elevators to street level?'*\n- *'Is there a direct lift at Mong Kok Exit C3?'*\n- *'What is the step-free path for a wheelchair user traveling through Causeway Bay?'*",
      timestamp: new Date()
    }]);
  };

  const renderMessageContent = (content: string, isUser: boolean) => {
    return content.split("\n").map((line, i) => {
      const trimmed = line.trim();

      if (line.startsWith("###")) {
        return <h3 key={i} className={`text-lg font-bold mt-2 mb-1 ${isUser ? "text-white" : "text-[#ac2e44]"}`}>{line.replace("###", "").trim()}</h3>;
      }
      if (line.startsWith("##")) {
        return <h2 key={i} className={`text-lg font-bold mt-3 mb-1 ${isUser ? "text-white" : "text-zinc-800"}`}>{line.replace("##", "").trim()}</h2>;
      }
      if (line.startsWith("#")) {
        return <h1 key={i} className={`text-xl font-bold mt-4 mb-2 ${isUser ? "text-white" : "text-zinc-800"}`}>{line.replace("#", "").trim()}</h1>;
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const text = trimmed.substring(2).trim();
        const clean = text.replace(/\*(.*?)\*/g, "$1");
        const boldParts = clean.split("**");
        return (
          <li key={i} className={`ml-4 list-disc text-lg leading-relaxed my-0.5 ${isUser ? "text-zinc-100" : "text-zinc-700"}`}>
            {boldParts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className={`font-bold ${isUser ? "text-white" : "text-[#ac2e44]"}`}>{part}</strong> : part)}
          </li>
        );
      }

      if (!trimmed) return <div key={i} className="h-3" />;

      const clean = line.replace(/\*(.*?)\*/g, "$1");
      const boldParts = clean.split("**");
      return (
        <p key={i} className={`text-lg leading-relaxed my-1 ${isUser ? "text-zinc-100" : "text-zinc-700"}`}>
          {boldParts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className={`font-bold ${isUser ? "text-white" : "text-[#ac2e44]"}`}>{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm" id="accessibility-chat-panel">
      <div className="bg-white px-4 md:px-5 py-4 border-b border-zinc-200 flex flex-col md:flex-row md:justify-between md:items-center gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#ac2e44]/10 flex items-center justify-center text-[#ac2e44] font-bold shrink-0">
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-zinc-900">AI Assistant</h4>
            <p className="text-base md:text-lg text-zinc-500">Ask about lifts &amp; step-free routes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {voiceActive ? (
            <button onClick={stopSpeaking} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-800 text-base font-medium">
              <VolumeX size={18} /> Stop
            </button>
          ) : (
            <button onClick={() => { const last = [...messages].reverse().find(m => m.role === "model"); if (last) speakResponse(last.content); }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 text-base font-medium hover:bg-zinc-200"
              title="Read last answer aloud">
              <Volume2 size={18} /> Read Answer
            </button>
          )}

          <button onClick={clearChat} className="p-2.5 rounded text-zinc-400 hover:text-[#ac2e44] hover:bg-zinc-100 transition-all" title="Clear chat">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5 space-y-4 bg-zinc-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 flex items-center justify-center border-2 text-base font-bold ${
              msg.role === "user" ? "bg-zinc-200 border-zinc-300 text-zinc-500" : "bg-white border-[#ac2e44]"
            }`}>
              {msg.role === "user" ? <User size={18} /> : <img src="/HK_MTR_logo.svg" alt="MTR" className="w-7 h-7" />}
            </div>

            <div className="flex flex-col gap-1">
              <div className={`p-5 rounded-2xl text-lg shadow-sm ${
                msg.role === "user" ? "bg-[#ac2e44] text-white rounded-tr-none" : "bg-white border border-zinc-200 text-zinc-900 rounded-tl-none"
              }`}>
                {renderMessageContent(msg.content, msg.role === "user")}

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-200">
                    <div className="flex items-center gap-1 text-base font-semibold text-zinc-500 mb-2">
                      <Globe size={16} className="text-[#ac2e44]" /> Sources
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((source, sIdx) => (
                        <a key={sIdx} href={source.uri} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-base text-zinc-700 transition-all">
                          <span className="truncate max-w-[200px]">{source.title}</span>
                          <ExternalLink size={14} className="shrink-0 text-zinc-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#ac2e44] flex items-center justify-center overflow-hidden">
              <img src="/HK_MTR_logo.svg" alt="MTR" className="w-7 h-7" />
            </div>
            <div className="p-5 bg-white border border-zinc-200 rounded-2xl rounded-tl-none text-lg text-zinc-500 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#ac2e44] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-3 h-3 rounded-full bg-[#ac2e44] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-3 h-3 rounded-full bg-[#ac2e44] animate-bounce" />
              <span className="ml-2 font-medium">Searching...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 md:px-5 py-3 bg-white border-t border-zinc-100 overflow-x-auto whitespace-nowrap shrink-0 flex gap-2">
        {PRESETS.map((p, idx) => (
          <button key={idx} onClick={() => {
            const userMsg: Message = {
              id: Math.random().toString(36).substr(2, 9),
              role: "user",
              content: p.query,
              timestamp: new Date()
            };
            const botMsg: Message = {
              id: Math.random().toString(36).substr(2, 9),
              role: "model",
              content: p.answer,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, userMsg, botMsg]);
            if (voiceActive) speakResponse(p.answer);
          }} disabled={loading}
            className="whitespace-nowrap px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5">
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
        className="p-3 md:p-4 bg-white border-t border-zinc-200 flex gap-2 shrink-0 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask about elevators, lifts, and escalators..."}
          disabled={loading}
          className={`flex-1 bg-zinc-50 text-zinc-900 placeholder-zinc-400 text-lg rounded-full px-5 py-4 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#ac2e44]/30 focus:border-[#ac2e44] disabled:opacity-50 font-sans transition-all ${
            isListening ? "ring-2 ring-[#ac2e44] bg-red-50" : ""
          }`}
        />
        <button type="button" onClick={isListening ? stopListening : startListening} disabled={loading}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 ${
            isListening ? "bg-[#ac2e44] text-white animate-pulse shadow-[0_0_12px_rgba(172,46,68,0.5)]" : "bg-zinc-200 hover:bg-zinc-300 text-zinc-600"
          }`}
          title={isListening ? "Stop recording" : "Start voice input"}>
          {isListening ? <Mic size={22} /> : <MicOff size={22} />}
        </button>
        <button type="submit" disabled={loading || !input.trim()}
          className="w-14 h-14 bg-[#ac2e44] hover:bg-red-800 disabled:bg-zinc-200 text-white disabled:text-zinc-400 rounded-full flex items-center justify-center font-bold transition-all shrink-0">
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}
