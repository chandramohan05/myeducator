"use client";

import { useState } from "react";
import ChatModal from "./ChatModal";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-[9999] bg-blue-600 hover:bg-blue-700 
        text-white rounded-full w-16 h-16 shadow-2xl flex items-center justify-center 
        transition-all duration-200 hover:scale-110"
      >
        {/* Professional AI Chat Icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2C7 2 3 6 3 11c0 3 1.5 5.7 4 7.4V22l4-2 4 2v-3c2.5-1.7 4-4.4 4-7.4 0-5-4-9-9-9z" />
          <circle cx="9" cy="11" r="1.6" />
          <circle cx="15" cy="11" r="1.6" />
          <path d="M9 15c1.2 1 3.8 1 6 0" />
        </svg>
      </button>

      {open && <ChatModal onClose={() => setOpen(false)} />}
    </>
  );
}
