"use client";
import { useState } from "react"; // Import useState
import Image from "next/image";
import { FiX } from "react-icons/fi"; // Import close icon

export default function CoachProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  // Correct paths to images
  const images = [
    "/images/balkishan_profile.jpeg", // Correct image path from public folder
    "/images/jayashree.jpg",  // Correct image path from public folder
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
    <div className="px-6 py-12 bg-gray-100">
      <h2 className="text-3xl font-semibold text-center mb-8">Founders Profile</h2>

      {/* Coach Profile Images */}
      <div className="flex justify-center space-x-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="w-1/2 sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 flex-shrink-0"
          >
            <Image
              src={image}
              alt={`Coach ${index + 1}`}
              width={400} // Fixed width
              height={400} // Fixed height
              className="object-cover rounded-lg cursor-pointer"
              onClick={() => openModal(image)} // Trigger modal open
            />
          </div>
        ))}
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
              width={800}
              height={600}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
