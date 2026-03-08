import { useState, useEffect } from "react";

// ─── Inline Toast System (replaces react-toastify) ───────────────────────────
let toastId = 0;
let toastSetter = null;

const toast = {
  success: (msg) => toastSetter?.((p) => [...p, { id: ++toastId, msg, type: "success" }]),
  info: (msg) => toastSetter?.((p) => [...p, { id: ++toastId, msg, type: "info" }]),
  warning: (msg) => toastSetter?.((p) => [...p, { id: ++toastId, msg, type: "warning" }]),
};

function ToastContainer() {
  const [toasts, setToasts] = useState([]);
   useEffect(() => {
    toastSetter = setToasts;
    return () => { toastSetter = null; };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const last = toasts[toasts.length - 1];
    const t = setTimeout(() => setToasts((p) => p.filter((x) => x.id !== last.id)), 3500);
    return () => clearTimeout(t);
  }, [toasts]);

  const colors = { success: "#10b981", info: "#3b82f6", warning: "#f59e0b" };
  const icons = { success: "✓", info: "ℹ", warning: "⚠" };

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: "#1e293b", color: "#f1f5f9", padding: "12px 18px",
          borderRadius: 10, borderLeft: `4px solid ${colors[t.type]}`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)", display: "flex", alignItems: "center",
          gap: 10, minWidth: 260, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          animation: "slideIn 0.3s ease",
        }}>
          <span style={{ color: colors[t.type], fontWeight: 700, fontSize: 16 }}>{icons[t.type]}</span>
          {t.msg}
          <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
      ))}
    </div>
  );
}

// ─── Initial ticket data ──────────────────────────────────────────────────────
const INITIAL_TICKETS = [
  { id: 1, title: "Login page not loading", description: "Users report the login page throws a 504 gateway error intermittently during peak hours.", customer: "Ariana Torres", priority: "High", status: "open", createdAt: "2025-03-01" },
  { id: 2, title: "Payment gateway timeout", description: "Checkout fails at the payment step for cards ending in 4242. Stripe logs show a timeout after 30s.", customer: "Marcus Bell", priority: "Critical", status: "open", createdAt: "2025-03-02" },
  { id: 3, title: "Profile picture upload failing", description: "Images above 2MB fail silently without any error message shown to the user.", customer: "Yuki Tanaka", priority: "Medium", status: "open", createdAt: "2025-03-02" },
  { id: 4, title: "Email verification not sent", description: "New registrations don't receive the verification email. Checked spam — not there either.", customer: "Sofia Reyes", priority: "High", status: "open", createdAt: "2025-03-03" },
  { id: 5, title: "Dashboard charts missing", description: "The analytics dashboard shows blank chart containers after the latest deploy.", customer: "Devon Okafor", priority: "Medium", status: "open", createdAt: "2025-03-03" },
  { id: 6, title: "Search returning wrong results", description: "Searching for 'invoice' returns unrelated user records instead of invoice documents.", customer: "Priya Nair", priority: "High", status: "open", createdAt: "2025-03-04" },
  { id: 7, title: "Mobile nav menu broken", description: "The hamburger menu on iOS Safari doesn't open. Tap events are not registering correctly.", customer: "Lucas Ferreira", priority: "Low", status: "open", createdAt: "2025-03-04" },
  { id: 8, title: "Export CSV data truncated", description: "CSV exports only include the first 100 rows regardless of filter selections.", customer: "Amara Diallo", priority: "Medium", status: "open", createdAt: "2025-03-05" },
  { id: 9, title: "Notification emails delayed", description: "System notifications arrive 4–6 hours late. SLA breach likely if not resolved.", customer: "James Whitfield", priority: "Critical", status: "open", createdAt: "2025-03-05" },
  { id: 10, title: "Two-factor auth loop", description: "After enabling 2FA, users are asked for the OTP code in a loop and cannot log in.", customer: "Elena Kowalski", priority: "Critical", status: "open", createdAt: "2025-03-06" },
  { id: 11, title: "Report generation slow", description: "Monthly reports take over 8 minutes to generate. Used to be under 30 seconds.", customer: "Omar Fadel", priority: "Medium", status: "open", createdAt: "2025-03-06" },
  { id: 12, title: "Dark mode flash on load", description: "When dark mode is active, there's a bright flash of white before the theme applies.", customer: "Chloe Beaumont", priority: "Low", status: "open", createdAt: "2025-03-07" },
];

// ─── Priority badge config ────────────────────────────────────────────────────
const PRIORITY = {
  Critical: { bg: "#fef2f2", color: "#dc2626", dot: "#dc2626" },
  High:     { bg: "#fff7ed", color: "#ea580c", dot: "#ea580c" },
  Medium:   { bg: "#fefce8", color: "#ca8a04", dot: "#ca8a04" },
  Low:      { bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a" },
};

// ─── Subcomponents ────────────────────────────────────────────────────────────
function Navbar({ onNewTicket }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      background: "#0f172a", borderBottom: "1px solid #1e293b",
      padding: "0 32px", height: 64, display: "flex", alignItems: "center",
      justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🎧</div>
        <span style={{ color: "#f1f5f9", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>
          SupportZone
        </span>
      </div>

      {/* Desktop nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 28, fontFamily: "'DM Sans', sans-serif" }}
        className="desktop-nav">
        {["Dashboard", "Tickets", "Reports", "Settings"].map((item) => (
          <a key={item} href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500,
            transition: "color 0.2s" }}
            onMouseOver={(e) => e.target.style.color = "#f1f5f9"}
            onMouseOut={(e) => e.target.style.color = "#94a3b8"}>
            {item}
          </a>
        ))}
        <button onClick={onNewTicket} style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
          border: "none", padding: "8px 18px", borderRadius: 8, fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.2px",
          boxShadow: "0 2px 12px rgba(99,102,241,0.4)", transition: "opacity 0.2s",
        }}
          onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>
          + New Ticket
        </button>
      </div>

      {/* Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger"
        style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 22, cursor: "pointer", display: "none" }}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: 64, left: 0, right: 0, background: "#0f172a",
          borderBottom: "1px solid #1e293b", padding: "16px 24px", display: "flex",
          flexDirection: "column", gap: 14, zIndex: 200,
        }} className="mobile-menu">
          {["Dashboard", "Tickets", "Reports", "Settings"].map((item) => (
            <a key={item} href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>{item}</a>
          ))}
          <button onClick={() => { onNewTicket(); setMenuOpen(false); }} style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
            border: "none", padding: "10px 18px", borderRadius: 8, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 14, cursor: "pointer", alignSelf: "flex-start",
          }}>+ New Ticket</button>
        </div>
      )}
    </nav>
  );
}

function Banner({ inProgress, resolved, total }) {
  return (
    <div style={{
      background: "linear-gradient(120deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)",
      padding: "48px 32px 40px", position: "relative", overflow: "hidden",
    }}>
      {/* decorative circles */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)",
          width: [300, 500, 700][i], height: [300, 500, 700][i],
          top: ["-100px", "-180px", "-250px"][i], right: ["-80px", "-160px", "-240px"][i],
          pointerEvents: "none",
        }} />
      ))}

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>
        <p style={{ color: "#a5b4fc", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
          letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8 }}>
          Customer Support Portal
        </p>
        <h1 style={{ color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: "clamp(26px, 4vw, 40px)",
          fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
          Ticket Management
        </h1>
        <p style={{ color: "#c7d2fe", fontFamily: "'DM Sans', sans-serif", fontSize: 15, margin: "0 0 36px" }}>
          Track, manage, and resolve customer issues efficiently.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Tickets", value: total, icon: "🎫", accent: "#818cf8" },
            { label: "In Progress", value: inProgress, icon: "⚡", accent: "#f59e0b" },
            { label: "Resolved", value: resolved, icon: "✅", accent: "#10b981" },
          ].map(({ label, value, icon, accent }) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14,
              padding: "18px 28px", minWidth: 140, flex: "1 1 140px", maxWidth: 200,
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
              <div style={{ color: accent, fontFamily: "'Sora', sans-serif", fontSize: 32,
                fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div style={{ color: "#c7d2fe", fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, marginTop: 4, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TicketCard({ ticket, onSelect, isSelected }) {
  const p = PRIORITY[ticket.priority] || PRIORITY.Medium;
  return (
    <div onClick={() => onSelect(ticket)} style={{
      background: isSelected ? "#f0f4ff" : "#fff",
      border: isSelected ? "2px solid #6366f1" : "1.5px solid #e2e8f0",
      borderRadius: 14, padding: "18px 20px", cursor: "pointer",
      transition: "all 0.2s", boxShadow: isSelected ? "0 4px 20px rgba(99,102,241,0.15)" : "0 1px 4px rgba(0,0,0,0.05)",
      transform: isSelected ? "translateY(-1px)" : "none",
    }}
      onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; }}
      onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
          letterSpacing: "0.5px" }}>#{ticket.id}</span>
        <span style={{ background: p.bg, color: p.color, padding: "3px 10px", borderRadius: 20,
          fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.dot, display: "inline-block" }} />
          {ticket.priority}
        </span>
      </div>
      <h3 style={{ color: "#0f172a", fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700,
        margin: "0 0 6px", lineHeight: 1.3 }}>{ticket.title}</h3>
      <p style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 13, margin: "0 0 14px",
        lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {ticket.description}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>
            {ticket.customer.split(" ").map(w => w[0]).join("")}
          </div>
          <span style={{ color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500 }}>{ticket.customer}</span>
        </div>
        <span style={{ color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{ticket.createdAt}</span>
      </div>
    </div>
  );
}

function TaskStatusPanel({ tasks, onComplete }) {
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16,
      padding: "20px", height: "fit-content", position: "sticky", top: 80,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <h2 style={{ color: "#0f172a", fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, margin: 0 }}>
          In Progress
        </h2>
        {tasks.length > 0 && (
          <span style={{ background: "#fef3c7", color: "#d97706", borderRadius: 20, padding: "2px 10px",
            fontSize: 12, fontWeight: 700, marginLeft: "auto" }}>{tasks.length}</span>
        )}
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 16px" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
          <p style={{ color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, margin: 0 }}>
            Click a ticket card to start working on it.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.map((task) => {
            const p = PRIORITY[task.priority] || PRIORITY.Medium;
            return (
              <div key={task.id} style={{
                background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12,
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ background: p.bg, color: p.color, padding: "2px 7px", borderRadius: 20,
                    fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", marginTop: 1 }}>{task.priority}</span>
                  <p style={{ color: "#1e293b", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{task.title}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>
                    {task.customer}
                  </span>
                  <button onClick={() => onComplete(task)} style={{
                    background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff",
                    border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 12,
                    fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 2px 8px rgba(16,185,129,0.35)", transition: "opacity 0.2s",
                  }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>
                    ✓ Complete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResolvedPanel({ resolved }) {
  if (resolved.length === 0) return null;
  return (
    <div style={{
      background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 16,
      padding: "20px", marginTop: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>✅</span>
        <h2 style={{ color: "#14532d", fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, margin: 0 }}>
          Resolved
        </h2>
        <span style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 20, padding: "2px 10px",
          fontSize: 12, fontWeight: 700, marginLeft: "auto" }}>{resolved.length}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {resolved.map((task) => (
          <div key={task.id} style={{
            background: "#fff", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ color: "#16a34a", fontSize: 14 }}>✓</span>
            <div>
              <p style={{ color: "#166534", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, margin: 0 }}>{task.title}</p>
              <p style={{ color: "#4ade80", fontFamily: "'DM Sans', sans-serif", fontSize: 11, margin: 0 }}>{task.customer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      background: "#0f172a", borderTop: "1px solid #1e293b",
      padding: "40px 32px 24px", marginTop: 64,
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 36 }}>
          <div style={{ maxWidth: 260 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎧</div>
              <span style={{ color: "#f1f5f9", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17 }}>SupportZone</span>
            </div>
            <p style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Streamline your customer support workflow with smart ticket management and real-time tracking.
            </p>
          </div>
          {[
            { title: "Product", links: ["Dashboard", "Tickets", "Analytics", "Integrations"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            { title: "Support", links: ["Documentation", "Status", "Contact", "Privacy"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p style={{ color: "#e2e8f0", fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
                margin: "0 0 14px", letterSpacing: "0.3px" }}>{title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {links.map((l) => (
                  <a key={l} href="#" style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseOver={(e) => e.target.style.color = "#94a3b8"}
                    onMouseOut={(e) => e.target.style.color = "#64748b"}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 20, display: "flex",
          justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: 12, margin: 0 }}>
            © 2025 SupportZone. All rights reserved.
          </p>
          <p style={{ color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: 12, margin: 0 }}>
            Built with ❤️ for customer success teams.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [inProgress, setInProgress] = useState([]);
  const [resolved, setResolved] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleSelectTicket = (ticket) => {
    if (selectedIds.has(ticket.id)) {
      toast.info(`"${ticket.title}" is already in progress.`);
      return;
    }
    setSelectedIds((prev) => new Set([...prev, ticket.id]));
    setInProgress((prev) => [...prev, ticket]);
    toast.warning(`⚡ "${ticket.title}" added to In Progress!`);
  };

  const handleComplete = (task) => {
    setInProgress((prev) => prev.filter((t) => t.id !== task.id));
    setSelectedIds((prev) => { const s = new Set(prev); s.delete(task.id); return s; });
    setResolved((prev) => [task, ...prev]);
    setTickets((prev) => prev.filter((t) => t.id !== task.id));
    toast.success(`✅ "${task.title}" resolved successfully!`);
  };

  const handleNewTicket = () => {
    toast.info("📝 New ticket form coming soon!");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8fafc; }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @media (max-width: 680px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
          .main-grid { grid-template-columns: 1fr !important; }
          .right-col { position: static !important; }
        }
      `}</style>

      <ToastContainer />
      <Navbar onNewTicket={handleNewTicket} />
      <Banner inProgress={inProgress.length} resolved={resolved.length} total={tickets.length} />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px" }}>
        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          {/* Left — Ticket Cards */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: "#0f172a", fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700 }}>
                Customer Tickets
              </h2>
              <span style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                {tickets.length} open
              </span>
            </div>

            {tickets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff",
                borderRadius: 16, border: "1.5px dashed #e2e8f0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <h3 style={{ color: "#0f172a", fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                  All tickets resolved!
                </h3>
                <p style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                  Your team crushed it. No open tickets remain.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onSelect={handleSelectTicket}
                    isSelected={selectedIds.has(ticket.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right — Status + Resolved */}
          <div className="right-col" style={{ position: "sticky", top: 80 }}>
            <TaskStatusPanel tasks={inProgress} onComplete={handleComplete} />
            <ResolvedPanel resolved={resolved} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}