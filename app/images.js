"use client";
import { useState } from 'react';  // Import useState
import Image from 'next/image';
import { FiX, FiAward } from 'react-icons/fi';  // Import close and achievement icons

export default function ImagePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const images = [
    '/images/1.jpeg',
    '/images/2.jpeg',
    '/images/3.jpeg',
    '/images/4.jpeg',
    '/images/5.jpeg',
    '/images/6.jpeg',
    '/images/7.jpeg',
    '/images/8.jpeg',
    '/images/9.jpeg',
    '/images/10.jpeg',
    '/images/11.jpeg',
    '/images/12.jpeg',
    '/images/13.jpeg',
    '/images/14.jpeg',
    '/images/15.jpeg',
    '/images/16.jpeg',
    '/images/17.jpeg',
  ];

  // Open the modal with the clicked image
  const openModal = (image) => {
    setCurrentImage(image);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="px-6 py-12">
      <h2 className="text-4xl font-semibold text-center mb-8 text-gray-800 flex items-center justify-center gap-3">
        <FiAward size={28} /> Student's Achievements
      </h2>

      {/* Image Gallery */}
      <div className="overflow-hidden">
        <div className="flex space-x-4 animate-scroll">
          {images.map((image, index) => (
            <div key={index} className="w-64 h-64 flex-shrink-0">
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                width={256} // Fixed width
                height={256} // Fixed height
                className="object-cover rounded-lg h-full w-full shadow-xl transform hover:scale-105 transition-transform duration-300"
                onClick={() => openModal(image)} // Trigger modal open
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal} // Close the modal when clicked outside the image
        >
          <div
            className="relative max-w-3xl max-h-3xl p-4 bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal when clicked inside
          >
            {/* Close Icon Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-transparent text-black p-2 rounded-full hover:bg-gray-300"
            >
              <FiX size={24} /> {/* Close icon */}
            </button>
            <Image
              src={currentImage}
              alt="Modal Image"
              width={600}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
