import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import jsPDF from "jspdf";

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  "I have a headache and mild fever since yesterday",
  "What are some healthy daily habits?",
  "I feel stressed and anxious lately",
  "What are symptoms of diabetes?",
  "How much water should I drink daily?",
  "What foods help boost immunity?",
];

const SYMPTOMS = [
  "Headache","Fever","Cough","Sore throat","Fatigue",
  "Nausea","Vomiting","Diarrhea","Chest pain","Shortness of breath",
  "Dizziness","Body ache","Loss of appetite","Rash","Runny nose",
  "Joint pain","Stomach pain","Back pain","Chills","Sweating",
];

const HEALTH_TIPS = [
  "Drink at least 8 glasses of water every day to stay hydrated.",
  "Walk for 30 minutes daily to improve heart health.",
  "Sleep 7-8 hours every night for better immunity.",
  "Eat 5 servings of fruits and vegetables daily.",
  "Take deep breaths for 5 minutes to reduce stress.",
  "Wash your hands regularly to prevent infections.",
  "Avoid processed foods and prefer home-cooked meals.",
  "Exercise at least 3 times a week for 30 minutes.",
  "Meditate for 10 minutes every morning.",
  "Limit screen time before bed for better sleep quality.",
  "Eat breakfast within 1 hour of waking up.",
  "Stand up and stretch every 1 hour if you sit at a desk.",
  "Avoid sugary drinks — replace with lemon water.",
  "Get regular health checkups every 6 months.",
  "Practice gratitude daily for better mental health.",
];

const TRANSLATIONS = {
  en: {
    appName: "MediAssist AI",
    chat: "💬 Chat",
    metrics: "📊 Metrics",
    meds: "💊 Medications",
    doctors: "🗺️ Find Doctors",
    diet: "🍽️ Diet Plan",
    profile: "👤 Profile",
    notMedical: "⚠️ Not medical advice",
    askQuestion: "Ask a health question...",
    send: "Send",
    quickPrompts: "Quick Prompts",
    myHealth: "My Health",
    disclaimer: "General info only. Always consult a qualified doctor.",
    thinking: "⏳ Thinking...",
    saveChat: "💾 Save",
    clearChat: "🗑️ Clear",
    symptomChecker: "🩺 Symptom Checker",
    emergency: "🆘 Emergency",
    waterTracker: "💧 Water Tracker",
    tipOfDay: "💡 Health Tip of the Day",
    findNearMe: "📍 Find Near Me",
    findingLocation: "⏳ Finding...",
    generateDietPlan: "Generate My Diet Plan",
    generating: "⏳ Generating...",
  },
  hi: {
    appName: "मेडीअसिस्ट AI",
    chat: "💬 चैट",
    metrics: "📊 स्वास्थ्य",
    meds: "💊 दवाइयाँ",
    doctors: "🗺️ डॉक्टर खोजें",
    diet: "🍽️ डाइट प्लान",
    profile: "👤 प्रोफाइल",
    notMedical: "⚠️ चिकित्सीय सलाह नहीं",
    askQuestion: "स्वास्थ्य प्रश्न पूछें...",
    send: "भेजें",
    quickPrompts: "त्वरित प्रश्न",
    myHealth: "मेरा स्वास्थ्य",
    disclaimer: "सामान्य जानकारी। हमेशा डॉक्टर से मिलें।",
    thinking: "⏳ सोच रहा हूँ...",
    saveChat: "💾 सेव",
    clearChat: "🗑️ साफ करें",
    symptomChecker: "🩺 लक्षण जाँचें",
    emergency: "🆘 आपातकाल",
    waterTracker: "💧 पानी ट्रैकर",
    tipOfDay: "💡 आज का स्वास्थ्य सुझाव",
    findNearMe: "📍 पास खोजें",
    findingLocation: "⏳ खोज रहे हैं...",
    generateDietPlan: "मेरा डाइट प्लान बनाएं",
    generating: "⏳ बना रहे हैं...",
  },
};

const bmiData = [
  { week: "Week 1", bmi: 23.1 },
  { week: "Week 2", bmi: 22.8 },
  { week: "Week 3", bmi: 22.5 },
  { week: "Week 4", bmi: 22.4 },
];

const sleepData = [
  { day: "Mon", hrs: 6 },
  { day: "Tue", hrs: 7 },
  { day: "Wed", hrs: 5.5 },
  { day: "Thu", hrs: 8 },
  { day: "Fri", hrs: 6.5 },
  { day: "Sat", hrs: 7.5 },
  { day: "Sun", hrs: 7 },
];
const moodData = [
  { day: "Mon", mood: 3 },
  { day: "Tue", mood: 4 },
  { day: "Wed", mood: 2 },
  { day: "Thu", mood: 5 },
  { day: "Fri", mood: 4 },
  { day: "Sat", mood: 5 },
  { day: "Sun", mood: 4 },
];

<LineChart data={moodData}>
  <XAxis dataKey="day" />
  <YAxis />
  <Line type="monotone" dataKey="mood" stroke="#8884d8" />
</LineChart>

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  // Core state
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedReply, setDisplayedReply] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("en");
  const t = TRANSLATIONS[lang];

  // Health metrics
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [waterCount, setWaterCount] = useState(0);
  const [todayMood, setTodayMood] = useState(null);

  // Medications
  const [meds, setMeds] = useState([
    { name: "Vitamin D3", dose: "1 tablet", time: "08:00", status: "Taken" },
    { name: "Omega-3", dose: "2 capsules", time: "13:00", status: "Due soon" },
  ]);
  const [newMed, setNewMed] = useState({ name: "", dose: "", time: "08:00" });
  const [notifEnabled, setNotifEnabled] = useState(false);

  // Symptom checker
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);

  // Emergency SOS
  const [showSOS, setShowSOS] = useState(false);

  // Feedback
  const [feedback, setFeedback] = useState({});

  // Doctor finder
  const [userLocation, setUserLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Diet plan
  const [dietForm, setDietForm] = useState({ age: "", weight: "", goal: "weight loss", veg: "vegetarian" });
  const [dietPlan, setDietPlan] = useState("");
  const [dietLoading, setDietLoading] = useState(false);

  // Profile
  const [profile, setProfile] = useState({
    name: "Akshita Singh",
    age: "24",
    bloodGroup: "B+",
    height: "165",
    weight: "60",
    goal: "Stay fit and healthy",
    allergies: "None",
  });
  const [editingProfile, setEditingProfile] = useState(false);

  // Health tip of the day
  const todayTip = HEALTH_TIPS[new Date().getDate() % HEALTH_TIPS.length];

  // ── THEME COLORS ─────────────────────────────────────────────────────────
  const bg       = darkMode ? "#0f1117" : "#F4F1EC";
  const card     = darkMode ? "#1a1d27" : "#fff";
  const text     = darkMode ? "#e8e6e0" : "#1C1C1A";
  const muted    = darkMode ? "#8b8980" : "#6B6860";
  const border   = darkMode ? "#2d2f3e" : "#DDD9D0";
  const green    = "#1A6B4A";
  const greenLight = darkMode ? "#0d2e1e" : "#E8F4EF";

  // ── SEND MESSAGE ──────────────────────────────────────────────────────────
  const sendMessage = async (msg) => {
    const text2 = msg || input;
    if (!text2.trim()) return;
    const userMsg = { role: "user", content: text2 };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text2, history: messages }),
      });
      const data = await res.json();
      const reply = data.reply;
      setLoading(false);
      setIsTyping(true);
      setDisplayedReply("");
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedReply(reply.slice(0, i + 1));
        i++;
        if (i >= reply.length) {
          clearInterval(interval);
          setIsTyping(false);
          setMessages([...newMessages, { role: "assistant", content: reply }]);
          setDisplayedReply("");
        }
      }, 18);
    } catch (err) {
      setLoading(false);
      setMessages([...newMessages, { role: "assistant", content: "Sorry, could not connect to server. Make sure Flask backend is running!" }]);
    }
  };

  // ── DIET PLAN GENERATOR ───────────────────────────────────────────────────
  const generateDietPlan = async () => {
    if (!dietForm.age || !dietForm.weight) {
      alert("Please fill in age and weight!");
      return;
    }
    setDietLoading(true);
    setDietPlan("");
    const prompt = `Create a detailed 7-day diet plan for a ${dietForm.age} year old ${dietForm.veg} person weighing ${dietForm.weight}kg. 
    Goal: ${dietForm.goal}. 
    Format it as Day 1, Day 2... with Breakfast, Lunch, Dinner and Snacks for each day.
    Include calorie estimates. Keep it practical for Indian diet.`;
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, history: [] }),
      });
      const data = await res.json();
      setDietPlan(data.reply);
    } catch (err) {
      setDietPlan("Could not generate diet plan. Make sure backend is running!");
    }
    setDietLoading(false);
  };

  // ── SYMPTOM CHECKER ───────────────────────────────────────────────────────
  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) { alert("Please select at least one symptom!"); return; }
    const prompt = `I have the following symptoms: ${selectedSymptoms.join(", ")}. What could be the possible causes and what should I do?`;
    setShowSymptomChecker(false);
    setSelectedSymptoms([]);
    setTab("chat");
    sendMessage(prompt);
  };

  const toggleSymptom = (s) =>
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  // ── CHAT HELPERS ──────────────────────────────────────────────────────────
  const clearChat = () => { setMessages([]); setDisplayedReply(""); };

  const downloadChat = () => {
    if (messages.length === 0) { alert("No chat to download!"); return; }
    const txt = messages.map(m => `${m.role === "user" ? "You" : "MediAssist AI"}: ${m.content}`).join("\n\n");
    const blob = new Blob([`MediAssist AI - Chat History\nDate: ${new Date().toLocaleDateString()}\n\n${txt}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "mediassist_chat.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported. Use Chrome!"); return; }
    const r = new SR();
    r.lang = "en-IN";
    r.start();
    r.onresult = (e) => setInput(e.results[0][0].transcript);
    r.onerror = () => alert("Could not hear you. Try again!");
  };

  // ── BMI ───────────────────────────────────────────────────────────────────
  const calcBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return;
    const val = (w / (h * h)).toFixed(1);
    const label = val < 18.5 ? "Underweight ⬇️" : val < 25 ? "Normal weight ✅" : val < 30 ? "Overweight ⚠️" : "Obese 🔴";
    setBmi({ val, label });
  };

  // ── MEDICATIONS ───────────────────────────────────────────────────────────
  const addMed = () => {
    if (!newMed.name) return;
    setMeds([...meds, { ...newMed, status: "Pending" }]);
    setNewMed({ name: "", dose: "", time: "08:00" });
  };

  const enableNotifications = () => {
    if (!("Notification" in window)) { alert("Notifications not supported!"); return; }
    Notification.requestPermission().then(p => {
      if (p === "granted") {
        setNotifEnabled(true);
        new Notification("MediAssist Reminders Enabled! 💊", { body: "You will be reminded about your medications." });
        meds.forEach(med => {
          const [h, m] = med.time.split(":").map(Number);
          const now = new Date();
          const t2 = new Date(); t2.setHours(h, m, 0, 0);
          const diff = t2 - now;
          if (diff > 0) setTimeout(() => new Notification(`Time for ${med.name}! 💊`, { body: `Take ${med.dose} now.` }), diff);
        });
      }
    });
  };

  // ── FIND HOSPITALS ────────────────────────────────────────────────────────
  const findNearbyHospitals = () => {
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setUserLocation({ lat, lon });
        const query = `[out:json];(node["amenity"="hospital"](around:5000,${lat},${lon});node["amenity"="clinic"](around:5000,${lat},${lon});node["healthcare"="hospital"](around:5000,${lat},${lon}););out body;`;
        try {
          const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
          const data = await res.json();
          setHospitals(data.elements || []);
        } catch { setLocationError("Could not fetch hospitals. Try again!"); }
        setLocationLoading(false);
      },
      () => { setLocationError("Could not get your location. Please allow location access!"); setLocationLoading(false); }
    );
  };

  // ── PDF REPORT ────────────────────────────────────────────────────────────
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(26, 107, 74);
    doc.rect(0, 0, 220, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20); doc.setFont("helvetica", "bold");
    doc.text("MediAssist AI — Health Report", 14, 18);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11); doc.setFont("helvetica", "normal");
    doc.text(`Patient: ${profile.name}  |  Age: ${profile.age}  |  Blood Group: ${profile.bloodGroup}`, 14, 38);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 46);
    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(26, 107, 74);
    doc.text("Health Metrics", 14, 58);
    doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    [["BMI", "22.4 — Normal"], ["Blood Pressure", "118/76 mmHg — Normal"], ["Heart Rate", "72 bpm — Normal"], ["Daily Water", "1.8 L"], ["Sleep", "6.5 hrs/day"], ["Steps Today", "7,240"]].forEach(([k, v], i) => {
      doc.text(`${k}:`, 14, 68 + i * 9);
      doc.text(v, 70, 68 + i * 9);
    });
    doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(26, 107, 74);
    doc.text("Current Medications", 14, 128);
    doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "normal"); doc.setFontSize(11);
    meds.forEach((med, i) => doc.text(`${med.name} — ${med.dose} at ${med.time}`, 14, 138 + i * 9));
    if (bmi) {
      doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(26, 107, 74);
      doc.text("BMI Result", 14, 170);
      doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "normal"); doc.setFontSize(11);
      doc.text(`BMI: ${bmi.val} — ${bmi.label}`, 14, 180);
    }
    doc.setFontSize(9); doc.setTextColor(150, 150, 150);
    doc.text("This report is for informational purposes only. Always consult a qualified doctor.", 14, 285);
    doc.save("MediAssist_Health_Report.pdf");
  };

  // ── STYLES ────────────────────────────────────────────────────────────────
  const s = {
    app:        { fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: bg, color: text, transition: "all .3s" },
    header:     { background: card, borderBottom: `1px solid ${border}`, padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 8 },
    logo:       { fontSize: 18, fontWeight: 700, color: green },
    nav:        { display: "flex", gap: 2, flexWrap: "wrap" },
    navBtn:  (a) => ({ padding: "6px 12px", borderRadius: 8, border: "none", background: a ? greenLight : "transparent", color: a ? green : muted, fontWeight: a ? 600 : 400, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }),
    badge:      { fontSize: 11, background: "#FFF3CD", color: "#856404", border: "1px solid #FFC107", padding: "3px 8px", borderRadius: 20 },
    darkBtn:    { padding: "5px 10px", borderRadius: 8, border: `1px solid ${border}`, background: "transparent", color: text, cursor: "pointer", fontSize: 12, fontFamily: "inherit" },
    langBtn:    { padding: "5px 10px", borderRadius: 8, border: `1px solid ${border}`, background: lang === "hi" ? greenLight : "transparent", color: lang === "hi" ? green : text, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 },
    main:       { maxWidth: 1100, margin: "0 auto", padding: 20, display: "flex", gap: 16 },
    sidebar:    { width: 210, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 },
    card:       { background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 14 },
    sideTitle:  { fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 8 },
    quickBtn:   { width: "100%", textAlign: "left", padding: "7px 9px", borderRadius: 8, border: `1px solid ${border}`, background: bg, color: text, fontSize: 11, cursor: "pointer", marginBottom: 4, fontFamily: "inherit" },
    chatBox:    { flex: 1, background: card, border: `1px solid ${border}`, borderRadius: 16, display: "flex", flexDirection: "column", minHeight: 560 },
    chatHeader: { padding: "12px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
    dot:        { width: 8, height: 8, background: "#22C55E", borderRadius: "50%" },
    messages:   { flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 10 },
    userBubble: { alignSelf: "flex-end", background: green, color: "white", padding: "10px 14px", borderRadius: "16px 16px 4px 16px", maxWidth: "70%", fontSize: 14, lineHeight: 1.6 },
    aiBubble:   { alignSelf: "flex-start", background: greenLight, border: `1px solid ${darkMode ? "#1a4d35" : "#C8E6D8"}`, padding: "10px 14px", borderRadius: "16px 16px 16px 4px", maxWidth: "70%", fontSize: 14, lineHeight: 1.6, color: text },
    inputArea:  { padding: "12px 18px", borderTop: `1px solid ${border}`, display: "flex", gap: 8, alignItems: "center" },
    input:      { flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${border}`, fontSize: 14, outline: "none", fontFamily: "inherit", background: bg, color: text },
    sendBtn:    { padding: "10px 16px", background: green, color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit" },
    micBtn:     { padding: "10px 12px", background: "#EF4444", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 15 },
    iconBtn: (bg2) => ({ padding: "7px 10px", background: bg2, color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 11, fontFamily: "inherit", fontWeight: 500 }),
    disclaimer: { background: darkMode ? "#2a2000" : "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "10px 12px", fontSize: 11, color: "#92400E" },
    pageWrap:   { maxWidth: 1100, margin: "0 auto", padding: 20 },
    pageTitle:  { fontSize: 24, fontWeight: 700, color: green, marginBottom: 6 },
    grid:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12, marginTop: 16 },
    metricCard: { background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 18 },
    metricVal:  { fontSize: 28, fontWeight: 700, color: green },
    formRow:    { display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" },
    formGroup:  { display: "flex", flexDirection: "column", gap: 5, flex: 1, minWidth: 110 },
    label:      { fontSize: 12, color: muted, fontWeight: 500 },
    formInput:  { padding: "9px 11px", border: `1.5px solid ${border}`, borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none", background: bg, color: text },
    formSelect: { padding: "9px 11px", border: `1.5px solid ${border}`, borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none", background: bg, color: text },
    calcBtn:    { padding: "9px 20px", background: green, color: "white", border: "none", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 500, fontFamily: "inherit" },
    bmiResult:  { marginTop: 12, padding: 14, background: greenLight, border: `1px solid ${darkMode ? "#1a4d35" : "#C8E6D8"}`, borderRadius: 10 },
    medCard:    { background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 },
    medIcon:    { width: 38, height: 38, background: greenLight, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
    pdfBtn:     { padding: "9px 18px", background: "#2563EB", color: "white", border: "none", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 500, fontFamily: "inherit" },
    notifBtn:   { padding: "9px 18px", background: notifEnabled ? "#16A34A" : "#7C3AED", color: "white", border: "none", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 500, fontFamily: "inherit" },
    overlay:    { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
    modal:      { background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 22, width: 500, maxHeight: "80vh", overflowY: "auto" },
    symptomTag: (sel) => ({ padding: "7px 12px", borderRadius: 20, border: `1.5px solid ${sel ? green : border}`, background: sel ? greenLight : bg, color: sel ? green : text, cursor: "pointer", fontSize: 12, fontWeight: sel ? 600 : 400, margin: "3px", display: "inline-block", transition: "all .15s" }),
    sosBtn:     { width: "100%", padding: "14px", background: "#DC2626", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 },
    waterBtn:   { width: 50, height: 50, borderRadius: "50%", background: "#3B82F6", color: "white", border: "none", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={s.app}>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .msg-appear{animation:fadeIn .25s ease-out}
        pre{white-space:pre-wrap;font-family:inherit;margin:0}
      `}</style>

      {/* ── SYMPTOM CHECKER MODAL ── */}
      {showSymptomChecker && (
        <div style={s.overlay} onClick={() => setShowSymptomChecker(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: green }}>🩺 Symptom Checker</div>
              <button onClick={() => setShowSymptomChecker(false)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: muted }}>×</button>
            </div>
            <p style={{ fontSize: 12, color: muted, marginBottom: 12 }}>Select all symptoms you are experiencing:</p>
            <div style={{ marginBottom: 14 }}>
              {SYMPTOMS.map(sym => (
                <span key={sym} style={s.symptomTag(selectedSymptoms.includes(sym))} onClick={() => toggleSymptom(sym)}>
                  {selectedSymptoms.includes(sym) ? "✓ " : ""}{sym}
                </span>
              ))}
            </div>
            {selectedSymptoms.length > 0 && (
              <div style={{ background: greenLight, border: `1px solid ${darkMode ? "#1a4d35" : "#C8E6D8"}`, borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: green }}>
                Selected: {selectedSymptoms.join(", ")}
              </div>
            )}
            <button style={{ ...s.calcBtn, width: "100%" }} onClick={analyzeSymptoms}>
              🔍 Analyze {selectedSymptoms.length} Symptom{selectedSymptoms.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}

      {/* ── SOS MODAL ── */}
      {showSOS && (
        <div style={s.overlay} onClick={() => setShowSOS(false)}>
          <div style={{ ...s.modal, maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 40 }}>🆘</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#DC2626", marginTop: 6 }}>Emergency Numbers — India</div>
            </div>
            {[["🚑 Ambulance", "102"], ["🚒 Fire Brigade", "101"], ["🚔 Police", "100"], ["🏥 National Emergency", "112"], ["🩺 Health Helpline", "104"], ["☎️ Women Helpline", "1091"]].map(([label, num]) => (
              <a key={num} href={`tel:${num}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, textDecoration: "none", marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: "#1C1C1A" }}>{label}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#DC2626" }}>{num}</span>
              </a>
            ))}
            <button onClick={() => setShowSOS(false)} style={{ ...s.calcBtn, width: "100%", marginTop: 8, background: "#6B7280" }}>Close</button>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.logo}>🏥 {t.appName}</div>
        <div style={s.nav}>
          {["chat","metrics","meds","doctors","diet","profile"].map(tabId => (
            <button key={tabId} style={s.navBtn(tab === tabId)} onClick={() => setTab(tabId)}>
              {t[tabId] || tabId}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button style={s.langBtn} onClick={() => setLang(lang === "en" ? "hi" : "en")}>
            {lang === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
          </button>
          <button style={s.darkBtn} onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀️" : "🌙"}</button>
          <button style={{ ...s.darkBtn, background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#DC2626", fontWeight: 700 }} onClick={() => setShowSOS(true)}>🆘</button>
          <span style={s.badge}>{t.notMedical}</span>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: CHAT
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === "chat" && (
        <div style={s.main}>
          {/* Sidebar */}
          <div style={s.sidebar}>
            {/* Health tip */}
            <div style={{ ...s.card, background: darkMode ? "#1a2e10" : "#F0FBF4", border: "1px solid #C8E6D8" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: green, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>{t.tipOfDay}</div>
              <div style={{ fontSize: 12, color: text, lineHeight: 1.6 }}>{todayTip}</div>
            </div>

            {/* Quick prompts */}
            <div style={s.card}>
              <div style={s.sideTitle}>{t.quickPrompts}</div>
              {QUICK_PROMPTS.map((q, i) => (
                <button key={i} style={s.quickBtn} onClick={() => sendMessage(q)}>{q.slice(0, 36)}...</button>
              ))}
            </div>

            {/* Symptom checker button */}
            <button style={{ ...s.calcBtn, width: "100%", background: "#7C3AED", fontSize: 12 }} onClick={() => setShowSymptomChecker(true)}>
              {t.symptomChecker}
            </button>

            {/* Water tracker */}
            <div style={s.card}>
              <div style={s.sideTitle}>{t.waterTracker}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <button style={s.waterBtn} onClick={() => setWaterCount(c => Math.min(c + 1, 10))}>+</button>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#3B82F6" }}>{waterCount}/8</div>
                  <div style={{ fontSize: 11, color: muted }}>glasses today</div>
                </div>
                <button style={{ ...s.waterBtn, background: "#6B7280", fontSize: 16 }} onClick={() => setWaterCount(c => Math.max(c - 1, 0))}>−</button>
              </div>
              {/* Progress bar */}
              <div style={{ background: border, borderRadius: 20, height: 8, overflow: "hidden" }}>
                <div style={{ width: `${(waterCount / 8) * 100}%`, background: "#3B82F6", height: "100%", borderRadius: 20, transition: "width .3s" }} />
              </div>
              <div style={{ fontSize: 11, color: waterCount >= 8 ? "#16A34A" : muted, marginTop: 4 }}>
                {waterCount >= 8 ? "🎉 Goal reached!" : `${8 - waterCount} more to go`}
              </div>
            </div>

            {/* My health stats */}
            <div style={s.card}>
              <div style={s.sideTitle}>{t.myHealth}</div>
              {[["BMI", profile.weight && profile.height ? ((parseFloat(profile.weight) / Math.pow(parseFloat(profile.height)/100, 2)).toFixed(1)) : "22.4"],
                ["Age", profile.age],
                ["Blood Group", profile.bloodGroup],
                ["Height", `${profile.height} cm`],
                ["Weight", `${profile.weight} kg`]
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${border}`, fontSize: 12 }}>
                  <span style={{ color: muted }}>{k}</span>
                  <span style={{ fontWeight: 600, color: green }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={s.disclaimer}><strong style={{ display: "block", marginBottom: 3 }}>⚠️</strong>{t.disclaimer}</div>
          </div>

          {/* Chat box */}
          <div style={s.chatBox}>
            <div style={s.chatHeader}>
              <div style={{ ...s.dot, animation: "pulse 2s infinite" }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Dr. Medi AI</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <button style={s.iconBtn("#6B7280")} onClick={downloadChat}>{t.saveChat}</button>
                <button style={s.iconBtn("#EF4444")} onClick={clearChat}>{t.clearChat}</button>
                <span style={{ fontSize: 11, color: muted }}>Powered by Groq AI</span>
              </div>
            </div>

            <div style={s.messages}>
              {messages.length === 0 && !isTyping && (
                <div style={{ ...s.aiBubble, maxWidth: "80%" }} className="msg-appear">
                  👋 {lang === "hi" ? "नमस्ते! मैं MediAssist AI हूँ। मुझसे लक्षण, दवाइयाँ या स्वास्थ्य के बारे में पूछें!" : "Hello! I'm MediAssist AI. Ask me about symptoms, healthy habits, medications, or use the 🩺 Symptom Checker!"}
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className="msg-appear">
                  <div style={m.role === "user" ? s.userBubble : s.aiBubble}>
                    <pre>{m.content}</pre>
                  </div>
                  {m.role === "assistant" && (
                    <div style={{ display: "flex", gap: 4, marginTop: 3, marginLeft: 4 }}>
                      <button onClick={() => setFeedback({ ...feedback, [i]: "up" })} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 13, opacity: feedback[i] === "up" ? 1 : 0.35 }}>👍</button>
                      <button onClick={() => setFeedback({ ...feedback, [i]: "down" })} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 13, opacity: feedback[i] === "down" ? 1 : 0.35 }}>👎</button>
                    </div>
                  )}
                </div>
              ))}
              {loading && <div style={s.aiBubble}>{t.thinking}</div>}
              {isTyping && (
                <div style={s.aiBubble} className="msg-appear">
                  {displayedReply}<span style={{ animation: "blink 1s infinite", fontWeight: "bold" }}>|</span>
                </div>
              )}
            </div>

            <div style={s.inputArea}>
              <input style={s.input} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder={t.askQuestion} />
              <button style={s.micBtn} onClick={startVoice} title="Voice input">🎤</button>
              <button style={s.sendBtn} onClick={() => sendMessage()}>{t.send}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: METRICS
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === "metrics" && (
        <div style={s.pageWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
            <div style={s.pageTitle}>📊 Health Metrics</div>
            <button style={s.pdfBtn} onClick={downloadPDF}>📄 Download PDF Report</button>
          </div>

          {/* Tip of the day */}
          <div style={{ background: darkMode ? "#1a2e10" : "#F0FBF4", border: "1px solid #C8E6D8", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: green }}>
            💡 <strong>Tip:</strong> {todayTip}
          </div>

          {/* Metric cards */}
          <div style={s.grid}>
            {[["BMI","22.4","Normal ✅","#16A34A"],["Blood Pressure","118/76","Normal ✅","#16A34A"],["Heart Rate","72 bpm","Normal ✅","#16A34A"],["Water",`${waterCount}/8 glasses`, waterCount >= 8 ? "Goal reached ✅" : "Keep drinking ⚠️", waterCount >= 8 ? "#16A34A" : "#D97706"],["Sleep","6.5 hrs","Low ⚠️","#D97706"],["Steps","7,240","Good ✅","#16A34A"]].map(([l, v, st, c]) => (
              <div key={l} style={s.metricCard}>
                <div style={{ fontSize: 11, color: muted, marginBottom: 5 }}>{l}</div>
                <div style={s.metricVal}>{v}</div>
                <div style={{ fontSize: 11, marginTop: 5, color: c }}>{st}</div>
              </div>
            ))}
          </div>

          {/* Mood tracker */}
          <div style={{ ...s.card, marginTop: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>😊 Today's Mood</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[["😢","1","Sad"],["😔","2","Low"],["😐","3","Okay"],["😊","4","Good"],["😄","5","Great"]].map(([emoji, val, label]) => (
                <div key={val} onClick={() => setTodayMood(val)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 14px", borderRadius: 12, border: `2px solid ${todayMood === val ? green : border}`, background: todayMood === val ? greenLight : bg, cursor: "pointer", transition: "all .15s" }}>
                  <span style={{ fontSize: 24 }}>{emoji}</span>
                  <span style={{ fontSize: 11, color: muted, marginTop: 3 }}>{label}</span>
                </div>
              ))}
            </div>
            {todayMood && <div style={{ marginTop: 10, fontSize: 13, color: green }}>✅ Mood logged for today!</div>}
          </div>

          {/* BMI Trend chart */}
          <div style={{ ...s.card, marginTop: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📈 BMI Trend (Last 4 Weeks)</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={bmiData}>
                <CartesianGrid strokeDasharray="3 3" stroke={border} />
                <XAxis dataKey="week" stroke={muted} fontSize={11} />
                <YAxis stroke={muted} fontSize={11} domain={[21, 24]} />
                <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8 }} />
                <Line type="monotone" dataKey="bmi" stroke={green} strokeWidth={2} dot={{ fill: green }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep chart */}
          <div style={{ ...s.card, marginTop: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>😴 Sleep This Week (hours)</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke={border} />
                <XAxis dataKey="day" stroke={muted} fontSize={11} />
                <YAxis stroke={muted} fontSize={11} domain={[0, 9]} />
                <Tooltip contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 8 }} />
                <Bar dataKey="hrs" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* BMI Calculator */}
          <div style={{ ...s.card, marginTop: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🧮 BMI Calculator</div>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Height (cm)</label>
                <input style={s.formInput} value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 170" />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Weight (kg)</label>
                <input style={s.formInput} value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 65" />
              </div>
              <div style={{ ...s.formGroup, justifyContent: "flex-end" }}>
                <label style={s.label}>&nbsp;</label>
                <button style={s.calcBtn} onClick={calcBMI}>Calculate</button>
              </div>
            </div>
            {bmi && (
              <div style={s.bmiResult}>
                <div style={{ fontSize: 34, fontWeight: 700, color: green }}>{bmi.val}</div>
                <div style={{ fontSize: 13, color: muted, marginTop: 3 }}>{bmi.label}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: MEDICATIONS
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === "meds" && (
        <div style={s.pageWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={s.pageTitle}>💊 Medication Tracker</div>
            <button style={s.notifBtn} onClick={enableNotifications}>
              {notifEnabled ? "🔔 Reminders ON" : "🔕 Enable Reminders"}
            </button>
          </div>

          {meds.map((m, i) => (
            <div key={i} style={s.medCard}>
              <div style={s.medIcon}>💊</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{m.dose} · Daily</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: green }}>{m.time}</div>
                <div style={{ color: m.status === "Taken" ? "#16A34A" : m.status === "Due soon" ? "#D97706" : muted }}>{m.status}</div>
              </div>
              <button onClick={() => setMeds(meds.filter((_, j) => j !== i))}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#EF4444", fontSize: 18, marginLeft: 6 }}>×</button>
            </div>
          ))}

          <div style={{ ...s.card, marginTop: 14 }}>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>+ Add Medication</div>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Name</label>
                <input style={s.formInput} value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} placeholder="e.g. Paracetamol" />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Dosage</label>
                <input style={s.formInput} value={newMed.dose} onChange={e => setNewMed({ ...newMed, dose: e.target.value })} placeholder="e.g. 500mg" />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Time</label>
                <input style={s.formInput} type="time" value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })} />
              </div>
            </div>
            <button style={s.calcBtn} onClick={addMed}>Add to Tracker</button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: FIND DOCTORS
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === "doctors" && (
        <div style={s.pageWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={s.pageTitle}>🗺️ Find Nearby Doctors</div>
            <button style={s.calcBtn} onClick={findNearbyHospitals} disabled={locationLoading}>
              {locationLoading ? t.findingLocation : t.findNearMe}
            </button>
          </div>

          {locationError && (
            <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 12, padding: 12, marginBottom: 14, color: "#DC2626", fontSize: 13 }}>
              ⚠️ {locationError}
            </div>
          )}

          {!userLocation && !locationLoading && (
            <div style={{ ...s.card, textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🏥</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: green }}>Find Hospitals & Clinics Near You</div>
              <p style={{ color: muted, fontSize: 13, marginBottom: 16 }}>Click "Find Near Me" to see hospitals within 5km of your location using OpenStreetMap.</p>
              <button style={s.calcBtn} onClick={findNearbyHospitals}>📍 Allow Location & Search</button>
            </div>
          )}

          {userLocation && (
            <>
              <div style={{ background: greenLight, border: `1px solid #C8E6D8`, borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: green }}>
                📍 Location found! Showing hospitals within 5km — {hospitals.length} found.
              </div>
              {hospitals.length === 0 ? (
                <div style={{ ...s.card, textAlign: "center", padding: 30, color: muted }}>No hospitals found in 5km radius. Try a different location.</div>
              ) : (
                hospitals.slice(0, 12).map((h, i) => (
                  <div key={i} style={s.medCard}>
                    <div style={{ width: 38, height: 38, background: "#FEE2E2", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏥</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{h.tags?.name || "Hospital / Clinic"}</div>
                      <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
                        {h.tags?.amenity || "Medical facility"}
                        {h.tags?.["addr:street"] && ` · ${h.tags["addr:street"]}`}
                      </div>
                    </div>
                    {h.tags?.phone && (
                      <a href={`tel:${h.tags.phone}`} style={{ color: green, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>📞 Call</a>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {/* Emergency numbers */}
          <div style={{ ...s.card, marginTop: 20, background: darkMode ? "#1a0000" : "#FFF5F5", border: "1px solid #FCA5A5" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#DC2626", marginBottom: 12 }}>🆘 Emergency Numbers — India</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
              {[["🚑 Ambulance","102"],["🚒 Fire","101"],["🚔 Police","100"],["🏥 Emergency","112"],["🩺 Health Helpline","104"],["☎️ Women Helpline","1091"]].map(([label, num]) => (
                <a key={num} href={`tel:${num}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 6px", background: card, borderRadius: 10, border: `1px solid ${border}`, textDecoration: "none" }}>
                  <span style={{ fontSize: 18 }}>{label.split(" ")[0]}</span>
                  <span style={{ fontSize: 11, color: muted, marginTop: 2 }}>{label.split(" ").slice(1).join(" ")}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", marginTop: 3 }}>{num}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: DIET PLAN
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === "diet" && (
        <div style={s.pageWrap}>
          <div style={s.pageTitle}>🍽️ AI Diet Plan Generator</div>
          <p style={{ color: muted, fontSize: 13, marginBottom: 16 }}>Fill in your details and get a personalized 7-day Indian diet plan powered by AI!</p>

          <div style={s.card}>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Age</label>
                <input style={s.formInput} value={dietForm.age} onChange={e => setDietForm({ ...dietForm, age: e.target.value })} placeholder="e.g. 24" />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Weight (kg)</label>
                <input style={s.formInput} value={dietForm.weight} onChange={e => setDietForm({ ...dietForm, weight: e.target.value })} placeholder="e.g. 60" />
              </div>
            </div>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Goal</label>
                <select style={s.formSelect} value={dietForm.goal} onChange={e => setDietForm({ ...dietForm, goal: e.target.value })}>
                  <option value="weight loss">Weight Loss</option>
                  <option value="weight gain">Weight Gain</option>
                  <option value="muscle building">Muscle Building</option>
                  <option value="maintain weight">Maintain Weight</option>
                  <option value="improve immunity">Improve Immunity</option>
                  <option value="diabetes management">Diabetes Management</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Diet Type</label>
                <select style={s.formSelect} value={dietForm.veg} onChange={e => setDietForm({ ...dietForm, veg: e.target.value })}>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="eggetarian">Eggetarian</option>
                </select>
              </div>
            </div>
            <button style={{ ...s.calcBtn, opacity: dietLoading ? 0.7 : 1 }} onClick={generateDietPlan} disabled={dietLoading}>
              {dietLoading ? t.generating : t.generateDietPlan}
            </button>
          </div>

          {dietPlan && (
            <div style={{ ...s.card, marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: green }}>🥗 Your 7-Day Diet Plan</div>
                <button style={s.iconBtn("#2563EB")} onClick={() => {
                  const blob = new Blob([dietPlan], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url; a.download = "diet_plan.txt"; a.click();
                }}>📄 Download</button>
              </div>
              <pre style={{ fontSize: 13, lineHeight: 1.8, color: text, whiteSpace: "pre-wrap" }}>{dietPlan}</pre>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB: PROFILE
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === "profile" && (
        <div style={s.pageWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={s.pageTitle}>👤 My Profile</div>
            <button style={editingProfile ? { ...s.calcBtn, background: "#16A34A" } : s.calcBtn}
              onClick={() => setEditingProfile(!editingProfile)}>
              {editingProfile ? "✅ Save Profile" : "✏️ Edit Profile"}
            </button>
          </div>

          {/* Profile card */}
          <div style={{ ...s.card, display: "flex", gap: 20, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: greenLight, border: `3px solid ${green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>
              👤
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: green }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: muted, marginTop: 3 }}>Age {profile.age} · Blood Group {profile.bloodGroup}</div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>🎯 Goal: {profile.goal}</div>
            </div>
          </div>

          {/* Edit fields */}
          <div style={s.card}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Personal Information</div>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Full Name</label>
                <input style={s.formInput} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} disabled={!editingProfile} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Age</label>
                <input style={s.formInput} value={profile.age} onChange={e => setProfile({ ...profile, age: e.target.value })} disabled={!editingProfile} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Blood Group</label>
                <select style={s.formSelect} value={profile.bloodGroup} onChange={e => setProfile({ ...profile, bloodGroup: e.target.value })} disabled={!editingProfile}>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg2 => <option key={bg2}>{bg2}</option>)}
                </select>
              </div>
            </div>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Height (cm)</label>
                <input style={s.formInput} value={profile.height} onChange={e => setProfile({ ...profile, height: e.target.value })} disabled={!editingProfile} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Weight (kg)</label>
                <input style={s.formInput} value={profile.weight} onChange={e => setProfile({ ...profile, weight: e.target.value })} disabled={!editingProfile} />
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Health Goal</label>
              <input style={s.formInput} value={profile.goal} onChange={e => setProfile({ ...profile, goal: e.target.value })} disabled={!editingProfile} placeholder="e.g. Lose 5kg in 3 months" />
            </div>
            <div style={{ ...s.formGroup, marginTop: 8 }}>
              <label style={s.label}>Allergies / Medical Conditions</label>
              <input style={s.formInput} value={profile.allergies} onChange={e => setProfile({ ...profile, allergies: e.target.value })} disabled={!editingProfile} placeholder="e.g. Penicillin allergy, Diabetes" />
            </div>
          </div>

          {/* Health summary */}
          <div style={{ ...s.card, marginTop: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📊 Health Summary</div>
            <div style={s.grid}>
              {[
                ["BMI", profile.weight && profile.height ? ((parseFloat(profile.weight)/Math.pow(parseFloat(profile.height)/100,2)).toFixed(1)) : "—", "#16A34A"],
                ["Water Today", `${waterCount}/8 glasses`, waterCount >= 8 ? "#16A34A" : "#D97706"],
                ["Medications", `${meds.length} active`, "#3B82F6"],
                ["Mood Today", todayMood ? ["😢","😔","😐","😊","😄"][todayMood-1] : "Not logged", "#7C3AED"],
              ].map(([l, v, c]) => (
                <div key={l} style={s.metricCard}>
                  <div style={{ fontSize: 11, color: muted, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <p style={{ textAlign: "center", fontSize: 11, color: muted, padding: "16px 0" }}>
        ⚠️ MediAssist is for informational purposes only. Always consult a qualified doctor for medical advice.
      </p>
    </div>
  );
}