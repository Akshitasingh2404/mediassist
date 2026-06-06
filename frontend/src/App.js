import { useState } from "react";

const QUICK_PROMPTS = [
  "I have a headache and mild fever since yesterday",
  "What are some healthy daily habits?",
  "I feel stressed and anxious lately",
  "What are symptoms of diabetes?",
  "How much water should I drink daily?",
  "What foods help boost immunity?",
];

function App() {
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [meds, setMeds] = useState([
    { name: "Vitamin D3", dose: "1 tablet", time: "08:00", status: "Taken" },
    { name: "Omega-3", dose: "2 capsules", time: "13:00", status: "Due soon" },
  ]);
  const [newMed, setNewMed] = useState({ name: "", dose: "", time: "08:00" });

  const sendMessage = async (msg) => {
    const text = msg || input;
    if (!text.trim()) return;
    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, could not connect to server." }]);
    } finally {
      setLoading(false);
    }
  };

  const calcBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return;
    const val = (w / (h * h)).toFixed(1);
    let label = val < 18.5 ? "Underweight" : val < 25 ? "Normal weight ✅" : val < 30 ? "Overweight ⚠️" : "Obese 🔴";
    setBmi({ val, label });
  };

  const addMed = () => {
    if (!newMed.name) return;
    setMeds([...meds, { ...newMed, status: "Pending" }]);
    setNewMed({ name: "", dose: "", time: "08:00" });
  };

  const styles = {
    app: { fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#F4F1EC", color: "#1C1C1A" },
    header: { background: "#fff", borderBottom: "1px solid #DDD9D0", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: 22, fontWeight: 700, color: "#1A6B4A" },
    nav: { display: "flex", gap: 4 },
    navBtn: (active) => ({ padding: "7px 16px", borderRadius: 8, border: "none", background: active ? "#E8F4EF" : "transparent", color: active ? "#1A6B4A" : "#6B6860", fontWeight: active ? 600 : 400, cursor: "pointer", fontSize: 14 }),
    badge: { fontSize: 11, background: "#FFF3CD", color: "#856404", border: "1px solid #FFC107", padding: "4px 10px", borderRadius: 20 },
    main: { maxWidth: 1100, margin: "0 auto", padding: 24, display: "flex", gap: 20 },
    sidebar: { width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 },
    card: { background: "#fff", border: "1px solid #DDD9D0", borderRadius: 16, padding: 16 },
    sideTitle: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B6860", marginBottom: 10 },
    quickBtn: { width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "1px solid #DDD9D0", background: "#F4F1EC", color: "#1C1C1A", fontSize: 12, cursor: "pointer", marginBottom: 5 },
    chatBox: { flex: 1, background: "#fff", border: "1px solid #DDD9D0", borderRadius: 16, display: "flex", flexDirection: "column", minHeight: 600 },
    chatHeader: { padding: "14px 20px", borderBottom: "1px solid #DDD9D0", display: "flex", alignItems: "center", gap: 8 },
    dot: { width: 8, height: 8, background: "#22C55E", borderRadius: "50%" },
    messages: { flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 },
    userBubble: { alignSelf: "flex-end", background: "#1A6B4A", color: "white", padding: "10px 14px", borderRadius: "16px 16px 4px 16px", maxWidth: "70%", fontSize: 14, lineHeight: 1.6 },
    aiBubble: { alignSelf: "flex-start", background: "#E8F4EF", border: "1px solid #C8E6D8", padding: "10px 14px", borderRadius: "16px 16px 16px 4px", maxWidth: "70%", fontSize: 14, lineHeight: 1.6 },
    inputArea: { padding: "14px 20px", borderTop: "1px solid #DDD9D0", display: "flex", gap: 8 },
    input: { flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #DDD9D0", fontSize: 14, outline: "none", fontFamily: "inherit" },
    sendBtn: { padding: "10px 20px", background: "#1A6B4A", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500 },
    disclaimer: { background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 16, padding: "12px 14px", fontSize: 12, color: "#92400E" },
    pageWrap: { maxWidth: 1100, margin: "0 auto", padding: 24 },
    pageTitle: { fontSize: 28, fontWeight: 700, color: "#1A6B4A", marginBottom: 6 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginTop: 20 },
    metricCard: { background: "#fff", border: "1px solid #DDD9D0", borderRadius: 16, padding: 20 },
    metricVal: { fontSize: 32, fontWeight: 700, color: "#1A6B4A" },
    formRow: { display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" },
    formGroup: { display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 120 },
    label: { fontSize: 13, color: "#6B6860", fontWeight: 500 },
    formInput: { padding: "10px 12px", border: "1.5px solid #DDD9D0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", outline: "none" },
    calcBtn: { padding: "10px 22px", background: "#1A6B4A", color: "white", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 500 },
    bmiResult: { marginTop: 14, padding: 16, background: "#E8F4EF", border: "1px solid #C8E6D8", borderRadius: 12 },
    medCard: { background: "#fff", border: "1px solid #DDD9D0", borderRadius: 14, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 },
    medIcon: { width: 40, height: 40, background: "#E8F4EF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 },
    statusColor: (s) => s === "Taken" ? "#16A34A" : s === "Due soon" ? "#D97706" : "#6B6860",
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logo}>🏥 MediAssist AI</div>
        <div style={styles.nav}>
          {["chat","metrics","meds"].map(t => (
            <button key={t} style={styles.navBtn(tab===t)} onClick={() => setTab(t)}>
              {t === "chat" ? "💬 Chat" : t === "metrics" ? "📊 Health Metrics" : "💊 Medications"}
            </button>
          ))}
        </div>
        <span style={styles.badge}>⚠️ Not medical advice</span>
      </header>

      {/* CHAT TAB */}
      {tab === "chat" && (
        <div style={styles.main}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            <div style={styles.card}>
              <div style={styles.sideTitle}>Quick Prompts</div>
              {QUICK_PROMPTS.map((q, i) => (
                <button key={i} style={styles.quickBtn} onClick={() => { setTab("chat"); sendMessage(q); }}>
                  {q.slice(0, 40)}...
                </button>
              ))}
            </div>
            <div style={styles.card}>
              <div style={styles.sideTitle}>My Health</div>
              {[["BMI","22.4"],["Age","24"],["Blood Group","B+"],["Next Checkup","Jul 10"]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #EEE", fontSize:13 }}>
                  <span style={{ color:"#6B6860" }}>{k}</span>
                  <span style={{ fontWeight:600, color:"#1A6B4A" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={styles.disclaimer}>
              <strong style={{ display:"block", marginBottom:4 }}>⚠️ Disclaimer</strong>
              General info only. Always consult a qualified doctor.
            </div>
          </div>

          {/* Chat box */}
          <div style={styles.chatBox}>
            <div style={styles.chatHeader}>
              <div style={styles.dot}></div>
              <span style={{ fontWeight:600 }}>Dr. Medi AI</span>
              <span style={{ marginLeft:"auto", fontSize:12, color:"#6B6860" }}>Powered by Groq AI</span>
            </div>
            <div style={styles.messages}>
              {messages.length === 0 && (
                <div style={{ ...styles.aiBubble }}>
                  👋 Hello! I'm MediAssist AI. Ask me about symptoms, healthy habits, medications, or general wellness!
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={m.role === "user" ? styles.userBubble : styles.aiBubble}>
                  {m.content}
                </div>
              ))}
              {loading && <div style={styles.aiBubble}>⏳ Thinking...</div>}
            </div>
            <div style={styles.inputArea}>
              <input
                style={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Ask a health question..."
              />
              <button style={styles.sendBtn} onClick={() => sendMessage()}>Send</button>
            </div>
          </div>
        </div>
      )}

      {/* METRICS TAB */}
      {tab === "metrics" && (
        <div style={styles.pageWrap}>
          <div style={styles.pageTitle}>📊 Health Metrics</div>
          <p style={{ color:"#6B6860", fontSize:14 }}>Track your key health indicators</p>
          <div style={styles.grid}>
            {[["BMI","22.4","Normal ✅"],["Blood Pressure","118/76","Normal ✅"],["Heart Rate","72 bpm","Normal ✅"],["Water","1.8 L","Low ⚠️"],["Sleep","6.5 hrs","Low ⚠️"],["Steps","7,240","Good ✅"]].map(([l,v,s]) => (
              <div key={l} style={styles.metricCard}>
                <div style={{ fontSize:12, color:"#6B6860", marginBottom:6 }}>{l}</div>
                <div style={styles.metricVal}>{v}</div>
                <div style={{ fontSize:12, marginTop:6, color: s.includes("✅") ? "#16A34A" : "#D97706" }}>{s}</div>
              </div>
            ))}
          </div>

          {/* BMI Calculator */}
          <div style={{ ...styles.card, marginTop:20 }}>
            <div style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>BMI Calculator</div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Height (cm)</label>
                <input style={styles.formInput} value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 170" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Weight (kg)</label>
                <input style={styles.formInput} value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 65" />
              </div>
              <div style={{ ...styles.formGroup, justifyContent:"flex-end" }}>
                <label style={styles.label}>&nbsp;</label>
                <button style={styles.calcBtn} onClick={calcBMI}>Calculate</button>
              </div>
            </div>
            {bmi && (
              <div style={styles.bmiResult}>
                <div style={{ fontSize:36, fontWeight:700, color:"#1A6B4A" }}>{bmi.val}</div>
                <div style={{ fontSize:14, color:"#6B6860", marginTop:4 }}>{bmi.label}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MEDICATIONS TAB */}
      {tab === "meds" && (
        <div style={styles.pageWrap}>
          <div style={styles.pageTitle}>💊 Medication Tracker</div>
          <div style={{ marginTop:16 }}>
            {meds.map((m, i) => (
              <div key={i} style={styles.medCard}>
                <div style={styles.medIcon}>💊</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:15 }}>{m.name}</div>
                  <div style={{ fontSize:13, color:"#6B6860", marginTop:2 }}>{m.dose} · Daily</div>
                </div>
                <div style={{ marginLeft:"auto", textAlign:"right", fontSize:13 }}>
                  <div style={{ fontWeight:500, color:"#1A6B4A" }}>{m.time}</div>
                  <div style={{ fontSize:12, color: styles.statusColor(m.status) }}>{m.status}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add medication */}
          <div style={{ ...styles.card, marginTop:16 }}>
            <div style={{ fontWeight:600, fontSize:16, marginBottom:14 }}>+ Add Medication</div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input style={styles.formInput} value={newMed.name} onChange={e => setNewMed({...newMed, name:e.target.value})} placeholder="e.g. Paracetamol" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Dosage</label>
                <input style={styles.formInput} value={newMed.dose} onChange={e => setNewMed({...newMed, dose:e.target.value})} placeholder="e.g. 500mg" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Time</label>
                <input style={styles.formInput} type="time" value={newMed.time} onChange={e => setNewMed({...newMed, time:e.target.value})} />
              </div>
            </div>
            <button style={styles.calcBtn} onClick={addMed}>Add to Tracker</button>
          </div>
        </div>
      )}

      <p style={{ textAlign:"center", fontSize:11, color:"#aaa", padding:"16px 0" }}>
        ⚠️ MediAssist is for informational purposes only. Always consult a qualified doctor for medical advice.
      </p>
    </div>
  );
}

export default App;