"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  GraduationCap,
  Users,
  Globe,
  ArrowRight,
  Search,
  UserCheck,
} from "lucide-react";

export default function Hero() {
  const router = useRouter();

 const features = [
  {
    icon: GraduationCap,
    title: "Certified Chess Programs",
    description:
      "Receive official certification upon course completion at Azroute.",
  },
  {
    icon: Users,
    title: "Learn from Expert Coaches",
    description:
      "Train under experienced and professional chess coaches.",
  },
  {
    icon: Globe,
    title: "AI-Powered Learning",
    description:
      "Improve faster with AI-based analysis and structured training.",
  },
  {
    icon: ArrowRight, // you can change icon if needed
    title: "Structured Curriculum",
    description:
      "Structured curriculum with periodic progress review.",
  },
];


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#60A5FA] text-white">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-2/3 h-2/3 bg-sky-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-6 py-20 mx-auto">

        {/* ✅ TITLE (SMALL SIZE + ANIMATION) */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-semibold tracking-tight mb-5 bg-gradient-to-r from-[#60A5FA] to-[#93C5FD] text-transparent bg-clip-text"
          >
            Your Child’s Chess Journey Starts Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="text-base md:text-lg text-blue-100"
          >
            India’s most interactive live chess academy with expert coaches +
            AI-powered training.
          </motion.p>
        </div>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="flex flex-col sm:flex-row gap-14 justify-center mb-20"
        >
          {/* Live Classes */}
          <div className="flex flex-col items-center gap-2">
            <Search className="h-7 w-7 text-blue-200 hover:scale-110 transition-all duration-300" />
            <p className="text-blue-100 text-sm">Looking for classes?</p>
            <Button
              
              size="lg"
              className="h-14 px-8 text-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl shadow-lg transform transition-transform duration-300"
            >
              Join Screening Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Coach */}
          <div className="flex flex-col items-center gap-2">
            <UserCheck className="h-7 w-7 text-blue-200 hover:scale-110 transition-all duration-300" />
            <p className="text-blue-100 text-sm">Are you a coach?</p>
           <Button
  onClick={() => router.push("/auth/teacher/signup")} // Update to match the correct URL path
  size="lg"
  variant="outline"
  className="h-14 px-8 text-lg bg-white text-[#1E3A8A] border border-blue-200 hover:bg-blue-50 rounded-xl shadow-lg transform transition-transform duration-300"
>
  Teach on Azroute
  <ArrowRight className="ml-2 h-5 w-5" />
</Button>

          </div>
        </motion.div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#F0F9FF] border border-[#BFDBFE] shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="p-4 rounded-full bg-blue-100 mb-6">
                  <Icon className="h-8 w-8 text-blue-600 hover:scale-110 transition-all duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
