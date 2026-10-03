import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { askAgriculturalAssistant } from "../services/api";
import {
  Bot,
  User,
  Send,
  Sparkles,
  BookOpen,
  Trash2,
  ShieldAlert,
  ArrowLeft,
  Loader2,
  ExternalLink,
  MessageSquare,
  Sprout,
  HelpCircle,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  "What should I do if my tomato plant has early blight?",
  "How can I prevent fungal diseases in my potato crop?",
  "What are the symptoms and vector control for Citrus Greening?",
  "How often should I inspect my field for rice leaf blast?",
];

const AssistantPage = () => {
  const [searchParams] = useSearchParams();
  const plantContext = searchParams.get("plant") || "";
  const diseaseContext = searchParams.get("disease") || "";

  const [messages, setMessages] = useState([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "Hello! I am your AgriVision RAG Agricultural Assistant. Ask me any questions about crop pathology, symptoms, organic solutions, or field management guidelines.",
      sources: [],
      disclaimer: "Agricultural Safety Notice: For chemical interventions, always adhere strictly to official product label instructions and local agricultural extension regulations.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // If pre-filled from "Ask AI About This Disease"
  useEffect(() => {
    if (diseaseContext || plantContext) {
      const initialPrompt = `What are the best treatment and prevention practices for ${plantContext} ${diseaseContext}?`.trim();
      setInputQuestion(initialPrompt);
    }
  }, [diseaseContext, plantContext]);

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || inputQuestion).trim();
    if (!queryText || loading) return;

    const userMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuestion("");
    setError("");
    setLoading(true);

    try {
      const response = await askAgriculturalAssistant(
        queryText,
        plantContext || null,
        diseaseContext || null
      );

      const assistantMessage = {
        id: "ast-" + Date.now(),
        sender: "assistant",
        text: response.answer,
        sources: response.sources || [],
        disclaimer: response.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || "Unable to query agricultural assistant.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "msg-welcome-reset",
        sender: "assistant",
        text: "Conversation cleared. How can I assist you with your crops today?",
        sources: [],
        disclaimer: "Agricultural Safety Notice: For chemical interventions, always adhere strictly to official product label instructions and local agricultural extension regulations.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setError("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto text-left">
        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Link to="/dashboard" className="text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span>RAG Advisory Agent</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Agricultural AI Assistant</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
                RAG Grounded
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Ask questions backed by authoritative agricultural extension databases and research documentation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-medium transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Conversation</span>
          </button>
        </div>

        {/* Pre-filled Context Alert */}
        {(diseaseContext || plantContext) && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Diagnostic Context Active: <strong>{plantContext}</strong> {diseaseContext ? `- ${diseaseContext}` : ""}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">Auto-Contextualized</span>
          </div>
        )}

        {/* Chat Window */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col h-[560px] overflow-hidden">
          {/* Message Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "bg-gradient-to-br from-emerald-500 to-green-600 border border-emerald-400/40"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-slate-950" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {/* Sources List if available */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Grounded Extension Sources ({msg.sources.length}):</span>
                      </div>
                      <div className="space-y-1.5">
                        {msg.sources.map((src, idx) => (
                          <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px]">
                            <div className="font-semibold text-slate-300 truncate max-w-[280px] sm:max-w-[380px]">
                              {src.title} <span className="text-slate-500 font-normal">({src.source})</span>
                            </div>
                            {src.url && (
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:underline flex items-center gap-1 shrink-0 font-mono"
                              >
                                <span>Ref</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Safety Disclaimer */}
                  {msg.disclaimer && (
                    <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/20 text-[11px] text-amber-300/80 flex items-start gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <span>{msg.disclaimer}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 px-1 font-mono">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-3xl mr-auto items-center">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-slate-950 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Searching agricultural knowledge base & synthesizing grounded response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="p-3 bg-slate-950 border-t border-slate-800/80 overflow-x-auto">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Suggested Queries:</span>
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            {error && (
              <div className="mb-2 text-xs text-rose-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask about crop diseases, organic solutions, or field management..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !inputQuestion.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-300 hover:to-green-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer shrink-0 shadow-lg shadow-emerald-500/20"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssistantPage;
