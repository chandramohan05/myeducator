'use client';

import React from "react";

const STAGES = [
  {
    id: 1,
    title: "Rookie",
    rating: "New | Rating: 0",
    who: "Absolute beginners with no prior knowledge of chess.",
    focus: "Introduction to chess basics: pieces, board setup, rules.",
    image: "/images/stages/rookie.png",
  },
  {
    id: 2,
    title: "Dabbler",
    rating: "Basic | Rating: 0",
    who: "Players who know how to play but want to improve basics.",
    focus: "Basic opening principles and piece development.",
    image: "/images/stages/dabbler.png",
  },
  {
    id: 3,
    title: "Beginner-1",
    rating: "Rating: 0–1400",
    who: "Players aiming to improve consistency and get initial rating.",
    focus: "Opening theory: Italian, Ruy Lopez, Sicilian.",
    image: "/images/stages/beginner1.png",
  },
  {
    id: 4,
    title: "Beginner-2",
    rating: "Rating: 1400–1500",
    who: "Players developing structured plans.",
    focus: "Opening traps, middlegame ideas, initiative.",
    image: "/images/stages/beginner2.png",
  },
  {
    id: 5,
    title: "Competent",
    rating: "Rating: 1500–1700",
    who: "Players ready for competitive play.",
    focus: "Pawn structures, attacking plans, deeper strategy.",
    image: "/images/stages/competent.png",
  },
  {
    id: 6,
    title: "Intermediate",
    rating: "Rating: 1700–2000",
    who: "Serious tournament players.",
    focus: "Tournament preparation and advanced middlegame strategy.",
    image: "/images/stages/intermediate.png",
  },
  {
    id: 7,
    title: "Advanced",
    rating: "Rating: 2000+",
    who: "High-level competitive players.",
    focus: "Endgame mastery and advanced positional play.",
    image: "/images/stages/advanced.png",
  },
];

// ======================= STAGE SECTION =======================
function StageSection({ stage, reverse }) {
  return (
    <section className="py-20 border-b border-gray-200">
      <div
        className={`max-w-6xl mx-auto px-6 flex flex-col md:flex-row ${
          reverse ? "md:flex-row-reverse" : ""
        } items-center gap-16`}
      >
        {/* TEXT */}
        <div className="md:w-1/2 text-gray-900">
          <h2 className="text-3xl font-bold mb-4">
            {stage.id}. {stage.title}
            <span className="text-gray-500 font-medium">
              {" "}({stage.rating})
            </span>
          </h2>

          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            <strong>Who it’s for:</strong>
            <br />
            {stage.who}
          </p>

          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            <strong>Program Focus:</strong>
            <br />
            {stage.focus}
          </p>
        </div>

        {/* IMAGE */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={stage.image}
            alt={stage.title}
            className="w-64 object-contain"
          />
        </div>
      </div>
    </section>
  );
}

// ======================= PAGE =======================
export default function ExplorePage() {
  return (
    <main className="bg-white min-h-screen">
      {/* TOP CIRCLE IMAGE */}
      <section className="py-24 text-center border-b border-gray-200">
        <img
          src="/images/stages/stages-circle.png"
          alt="Program Stages"
          className="mx-auto max-w-4xl"
        />
      </section>

      {/* STAGE SECTIONS */}
      {STAGES.map((stage, index) => (
        <StageSection
          key={stage.id}
          stage={stage}
          reverse={index % 2 !== 0}
        />
      ))}
    </main>
  );
}
