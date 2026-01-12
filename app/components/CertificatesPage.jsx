// app/components/CertificatesPage.jsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { FiX, FiAward } from "react-icons/fi";

export default function CertificatesPage() {
  const [modalSrc, setModalSrc] = useState("");

  const certificates = [
     "/images/balkishan_profile.jpeg",
    "/images/jayashree.jpg",
    "/certificates/1.jpeg",
    "/certificates/2.jpeg",
    "/certificates/3.jpeg",
    "/certificates/4.jpeg",
    "/certificates/5.jpeg",
    "/certificates/6.jpeg",
    "/certificates/7.jpeg",
  
  ];

  return (
    <section className="px-3 md:px-6 py-12 w-full">
      <header className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold inline-flex items-center gap-3">
          <FiAward size={26} />  Students Certificates & Achievement Certificates
        </h2>
      </header>

      {/* Horizontal auto scroll */}
      <div className="overflow-hidden w-full">
        <div className="flex gap-6 animate-scroll py-4">
          {certificates.concat(certificates).map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => setModalSrc(src)}
              className="flex-shrink-0 w-[320px] h-[220px] bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition"
            >
            <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
  <div className="relative w-full h-full p-3">
    <Image
      src={src}
      alt={`Certificate ${i + 1}`}
      fill
      className="object-contain"
    />
  </div>
</div>

            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModalSrc("")}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalSrc("")}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100"
            >
              <FiX size={18} />
            </button>

            <div className="relative w-full h-[70vh] bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={modalSrc}
                alt="Certificate"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-scroll {
          display: flex;
          animation: scroll 12s linear infinite; /* 🔥 faster */
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
