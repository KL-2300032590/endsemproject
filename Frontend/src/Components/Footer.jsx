import React from "react";
import logo from "../assets/logo.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-saint-carell">VIRTUAL EVENT</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Join us in celebrating the vibrant spirit of cultural arts through
              mesmerizing performances and enriching educational experiences at
              KL University.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white/90">
                Navigation
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-all duration-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/events"
                    className="text-gray-400 hover:text-white transition-all duration-300"
                  >
                    Events
                  </a>
                </li>
                <li>
                  <a
                    href="/team"
                    className="text-gray-400 hover:text-white transition-all duration-300"
                  >
                    Team
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white/90">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <MdEmail className="text-xl" />
                  <span>virtualevent@kluniversity.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <MdPhone className="text-xl" />
                  <span>+91 9505993133</span>
                </li>
                <li className="flex items-center gap-2">
                  <MdLocationOn className="text-xl" />
                  <span>KL University, Vijayawada</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white/90">
                Social Media
              </h3>
              <div className="flex flex-col space-y-3">
                <a
                  href="https://www.youtube.com/@KLUniversityLive"
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <FaYoutube className="text-xl" />
                  <span>Youtube</span>
                </a>
                <a
                  href="https://www.instagram.com/klvirtualevent/"
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <FaInstagram className="text-xl" />
                  <span>Instagram</span>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <FaTwitter className="text-xl" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Virtual Event Festival, KL University.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
