import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  Check,
  X,
  Upload,
  Send,
  Plus,
  HelpCircle,
  TrendingUp,
  Cpu,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  MessageSquare,
  History,
  CheckSquare,
  Sliders,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Circular, Obligation, ComplianceTask, AuditLog, ChatMessage } from "./types";

export default function App() {
  // Database States
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // UI Control States
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'ingest' | 'chat'>('tasks');
  const [selectedTask, setSelectedTask] = useState<ComplianceTask | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Ingest Portal Form States
  const [customTitle, setCustomTitle] = useState("");
  const [customRef, setCustomRef] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [selectedSample, setSelectedSample] = useState("");

  // Evidence Inputs
  const [evidenceName, setEvidenceName] = useState("");
  const [evidenceContent, setEvidenceContent] = useState("");

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Active AI Pipelines State
  const [parsingPipeline, setParsingPipeline] = useState<null | 'parsing' | 'extracting' | 'mapping' | 'complete'>(null);
  const [verifyingPipeline, setVerifyingPipeline] = useState<null | 'verifying' | 'analyzing' | 'scoring' | 'complete'>(null);

  // Modal / Form trigger
  const [showTaskEditModal, setShowTaskEditModal] = useState<ComplianceTask | null>(null);

  // Chat message bottom scroll ref
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sample Documents templates
  const sampleCirculars = [
    {
      key: "cyber",
      title: "Cybersecurity & Cyber Resilience Framework for Stock Brokers & Depository Participants",
      ref: "SEBI/HO/MIRSD/TPD/P/CIR/2026/41",
      content: `SEBI Circular: Cybersecurity and Cyber Resilience Framework (2026)
Reference: SEBI/HO/MIRSD/TPD/P/CIR/2026/41
Date: March 15, 2026

To: All Stock Brokers, Depository Participants, and Registered Intermediaries.

1. Background & Scope:
With the rapid integration of technology in the securities market, cybersecurity risks are elevated. SEBI hereby issues enhanced directives to ensure structural integrity, secure transactions, and robust incident response.

2. Access Control & Multi-Factor Authentication (MFA):
Section 3.1: Stock brokers shall implement strict Multi-Factor Authentication (MFA) for all access to trading terminals, core administrative databases, and back-office services. Single-factor login is strictly prohibited. MFA mechanisms must include authenticator app OTPs, hardware tokens, or biometric verification.

3. Log Audit & Retention:
Section 4.3: Stock brokers and depository participants must maintain fully encrypted system activity and transaction log records for a minimum duration of 8 years. These logs must be stored in an immutable, write-once-read-many (WORM) storage architecture to prevent post-incident tempering.

4. CERT-In Cyber Security Audit:
Section 5.2: Intermediaries shall conduct a comprehensive cyber security audit half-yearly. This audit must be conducted by a CERT-In empanelled cybersecurity auditor. The report of such audit, alongside action-taken details, must be submitted to SEBI within 30 days of audit completion.

5. Breach Notifications:
Section 6.1: In the event of a cybersecurity breach, intrusion, or ransomware attack, the stock broker must report the incident to SEBI and CERT-In within 4 hours of detection. Failure to report within the stipulated timeframe will attract operational penalties.`
    },
    {
      key: "investor",
      title: "Enhancement of Retail Investor Protection on Multi-Asset Wealth Platforms",
      ref: "SEBI/HO/MIRSD/DOP/CIR/2026/89",
      content: `SEBI Circular: Retail Investor Protection Guidelines (2026)
Reference: SEBI/HO/MIRSD/DOP/CIR/2026/89
Date: May 10, 2026

To: All Registered Multi-Asset Wealth Tech Platforms, Brokers, and Investment Advisers.

1. Segregation of Client Assets:
Section 2.2: All digital multi-asset platforms shall maintain separate escrow and bank accounts for customer funds. Segregation must be validated daily, and pooling of client funds with corporate assets is strictly prohibited.

2. Mandatory Derivative Educational Modules:
Section 3.4: Before allowing any retail client to trade in Futures and Options (F&O) or leverage assets, wealth tech platforms must administer a personalized 5-question financial educational quiz. Clients must score 100% to trade, or complete a modular interactive video training course.

3. Structured Risk Disclosures:
Section 4.1: Intermediaries must display clear, non-negotiable risk indicators occupying at least 25% of the viewport area when a retail client reviews high-risk instruments like REITs, InvITs, and fractional physical assets.`
    },
    {
      key: "sme_ipo",
      title: "Simplifying IPO Offer Document Preparation for SMEs",
      ref: "SEBI/HO/CFD/SME/CIR/2026/112",
      content: `SEBI Circular: SME IPO Simplification and Disclosure Standards (2026)
Reference: SEBI/HO/CFD/SME/CIR/2026/112
Date: June 18, 2026

To: All Merchant Bankers, Registered Registrars, and SME Promoters.

1. Unified Extractors:
Section 1.3: Lead Managers shall use automated extraction pipelines to compile past financial filings, ensuring all disclosures are validated against original bank records and certified tax sheets.

2. SME Promoters Disclosures:
Section 2.5: Promoter group members must submit a certified credit statement and explicit disclosure on outstanding criminal litigations. This disclosure must be published in the draft red herring prospectus (DRHP) prominently on the cover page.

3. Submission Timeline:
Section 4.2: Intermediaries are strictly required to submit final red herring documents to the Stock Exchanges within 5 working days of resolving public comment periods.`
    },
    {
      key: "phishing",
      title: "AI-Driven Detection and Action on Synthetic Media & Phishing in Stock Markets",
      ref: "SEBI/HO/ISD/CIR/2026/15",
      content: `SEBI Circular: Mitigating Synthetic Scams & Phishing Attacks (2026)
Reference: SEBI/HO/ISD/CIR/2026/15
Date: July 02, 2026

To: Stock Exchanges, Mutual Funds, and Stock Brokers.

1. Countering Deepfakes & Impersonation:
Section 2.1: Intermediaries must deploy AI computer vision and speech deep learning tools to identify and flag unauthorized synthetic videos, deepfake financial advices, and fake SEBI messages impersonating exchange administrators.

2. Domain Monitoring:
Section 3.3: Stock brokers must establish 24/7 web crawlers to monitor domain registration engines and social channels for phishing websites mimicking their broker brand portal, and report suspicious vectors within 12 hours of discovery to CERT-In and SEBI.

3. Investor Alerts:
Section 4.5: If an unauthorized copycat domain is flagged, intermediaries shall automatically push warning alerts with clear security checklists to all mobile client platforms within 2 hours.`
    }
  ];

  // Load state from backend
  const fetchState = async () => {
    try {
      const res = await fetch("/api/state");
      const data = await res.json();
      setCirculars(data.circulars || []);
      setObligations(data.obligations || []);
      setTasks(data.tasks || []);
      setAuditLogs(data.auditLogs || []);

      // Retain selected task selection across updates if applicable
      if (selectedTask) {
        const updatedTask = data.tasks.find((t: ComplianceTask) => t.id === selectedTask.id);
        if (updatedTask) setSelectedTask(updatedTask);
      }
    } catch (e) {
      console.error("Error loading application state", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    // Default system welcome message
    setChatMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Welcome to **RegFlow AI: Your Agentic Compliance Operating System**.\n\nI am configured with semantic RAG context over all active SEBI guidelines, corporate compliance tasks, and uploaded evidence vaults.\n\nAsk me anything like:\n- *What are the requirements for WORM storage under SEBI?*\n- *Which tasks are overdue in IT Security?*\n- *Explain why the AWS log configuration task was approved or rejected.*",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Handle template selection
  const handleSelectSample = (key: string) => {
    setSelectedSample(key);
    const sample = sampleCirculars.find(s => s.key === key);
    if (sample) {
      setCustomTitle(sample.title);
      setCustomRef(sample.ref);
      setCustomContent(sample.content);
    }
  };

  // Reset State
  const handleReset = async () => {
    if (confirm("Are you sure you want to reset the database? All custom circulars and tasks will be restored to default professional demo state.")) {
      setLoading(true);
      try {
        const res = await fetch("/api/reset", { method: "POST" });
        const data = await res.json();
        setCirculars(data.state.circulars);
        setObligations(data.state.obligations);
        setTasks(data.state.tasks);
        setAuditLogs(data.state.auditLogs);
        setSelectedTask(null);
        alert("Compliance OS reset to default successfully!");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  // Parse SEBI circular via Agentic pipeline
  const handleParseCircular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customContent.trim()) return;

    // Simulate Agent Sequence for perfect visualization
    setParsingPipeline('parsing');
    setTimeout(() => {
      setParsingPipeline('extracting');
      setTimeout(() => {
        setParsingPipeline('mapping');
      }, 1200);
    }, 1000);

    try {
      const res = await fetch("/api/circular/parse-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: customTitle,
          referenceNumber: customRef,
          content: customContent
        })
      });

      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setParsingPipeline('complete');
          setTimeout(() => {
            setParsingPipeline(null);
            fetchState();
            // Reset fields
            setCustomTitle("");
            setCustomRef("");
            setCustomContent("");
            setSelectedSample("");
            // Highlight tasks workspace
            alert(`AI Multi-Agent pipeline complete! Extracted ${data.obligations.length} new compliance obligations in 'Draft' state. Please review and approve them in the Review Board.`);
          }, 1000);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setParsingPipeline(null);
    }
  };

  // Approve / Reject Obligation
  const handleReviewObligation = async (id: string, action: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch("/api/obligation/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action })
      });
      const data = await res.json();
      if (data.success) {
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Obligation
  const handleDeleteObligation = async (id: string) => {
    if (confirm("Delete this extracted obligation and any associated tasks?")) {
      try {
        const res = await fetch("/api/obligation/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
          fetchState();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Submit Evidence for Task
  const handleSubmitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !evidenceContent.trim()) return;

    // Simulate Agent Audit Review pipeline
    setVerifyingPipeline('verifying');
    setTimeout(() => {
      setVerifyingPipeline('analyzing');
      setTimeout(() => {
        setVerifyingPipeline('scoring');
      }, 1200);
    }, 1000);

    try {
      const res = await fetch("/api/task/submit-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: selectedTask.id,
          evidenceName: evidenceName || "compliance_evidence_log.txt",
          evidenceContent: evidenceContent
        })
      });

      const data = await res.json();
      if (data.success) {
        setTimeout(() => {
          setVerifyingPipeline('complete');
          setTimeout(() => {
            setVerifyingPipeline(null);
            setEvidenceName("");
            setEvidenceContent("");
            fetchState();
          }, 1000);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setVerifyingPipeline(null);
    }
  };

  // Manual Task Edit / Save
  const handleSaveTaskEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTaskEditModal) return;

    try {
      const res = await fetch("/api/task/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(showTaskEditModal)
      });
      const data = await res.json();
      if (data.success) {
        setShowTaskEditModal(null);
        fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    if (confirm("Remove this operational task from trackers?")) {
      try {
        const res = await fetch("/api/task/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
          if (selectedTask?.id === id) setSelectedTask(null);
          fetchState();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Chat Submission
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const chatHistory = [...chatMessages, userMsg];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });
      const data = await res.json();

      setChatMessages(prev => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          role: "assistant",
          content: data.response,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  // Computations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const overdueTasks = tasks.filter(t => t.status === "Overdue").length;
  const pendingTasks = tasks.filter(t => t.status === "Pending").length;
  const complianceScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const draftObligationsCount = obligations.filter(o => o.status === "Draft").length;

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || task.department === selectedDept;
    const matchesStatus = selectedStatus === "All" || task.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Professional Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-xl shadow-inner flex items-center justify-center">
              <Shield className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg tracking-tight text-slate-900">RegFlow AI</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  SEBI TechSprint
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Agentic Compliance OS</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Status indicators */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-700 font-mono">POSTURE: {complianceScore}% COMPLIANT</span>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg transition-all duration-150 active:scale-95"
              title="Reset Database to default demo state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Active AI Processing Banner notifications */}
        <AnimatePresence>
          {parsingPipeline && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 text-white p-4 rounded-xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 animate-pulse">
                  <Cpu className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2 font-display">
                    <span>Active Regulatory Extraction Pipeline</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {parsingPipeline === 'parsing' && "Document Parser Agent: Stripping PDF and cleaning layout text..."}
                    {parsingPipeline === 'extracting' && "Obligation Agent: Scanning clauses for 'shall/must' mandates..."}
                    {parsingPipeline === 'mapping' && "Mapping Agent: Assigning risks, departments, and calculating timelines..."}
                    {parsingPipeline === 'complete' && "Success: Circular processed. Dispatched Draft obligations."}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`h-1 w-24 bg-slate-800 rounded-full overflow-hidden`}>
                  <div className={`h-full bg-emerald-400 ${parsingPipeline !== 'complete' ? 'w-2/3 animate-pulse' : 'w-full'} transition-all duration-500`}></div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{parsingPipeline}</span>
              </div>
            </motion.div>
          )}

          {verifyingPipeline && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 text-white p-4 rounded-xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 animate-pulse">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2 font-display">
                    <span>Agentic Evidence Auditor Running</span>
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {verifyingPipeline === 'verifying' && "Evidence Agent: Accessing submitted files & texts..."}
                    {verifyingPipeline === 'analyzing' && "Audit Agent: Reviewing requirements compatibility with SEBI Section parameters..."}
                    {verifyingPipeline === 'scoring' && "Scoring Agent: Formulating technical auditor reasoning..."}
                    {verifyingPipeline === 'complete' && "Success: Posture verification compiled."}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-blue-400 ${verifyingPipeline !== 'complete' ? 'w-2/3 animate-pulse' : 'w-full'} transition-all duration-500`}></div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{verifyingPipeline}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Posture Board Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Posture Score Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance Posture</p>
              <h3 className="text-2xl font-bold text-slate-900 font-display flex items-baseline space-x-1">
                <span>{complianceScore}%</span>
                <span className="text-xs font-normal text-slate-500">certified</span>
              </h3>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>{completedTasks} of {totalTasks} directives resolved</span>
              </p>
            </div>
            {/* Minimal Circular Progress bar */}
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${complianceScore > 75 ? 'text-emerald-500' : 'text-amber-500'} transition-all duration-1000`}
                  strokeDasharray={`${complianceScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-700 stroke-[1.5]" />
              </div>
            </div>
          </div>

          {/* Review Board Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Review Pipeline</p>
              <h3 className="text-2xl font-bold text-slate-900 font-display flex items-baseline space-x-1">
                <span>{draftObligationsCount}</span>
                <span className="text-xs font-normal text-slate-500">Drafts</span>
              </h3>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-slate-500" />
                <span>Requires Human Approval (HITL)</span>
              </p>
            </div>
            <div className={`p-3.5 rounded-xl ${draftObligationsCount > 0 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
              <CheckSquare className="w-6 h-6 stroke-[1.5]" />
            </div>
          </div>

          {/* Directives Breakdown Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Directive Trackers</p>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">Tasks</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-emerald-50 rounded-lg p-1.5 border border-emerald-100">
                <p className="text-emerald-700 font-bold text-sm font-display">{completedTasks}</p>
                <p className="text-[9px] text-emerald-600 font-medium font-mono uppercase">Done</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-1.5 border border-amber-100">
                <p className="text-amber-700 font-bold text-sm font-display">{pendingTasks}</p>
                <p className="text-[9px] text-amber-600 font-medium font-mono uppercase">Pending</p>
              </div>
              <div className="bg-rose-50 rounded-lg p-1.5 border border-rose-100">
                <p className="text-rose-700 font-bold text-sm font-display">{overdueTasks}</p>
                <p className="text-[9px] text-rose-600 font-medium font-mono uppercase">Deficit</p>
              </div>
            </div>
          </div>

          {/* Active Agents Card */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Orchestrated AI Agents</p>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Text Parser Agent
                </span>
                <span className="text-[9px] text-emerald-400 bg-emerald-950/50 px-1 py-0.2 rounded border border-emerald-800">ONLINE</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Obligation Extractor
                </span>
                <span className="text-[9px] text-emerald-400 bg-emerald-950/50 px-1 py-0.2 rounded border border-emerald-800">ONLINE</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Segment Mapper
                </span>
                <span className="text-[9px] text-emerald-400 bg-emerald-950/50 px-1 py-0.2 rounded border border-emerald-800">ONLINE</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Evidence Auditor
                </span>
                <span className="text-[9px] text-emerald-400 bg-emerald-950/50 px-1 py-0.2 rounded border border-emerald-800">ONLINE</span>
              </div>
            </div>
          </div>

        </section>

        {/* Navigation Switcher */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium font-display transition-all duration-150 ${activeTab === 'tasks' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Operational Tasks & Audits</span>
          </button>
          <button
            onClick={() => setActiveTab('ingest')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium font-display transition-all duration-150 ${activeTab === 'ingest' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Regulatory Ingest Portal</span>
            {draftObligationsCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 rounded-full animate-bounce">
                {draftObligationsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium font-display transition-all duration-150 ${activeTab === 'chat' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Audit Assistant & System Logs</span>
          </button>
        </div>

        {/* Tab Content Section */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 font-medium">Synchronizing application state from server...</p>
          </div>
        ) : (
          <div className="min-h-[480px]">
            
            {/* TAB 1: OPERATIONAL WORKSPACE */}
            {activeTab === 'tasks' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Task Directory Column */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden h-[600px]">
                  
                  {/* Search and Filters */}
                  <div className="p-4 border-b border-slate-200 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search compliance tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 focus:outline-hidden focus:border-slate-400 rounded-lg bg-slate-50 focus:bg-white transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {/* Dept Filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold font-mono uppercase tracking-wider text-slate-400">Department</label>
                        <select
                          value={selectedDept}
                          onChange={(e) => setSelectedDept(e.target.value)}
                          className="w-full text-[11px] border border-slate-200 rounded-md p-1.5 bg-white text-slate-700"
                        >
                          <option value="All">All Departments</option>
                          <option value="IT Security">IT Security</option>
                          <option value="Legal & Compliance">Legal & Compliance</option>
                          <option value="Operations">Operations</option>
                          <option value="Finance">Finance</option>
                        </select>
                      </div>

                      {/* Status Filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold font-mono uppercase tracking-wider text-slate-400">Status</label>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full text-[11px] border border-slate-200 rounded-md p-1.5 bg-white text-slate-700"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {filteredTasks.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        <CheckCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-medium">No tasks match criteria</p>
                        <p className="text-[10px] text-slate-400 mt-1">Try relaxing filters or ingest a new regulatory circular.</p>
                      </div>
                    ) : (
                      filteredTasks.map((task) => {
                        const isSelected = selectedTask?.id === task.id;
                        return (
                          <div
                            key={task.id}
                            onClick={() => {
                              setSelectedTask(task);
                              setEvidenceName("");
                              setEvidenceContent("");
                            }}
                            className={`p-4 text-left transition-all cursor-pointer ${isSelected ? 'bg-slate-100 border-l-4 border-slate-950' : 'hover:bg-slate-50'}`}
                          >
                            <div className="flex justify-between items-start mb-1.5">
                              <span className="text-[10px] font-semibold font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-sm">
                                {task.department}
                              </span>
                              <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${
                                task.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                task.status === "Overdue" ? "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse" :
                                "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}>
                                {task.status.toUpperCase()}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 tracking-tight">{task.title}</h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{task.description}</p>
                            
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" /> Due: {task.deadline}
                              </span>
                              
                              <span className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  task.priority === "High" ? "bg-rose-500" :
                                  task.priority === "Medium" ? "bg-amber-500" : "bg-slate-400"
                                }`}></span>
                                {task.priority} Priority
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Auditor Detail Panel */}
                <div className="lg:col-span-7 flex flex-col h-[600px]">
                  {selectedTask ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex-1 flex flex-col overflow-hidden">
                      
                      {/* Top Header of Auditor Area */}
                      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                        <div>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                            <span>Compliance ID: {selectedTask.id}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{selectedTask.department} Actionable</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 tracking-tight mt-1">{selectedTask.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowTaskEditModal(selectedTask)}
                            className="p-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                            title="Edit task specifics"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(selectedTask.id)}
                            className="p-1.5 text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Detail Area */}
                      <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        
                        {/* Requirement description */}
                        <div className="space-y-1.5">
                          <h5 className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">SEBI Regulatory Directive</h5>
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {selectedTask.description}
                          </div>
                        </div>

                        {/* Evidence Upload and Verification Section */}
                        <div className="border-t border-slate-100 pt-5 space-y-4">
                          
                          <div className="flex justify-between items-center">
                            <h5 className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">Agentic Verification Auditor</h5>
                            <span className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full ${
                              selectedTask.evidenceStatus === "Verified" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                              selectedTask.evidenceStatus === "Rejected" ? "bg-rose-50 text-rose-800 border border-rose-200" :
                              selectedTask.evidenceStatus === "PendingReview" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                              "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                              Audit Status: {selectedTask.evidenceStatus.toUpperCase()}
                            </span>
                          </div>

                          {/* AI audit report stamp if evaluated */}
                          {selectedTask.evidenceReasoning && (
                            <div className={`p-4 rounded-xl border ${
                              selectedTask.evidenceStatus === "Verified" ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-rose-50/50 border-rose-200 text-rose-950'
                            } text-xs space-y-2`}>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 font-bold font-display">
                                  {selectedTask.evidenceStatus === "Verified" ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                                      <span>COMPLIANCE CONFIRMED</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                                      <span>COMPLIANCE DEFICIT FOUND</span>
                                    </>
                                  )}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border">
                                  AI CONFIDENCE: {selectedTask.evidenceConfidence}%
                                </span>
                              </div>
                              <p className="leading-relaxed leading-relaxed">{selectedTask.evidenceReasoning}</p>
                              <div className="flex items-center gap-2 pt-1 font-mono text-[9px] text-slate-500">
                                <span>Evidence Evaluated: {selectedTask.evidenceName}</span>
                                <span>•</span>
                                <span>Updated: {new Date(selectedTask.lastUpdated).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}

                          {/* Action Form: Submit New Evidence */}
                          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200 space-y-3.5">
                            <div className="flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-slate-500" />
                              <h6 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Submit Verification Materials</h6>
                            </div>
                            
                            <form onSubmit={handleSubmitEvidence} className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[9px] font-bold font-mono text-slate-400 uppercase">Evidence Title / File Name</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. AWS_IAM_MFA_Logs.txt"
                                    value={evidenceName}
                                    onChange={(e) => setEvidenceName(e.target.value)}
                                    className="w-full text-xs p-2 border border-slate-200 rounded-md bg-white mt-1"
                                  />
                                </div>
                                <div className="text-[10px] text-slate-400 flex flex-col justify-end pb-1.5">
                                  <p className="font-medium text-slate-600">Simulate Uploaded Materials</p>
                                  <p className="text-[9px]">The Evidence Agent analyzes the text to verify compliant execution.</p>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold font-mono text-slate-400 uppercase">Evidence Execution Log / Narrative</label>
                                <textarea
                                  required
                                  rows={4}
                                  placeholder="Provide step-by-step technical details of what you implemented. E.g. 'Configured S3 write-once-read-many with 8-year compliance locks on cloud backend bucket s3://sebi-compliance-logs/...'"
                                  value={evidenceContent}
                                  onChange={(e) => setEvidenceContent(e.target.value)}
                                  className="w-full text-xs p-2.5 border border-slate-200 rounded-md bg-white mt-1"
                                ></textarea>
                              </div>

                              <button
                                type="submit"
                                disabled={!!verifyingPipeline}
                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                              >
                                {verifyingPipeline ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Agentic Auditor Running Verification...</span>
                                  </>
                                ) : (
                                  <>
                                    <Cpu className="w-3.5 h-3.5" />
                                    <span>Validate Evidence via Compliance Agent</span>
                                  </>
                                )}
                              </button>
                            </form>
                          </div>

                        </div>

                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex-1 flex flex-col justify-center items-center p-8 text-center">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-4 text-slate-400">
                        <CheckSquare className="w-10 h-10 stroke-[1.5]" />
                      </div>
                      <h4 className="font-display font-bold text-slate-800">Operational Auditor Dashboard</h4>
                      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                        Select a regulatory directive from the directory panel to view its source clause, inspect compliance audits, or submit evidence logs for Multi-Agent review.
                      </p>
                      <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl max-w-sm text-left text-[11px] text-slate-500 space-y-1.5 font-mono">
                        <p className="font-bold text-slate-600 uppercase text-[9px] tracking-wider mb-1">💡 Demo Flow Idea:</p>
                        <p>1. Select the task <span className="font-bold text-amber-600">Configure 8-Year WORM Storage</span></p>
                        <p>2. See why the previous hard-drive storage submission was rejected by the AI Agent.</p>
                        <p>3. Submit a corrected log detailing AWS S3 Glacier compliant locking.</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: REGULATION INGEST */}
            {activeTab === 'ingest' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Upload Form Portal */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 h-[600px] flex flex-col">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 flex items-center gap-1.5">
                      <Plus className="w-5 h-5 text-emerald-500" />
                      <span>Ingest Regulatory Circular</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Parse dynamic PDF circulars or text directives with the Multi-Agent Extraction Pipeline.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Pre-Loaded SEBI Templates</label>
                    <select
                      value={selectedSample}
                      onChange={(e) => handleSelectSample(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 hover:bg-slate-100 transition text-slate-700"
                    >
                      <option value="">-- Choose a Sample SEBI Circular to Auto-Fill --</option>
                      {sampleCirculars.map(s => (
                        <option key={s.key} value={s.key}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-slate-100 my-1"></div>

                  <form onSubmit={handleParseCircular} className="flex-1 flex flex-col space-y-3.5 overflow-y-auto">
                    <div>
                      <label className="text-[9px] font-bold font-mono text-slate-400 uppercase">Circular Title / Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cybersecurity resilience guidelines"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold font-mono text-slate-400 uppercase">SEBI Reference Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SEBI/HO/MIRSD/TPD/P/CIR/2026/41"
                        value={customRef}
                        onChange={(e) => setCustomRef(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white mt-1"
                      />
                    </div>

                    <div className="flex-1 flex flex-col min-h-[120px]">
                      <label className="text-[9px] font-bold font-mono text-slate-400 uppercase mb-1">Circular Legal Text</label>
                      <textarea
                        required
                        placeholder="Copy and paste standard regulatory sections here..."
                        value={customContent}
                        onChange={(e) => setCustomContent(e.target.value)}
                        className="w-full flex-1 text-xs p-3 border border-slate-200 rounded-lg bg-white resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={!!parsingPipeline}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-3 px-4 rounded-xl text-xs font-bold tracking-wide shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      {parsingPipeline ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>AI Multi-Agent Pipeline Running...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>Execute AI Compliance Extraction</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Right Interactive Review Board */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col h-[600px]">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="font-display font-bold text-slate-900 flex items-center gap-1.5">
                        <Sliders className="w-5 h-5 text-emerald-500" />
                        <span>Compliance Review Board</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Approve or edit AI-extracted obligations (Human-in-the-Loop) to dispatch active tasks.</p>
                    </div>
                    <span className="bg-slate-100 text-slate-700 font-mono text-xs px-2.5 py-1 rounded-md border border-slate-200">
                      Drafts: {draftObligationsCount}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {obligations.filter(o => o.status === "Draft").length === 0 ? (
                      <div className="h-full flex flex-col justify-center items-center text-slate-500 p-8 text-center">
                        <CheckCircle className="w-12 h-12 text-slate-200 mb-3" />
                        <h4 className="font-display font-bold text-slate-700">All Obligations Approved</h4>
                        <p className="text-xs text-slate-400 max-w-xs mt-1">There are no draft obligations needing review. Ingest a new circular or load a sample on the left to see obligations appear here.</p>
                      </div>
                    ) : (
                      obligations.filter(o => o.status === "Draft").map((obl) => (
                        <div key={obl.id} className="py-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-bold font-mono bg-slate-950 text-white px-2 py-0.5 rounded">
                                {obl.clause}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">{obl.circularTitle.substring(0, 45)}...</span>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-sm ${
                                obl.priority === "High" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                obl.priority === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                "bg-slate-50 text-slate-700 border border-slate-200"
                              }`}>
                                {obl.priority}
                              </span>
                              <span className="text-[9px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-sm">
                                {obl.department}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                                Conf: {obl.confidence}%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-900 leading-snug">{obl.requirement}</p>
                            <div className="text-[11px] text-slate-500 bg-slate-50 border-l-2 border-slate-300 p-2 italic">
                              "{obl.originalQuote}"
                            </div>
                            <p className="text-[10px] text-emerald-700 font-mono"><strong className="font-semibold font-sans">AI Logic Justification:</strong> {obl.explanation}</p>
                          </div>

                          <div className="flex justify-end items-center gap-2 pt-1">
                            <button
                              onClick={() => handleDeleteObligation(obl.id)}
                              className="text-xs font-medium text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-md hover:bg-rose-50 transition"
                            >
                              Discard
                            </button>
                            <button
                              onClick={() => handleReviewObligation(obl.id, 'Rejected')}
                              className="text-xs font-medium text-amber-700 hover:bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg transition"
                            >
                              Flag Risk
                            </button>
                            <button
                              onClick={() => handleReviewObligation(obl.id, 'Approved')}
                              className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Dispatch Task</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: ASSISTANT CHAT & AUDIT LOG */}
            {activeTab === 'chat' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Compliance RAG AI Assistant */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col h-[600px]">
                  <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-slate-900 flex items-center gap-1.5">
                        <MessageSquare className="w-5 h-5 text-emerald-500" />
                        <span>AI Compliance Advisor</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">Consult the SEBI Guidelines and verify posture histories via semantic RAG queries.</p>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded border">Gemini RAG Engine</span>
                  </div>

                  {/* Chat Bubbles list */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 border shadow-xs ${
                          msg.role === "user"
                            ? "bg-slate-900 text-white border-slate-950"
                            : "bg-slate-50 text-slate-800 border-slate-200/80"
                        }`}>
                          <div className="flex items-center justify-between text-[9px] opacity-75 font-mono mb-1">
                            <span className="font-bold uppercase tracking-wider">{msg.role === "user" ? "Compliance Officer" : "RegFlow AI Assistant"}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          
                          <div className="whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1 text-slate-500">
                          <div className="flex items-center space-x-2">
                            <Cpu className="w-3.5 h-3.5 animate-spin text-slate-400" />
                            <span className="font-mono text-[9px] uppercase tracking-wider font-semibold">AI Assistant Thinking...</span>
                          </div>
                          <p className="text-[11px] animate-pulse">Running semantic vector matching on circular clauses...</p>
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  {/* Chat Input form */}
                  <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Ask regulatory details. E.g. 'Summarize requirements for IT audits'..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 text-xs p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden focus:border-slate-400 transition"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading}
                      className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-lg transition active:scale-95 flex items-center justify-center cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Right Side: System Chronological Audit Logs */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col h-[600px]">
                  <div className="pb-3 border-b border-slate-200">
                    <h3 className="font-display font-bold text-slate-900 flex items-center gap-1.5">
                      <History className="w-5 h-5 text-emerald-500" />
                      <span>Regulatory Audit Trail</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-sans">Immutable operational actions and verification logs.</p>
                  </div>

                  {/* Audit Logs Trail */}
                  <div className="flex-1 overflow-y-auto py-2 space-y-3 font-mono text-[10px]">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                        <div className="flex justify-between items-center text-[9px] text-slate-400">
                          <span className={`font-bold uppercase tracking-wider px-1 py-0.1 rounded-sm ${
                            log.actor === "AI Agent" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                            log.actor === "Compliance Officer" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                            "bg-slate-200 text-slate-700 border border-slate-300"
                          }`}>
                            {log.actor}
                          </span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="font-bold text-slate-800">{log.action}</p>
                        <p className="text-slate-500 leading-relaxed font-sans">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs space-y-2">
          <p className="font-display font-semibold text-slate-200">
            RegFlow AI — Designed for SEBI Securities Market TechSprint @ GFF 2026
          </p>
          <p className="text-slate-500 font-mono text-[10px]">
            Tech stack: React, Vite, Node (TypeScript), Express, and Google Gemini Pro/Flash (via @google/genai)
          </p>
        </div>
      </footer>

      {/* TASK EDIT MODAL */}
      {showTaskEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-display font-bold text-slate-900">Modify Compliance Task Parameters</h4>
              <button onClick={() => setShowTaskEditModal(null)} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTaskEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Task Title</label>
                <input
                  type="text"
                  required
                  value={showTaskEditModal.title}
                  onChange={(e) => setShowTaskEditModal({ ...showTaskEditModal, title: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-md"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Target Department</label>
                <select
                  value={showTaskEditModal.department}
                  onChange={(e) => setShowTaskEditModal({ ...showTaskEditModal, department: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-md bg-white"
                >
                  <option value="IT Security">IT Security</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Priority</label>
                  <select
                    value={showTaskEditModal.priority}
                    onChange={(e) => setShowTaskEditModal({ ...showTaskEditModal, priority: e.target.value as any })}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-md bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Deadline</label>
                  <input
                    type="text"
                    required
                    value={showTaskEditModal.deadline}
                    onChange={(e) => setShowTaskEditModal({ ...showTaskEditModal, deadline: e.target.value })}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Force Override Status</label>
                <select
                  value={showTaskEditModal.status}
                  onChange={(e) => setShowTaskEditModal({ ...showTaskEditModal, status: e.target.value as any })}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-md bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskEditModal(null)}
                  className="px-3.5 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
