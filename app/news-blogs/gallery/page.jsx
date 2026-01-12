"use client";

import Image from "next/image";

export default function GalleryPage() {
  const images = [
    "/gallery/gallery1.jpg",
    "/gallery/gallery2.jpg",
    "/gallery/gallery3.jpg",
    "/gallery/gallery4.jpg",
    "/gallery/gallery5.jpg",
    "/gallery/gallery6.jpg",
    
  ];

  return (
    <div className="bg-white min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-semibold mb-10 text-center">
          Gallery
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <Image
                src={src}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
