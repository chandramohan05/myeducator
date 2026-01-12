"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ===== REUSABLE SECTION ===== */
function Section({ title, text, image, reverse }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {!reverse && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
      )}

      <div className="relative w-full h-64 rounded-xl overflow-hidden shadow">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {reverse && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  const sliderRef = useRef(null);

  const experts = [
    {
      id: 1,
      name: "Vaibhav Singh Verma",
      role: "International FIDE rated chess player and trainer",
      image: "/images/experts/expert1.jpg",
    },
    {
      id: 2,
      name: "Karthiga A",
      role: "International FIDE rated chess player and trainer",
      image: "/images/experts/expert2.jpg",
    },
    {
      id: 3,
      name: "Vidya Shree",
      role: "Administrator and support service",
      image: "/images/experts/expert3.jpg",
    },
    {
      id: 4,
      name: "Jayashree P K",
      role: "Co-founder and mentor",
      image: "/images/experts/expert4.jpg",
    },
    {
      id: 5,
      name: "Balkishan A",
      role: "Co-founder and mentor",
      image: "/images/experts/expert5.jpg",
    },
    {
      id: 6,
      name: "Nithin Pal",
      role: "International FIDE rated chess player and trainer",
      image: "/images/experts/expert6.jpg",
    },
  ];

  const scroll = (dir) => {
    sliderRef.current.scrollBy({
      left: dir === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white">

      {/* ===== ABOUT CONTENT ===== */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="border rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At Azroute Chess Institute, our mission is to empower individuals
              through chess by sharpening minds, cultivating discipline, and
              developing strategic thinking for life.
            </p>
          </div>

          <div className="border rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              We envision a world where chess becomes a foundation for
              intellectual growth, confidence, resilience, and lifelong
              learning across all ages.
            </p>
          </div>
        </div>

        <Section
          title="Our Story"
          text="Azroute Chess Institute was born from a deep passion for the timeless game of chess. What started as a small group of learners has grown into a thriving community focused on mental sharpness and personal growth."
          image="/about/story.jpg"
        />

        <Section
          title="Our Philosophy"
          text="Chess is more than a game—it is a way of thinking. The focus, adaptability, and decision-making skills developed through chess extend far beyond the board."
          image="/about/philosophy.jpg"
          reverse
        />

        <Section
          title="Our Team"
          text="Our team of dedicated coaches and staff bring years of competitive and teaching experience."
          image="/about/team.jpg"
        />

        <Section
          title="Our Impact"
          text="Azroute Chess Institute has helped hundreds of students improve strategic thinking and confidence."
          image="/about/impact.jpg"
          reverse
        />

        <Section
          title="Join Us"
          text="Azroute Chess Institute is more than an academy—it’s a place where chess becomes part of your personal journey."
          image="/about/join.jpg"
        />
      </div>

      {/* ===== EXPERTS SLIDER (VIDEO STYLE – WHITE THEME) ===== */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-2xl font-semibold mb-12">
            Learn Chess from our Experts
          </h2>

          <div className="relative">

            {/* LEFT ARROW */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
            >
              <ChevronLeft />
            </button>

            {/* SLIDER */}
            <div
              ref={sliderRef}
              className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide px-4"
            >
              {experts.map((expert) => (
                <div
                  key={expert.id}
                  className="relative min-w-[280px] h-[380px] rounded-xl overflow-hidden shadow group"
                >
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover"
                  />

                  {/* HOVER OVERLAY (VIDEO STYLE) */}
                  <div className="absolute inset-0 bg-white/80 flex flex-col justify-end px-5 py-6 opacity-0 group-hover:opacity-100 transition">
                    <h3 className="font-semibold text-gray-900">
                      {expert.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {expert.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT ARROW */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
            >
              <ChevronRight />
            </button>

          </div>
        </div>
      </section>

      {/* FOOTER COMES FROM layout.jsx */}
    </div>
  );
}
