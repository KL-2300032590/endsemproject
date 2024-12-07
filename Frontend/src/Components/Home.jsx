import React from "react";
import { motion } from "framer-motion";
import { useRef } from "react";
import poster2025 from "../assets/2025.jpg";
import poster2024 from "../assets/2024.jpg";
import poster2023 from "../assets/2023.jpg";

const Home = () => {
  const containerRef = useRef(null);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Welcome to <span className="text-purple-500">Virtual Event</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Experience the future of events with our cutting-edge virtual
              platform. Connect, engage, and celebrate from anywhere in the world.
            </motion.p>
          </div>
        </div>

        {/* Map Section */}
        <div className="py-16 px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            Find Us Here
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto rounded-2xl overflow-hidden border border-purple-500/20"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.6199592497847!2d80.62045731486546!3d16.441945088657577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0a2a7d81943%3A0x8ba5d78f65df94b8!2sK%20L%20University!5e0!3m2!1sen!2sin!4v1677834271952!5m2!1sen!2sin"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-300"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
