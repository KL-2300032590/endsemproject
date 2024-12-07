import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";

const Team = () => {
  const teamMembers = [
    {
      name: "Pardhasaradhi Reddy",
      role: "Team Lead",
      linkedin: "https://www.linkedin.com/in/pardhasaradhi-reddy-a92a40315/",
      image: "/team/pardhu.png"
    },
    {
      name: "Snehith",
      role: "Team Lead",
      linkedin: "https://www.linkedin.com/in/pardhasaradhi-reddy-a92a40315/",
      image: "/team/lead.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-8 md:py-16 px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-purple-500">
        Our Team
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden group"
          >
            <a 
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative aspect-square overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FaLinkedin className="text-4xl text-blue-500" />
              </div>
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-6xl font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
            </a>
            <div className="p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-2">{member.name}</h3>
              <p className="text-gray-400">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Team;
