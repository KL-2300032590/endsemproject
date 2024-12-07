import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import poster1 from "../assets/2023.jpg";
import poster2 from "../assets/2024.jpg";
import poster3 from "../assets/2025.jpg";

const Gallery = () => {
  const [selectedEvent, setSelectedEvent] = useState("natayaka");
  const [selectedImage, setSelectedImage] = useState(null);

  const events = {
    natayaka: [
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
    ],
    chitrakala: [
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
    ],
    nritya: [
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
    ],
    raaga: [
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
    ],
    CineCarnival: [
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
    ],
    sahithya: [
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
    ],
    vastrashala: [
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
      { image: poster1 },
      { image: poster2 },
      { image: poster3 },
    ],
  };

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-20">
        {" "}
        {/* Added pt-20 for more top padding */}
        <motion.h1
          className="text-6xl md:text-7xl text-center font-playfair bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-20" /* Changed font and increased bottom margin */
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Gallery
        </motion.h1>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(events).map((eventName, index) => (
            <motion.button
              key={eventName}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-all relative
                ${
                  selectedEvent === eventName
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                    : "bg-purple-900/30 text-purple-300 hover:bg-purple-800/40"
                }
                before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full 
                before:border-2 before:border-purple-500 before:rounded-full before:opacity-0 
                hover:before:opacity-100 before:transition-all before:duration-300 before:scale-110
                hover:before:scale-100`}
              onClick={() => setSelectedEvent(eventName)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {eventName.replace(/([A-Z])/g, " $1").trim()}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEvent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            {[0, 1, 2, 3].map((rowIndex) => {
              const items = events[selectedEvent].slice(
                rowIndex * 3,
                (rowIndex + 1) * 3
              );

              return (
                <motion.div
                  key={rowIndex}
                  className="grid grid-cols-12 gap-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                >
                  {rowIndex % 2 === 0 ? (
                    <>
                      <motion.div
                        className="col-span-8 aspect-video bg-gradient-to-br from-purple-900/30 to-gray-900 rounded-2xl overflow-hidden relative group cursor-pointer"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)",
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedImage(items[0]?.image)}
                      >
                        {items[0]?.image && (
                          <img
                            src={items[0].image}
                            alt="Event"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </motion.div>
                      <motion.div
                        className="col-span-4 aspect-square bg-gradient-to-br from-purple-900/30 to-gray-900 rounded-2xl overflow-hidden relative group cursor-pointer"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)",
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedImage(items[1]?.image)}
                      >
                        {items[1]?.image && (
                          <img
                            src={items[1].image}
                            alt="Event"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="col-span-4 aspect-square bg-gradient-to-br from-purple-900/30 to-gray-900 rounded-2xl overflow-hidden relative group cursor-pointer"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)",
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedImage(items[0]?.image)}
                      >
                        {items[0]?.image && (
                          <img
                            src={items[0].image}
                            alt="Event"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </motion.div>
                      <motion.div
                        className="col-span-8 aspect-video bg-gradient-to-br from-purple-900/30 to-gray-900 rounded-2xl overflow-hidden relative group cursor-pointer"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)",
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setSelectedImage(items[1]?.image)}
                      >
                        {items[1]?.image && (
                          <img
                            src={items[1].image}
                            alt="Event"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </motion.div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                className="relative max-w-5xl w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Full size"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 text-white  rounded-full p-2 hover:scale-150  transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;
