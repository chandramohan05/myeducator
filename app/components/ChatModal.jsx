"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function ChatModal({ onClose }) {
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your Azroute AI Chess Coach. How can I help you today? 😊♟️",
    },
  ]);

  const [input, setInput] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [goalsVisible, setGoalsVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [courses, setCourses] = useState([]);

  const [regPayload, setRegPayload] = useState({
    role: "student",
    name: "",
    dob: "",
    email: "",
    phone: "",
    place: "",
    class_type: "",
    course: "",
    level: "",
    password: "",
  });

  const listRef = useRef();

  // Auto-scroll when messages change
  useEffect(() => {
    listRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [messages, isTyping, showRegister, showLogin]);

  // Load courses
  useEffect(() => {
    async function loadCourses() {
      try {
        const r = await fetch("/api/courses");
        const j = await r.json();
        if (j.success && Array.isArray(j.courses)) setCourses(j.courses);
      } catch (err) {
        console.error("Course load error:", err);
      }
    }
    loadCourses();
  }, []);

  // Send message on Enter (no shift)
  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setGoalsVisible(false);

    try {
      setIsTyping(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      const reply = data.assistant?.content || "No response";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      setIsTyping(false);

      if (/register|sign up|enroll|details/i.test(reply)) {
        setShowRegister(true);
      }
    } catch (err) {
      setIsTyping(false);
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong. Please try again." }]);
      console.error("chat error", err);
    }
  }

  // Registration: call /api/register then try NextAuth signIn
  async function submitRegistration(e) {
    e.preventDefault();

    if (!regPayload.name || !regPayload.email || !regPayload.password) {
      setMessages((m) => [...m, { role: "assistant", content: "Please provide name, email and password." }]);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regPayload),
      });
      const data = await res.json();

      if (!data.success) {
        setMessages((m) => [...m, { role: "assistant", content: "Registration failed: " + (data.error || "Unknown") }]);
        return;
      }

      // Attempt NextAuth credentials sign-in automatically
      const signin = await signIn("credentials", {
        redirect: false,
        email: regPayload.email,
        password: regPayload.password,
        role: regPayload.role, // optional - pass if your authorize uses it
      });

      if (signin?.ok) {
        setMessages((m) => [...m, { role: "assistant", content: "Registered and logged in — redirecting..." }]);
        setTimeout(() => {
          onClose?.();
          if (regPayload.role === "student") router.push("/dashboard/student/courses");
          else router.push("/dashboard/teacher");
        }, 600);
        return;
      }

      // If auto sign-in fails, show login form prefilled
      setShowSuccessAnim(true);
      setTimeout(() => {
        setShowSuccessAnim(false);
        setShowRegister(false);
        setShowLogin(true);
        setMessages((m) => [...m, { role: "assistant", content: "Registration saved. Please login to continue." }]);
      }, 900);
    } catch (err) {
      console.error("register error", err);
      setMessages((m) => [...m, { role: "assistant", content: "Server error during registration. Try again later." }]);
    }
  }

  // Login using NextAuth credentials
  async function submitLogin(e) {
    e.preventDefault();

    if (!regPayload.email || !regPayload.password) {
      setMessages((m) => [...m, { role: "assistant", content: "Please provide email and password." }]);
      return;
    }

    try {
      const signin = await signIn("credentials", {
        redirect: false,
        email: regPayload.email,
        password: regPayload.password,
        role: regPayload.role,
      });

      if (signin?.ok) {
        setMessages((m) => [...m, { role: "assistant", content: "Login successful — redirecting..." }]);
        setShowLogin(false);
        setTimeout(() => {
          onClose?.();
          if (regPayload.role === "student") router.push("/dashboard/student/courses");
          else router.push("/dashboard/teacher");
        }, 500);
        return;
      }

      setMessages((m) => [...m, { role: "assistant", content: "Invalid credentials. Please try again." }]);
    } catch (err) {
      console.error("login error", err);
      setMessages((m) => [...m, { role: "assistant", content: "Login error, please try later." }]);
    }
  }

  // Enroll course (update student_list by email)
  async function enrollCourse(courseId, title) {
    if (!regPayload.email) {
      setMessages((m) => [...m, { role: "assistant", content: "Please register or login first to enroll." }]);
      return;
    }
    try {
      const r = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, email: regPayload.email }),
      });
      const j = await r.json();
      if (j.success) {
        setMessages((m) => [...m, { role: "assistant", content: `You are enrolled in "${title}" 🎉` }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: "Enrollment failed: " + (j.error || "Unknown") }]);
      }
    } catch (err) {
      console.error("enroll error", err);
      setMessages((m) => [...m, { role: "assistant", content: "Enrollment failed. Try again later." }]);
    }
  }

  // Quick goal button handler
  function handleGoal(goal) {
    setMessages((m) => [...m, { role: "user", content: `My goal: ${goal}` }]);
    setGoalsVisible(false);
  }

  return (
    <div className="fixed right-6 bottom-24 z-[9998]">
      <div className="bg-white w-80 sm:w-96 h-[520px] rounded-2xl shadow-2xl flex flex-col border overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white/10 rounded-full">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white">
                <circle cx="12" cy="12" r="10" opacity="0.15" />
                <circle cx="9" cy="10" r="1.4" fill="white" />
                <circle cx="15" cy="10" r="1.4" fill="white" />
                <path d="M8 15c2 1 6 1 8 0" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="font-semibold">Azroute AI Coach</h2>
          </div>

          <button onClick={onClose} className="text-white text-xl hover:opacity-80">×</button>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 p-4 overflow-auto bg-gray-50 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div className={`px-3 py-2 max-w-[80%] rounded-xl shadow-sm text-sm ${msg.role === "assistant" ? "bg-white border" : "bg-blue-600 text-white"}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border px-3 py-2 rounded-xl shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          )}

          {/* Success pop */}
          {showSuccessAnim && (
            <div className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg animate-[pop_0.4s_ease-out_forwards]">✓</div>
            </div>
          )}
        </div>

        {/* Goals */}
        {goalsVisible && !showRegister && !showLogin && (
          <div className="p-2 border-t bg-white flex gap-2 overflow-x-auto">
            {["Beginner", "Tactics", "Openings", "Endgames", "Competition"].map((g) => (
              <button key={g} onClick={() => handleGoal(g)} className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200">{g}</button>
            ))}
          </div>
        )}

        {/* Register */}
        {showRegister && (
          <form onSubmit={submitRegistration} className="p-3 space-y-2 border-t bg-white overflow-auto">
            <select className="border p-2 w-full rounded" value={regPayload.role} onChange={(e) => setRegPayload({ ...regPayload, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="coach">Coach</option>
            </select>

            <input className="border p-2 w-full rounded" placeholder="Full Name" required value={regPayload.name} onChange={(e) => setRegPayload({ ...regPayload, name: e.target.value })} />

            {regPayload.role === "student" && (
              <input type="date" className="border p-2 w-full rounded" value={regPayload.dob} onChange={(e) => setRegPayload({ ...regPayload, dob: e.target.value })} />
            )}

            <input className="border p-2 w-full rounded" placeholder="Email" type="email" required value={regPayload.email} onChange={(e) => setRegPayload({ ...regPayload, email: e.target.value })} />

            <input className="border p-2 w-full rounded" placeholder="Phone" value={regPayload.phone} onChange={(e) => setRegPayload({ ...regPayload, phone: e.target.value })} />

            <input className="border p-2 w-full rounded" placeholder="Place / City" value={regPayload.place} onChange={(e) => setRegPayload({ ...regPayload, place: e.target.value })} />

            {regPayload.role === "student" && (
              <>
                <select className="border p-2 w-full rounded" value={regPayload.class_type} onChange={(e) => setRegPayload({ ...regPayload, class_type: e.target.value })}>
                  <option value="">Select Class Type</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                </select>

                <input className="border p-2 w-full rounded" placeholder="Course Name (Optional)" value={regPayload.course} onChange={(e) => setRegPayload({ ...regPayload, course: e.target.value })} />

                <input className="border p-2 w-full rounded" placeholder="Level (Beginner / Intermediate / Advanced)" value={regPayload.level} onChange={(e) => setRegPayload({ ...regPayload, level: e.target.value })} />
              </>
            )}

            {regPayload.role === "coach" && (
              <input className="border p-2 w-full rounded" placeholder="Specialty (Openings, Endgames, Tactics)" value={regPayload.course} onChange={(e) => setRegPayload({ ...regPayload, course: e.target.value })} />
            )}

            <input className="border p-2 w-full rounded" placeholder="Password" type="password" required value={regPayload.password} onChange={(e) => setRegPayload({ ...regPayload, password: e.target.value })} />

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700">Register</button>
          </form>
        )}

        {/* Login */}
        {showLogin && (
          <form onSubmit={submitLogin} className="p-3 border-t bg-white space-y-2">
            <input className="border p-2 w-full rounded" placeholder="Email" type="email" required value={regPayload.email} onChange={(e) => setRegPayload({ ...regPayload, email: e.target.value })} />
            <input className="border p-2 w-full rounded" placeholder="Password" type="password" required value={regPayload.password} onChange={(e) => setRegPayload({ ...regPayload, password: e.target.value })} />

            <div className="flex gap-2">
              <button type="submit" className="flex-1 w-full bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700">Login</button>
              <button type="button" onClick={() => { onClose?.(); router.push("/login"); }} className="px-3 py-2 rounded-lg border bg-white">Open login page</button>
            </div>
          </form>
        )}

        {/* Input bar */}
        {!showRegister && !showLogin && (
          <div className="p-3 border-t bg-white">
            {courses.length > 0 && (
              <div className="flex gap-2 mb-2 overflow-x-auto">
                {courses.map((c) => (
                  <button key={c.id} onClick={() => enrollCourse(c.id, c.title)} className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 whitespace-nowrap">{c.title}</button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <textarea rows={1} placeholder="Type a message…" className="flex-1 border rounded-lg p-2 resize-none" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} />
              <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">➤</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
