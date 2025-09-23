import React from "react";
import Eatster from "../HeaderItems/Eatster.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faPinterestP,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-white px-6 md:px-16 py-10 text-[#3d4152] text-sm font-[Segoe UI]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 font-bold">
        <p>
          For better experience, <strong>download the Eatster app now</strong>
        </p>
        <div className="flex items-center mt-4 md:mt-0">
          <img
            src="https://i.ibb.co/QCJfJ1k/google-play.png"
            alt="Google Play"
            className="h-10 ml-2"
          />
          <img
            src="https://i.ibb.co/yPr08YY/app-store.png"
            alt="App Store"
            className="h-10 ml-2"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-6">
        <div className="min-w-[150px]">
          <img src={Eatster} alt="logo" className="w-28 mb-2" />
          <p>© 2025 Eatster Limited</p>
        </div>

        <div className="min-w-[150px]">
          <h4 className="text-base font-bold mb-2">Company</h4>
          <ul className="space-y-1 text-[#686b78]">
            <li>About Us</li>
            <li>Eatster Corporate</li>
            <li>Careers</li>
            <li>Team</li>
            <li>Eatster One</li>
            <li>Eatster Instamart</li>
            <li>Eatster Dineout</li>
            <li>Eatster Genie</li>
            <li>Minis</li>
            <li>Pyng</li>
          </ul>
        </div>

        <div className="min-w-[150px]">
          <h4 className="text-base font-bold mb-2">Contact us</h4>
          <ul className="space-y-1 text-[#686b78]">
            <li>Help & Support</li>
            <li>Partner with us</li>
            <li>Ride with us</li>
          </ul>
        </div>

        <div className="min-w-[150px]">
          <h4 className="text-base font-bold mb-2">Available in:</h4>
          <ul className="space-y-1 text-[#686b78]">
            <li>Tamilnadu</li>
            <li>
              <select className="px-2 py-1 border border-gray-300 rounded">
                <option>679 cities</option>
              </select>
            </li>
          </ul>
        </div>

        <div className="min-w-[150px]">
          <h4 className="text-base font-bold mb-2">Life at Eatster</h4>
          <ul className="space-y-1 text-[#686b78]">
            <li>Explore with Eatster</li>
            <li>Eatster News</li>
            <li>Snackables</li>
          </ul>
        </div>

        <div className="min-w-[150px]">
          <h4 className="text-base font-bold mb-2">Legal</h4>
          <ul className="space-y-1 text-[#686b78]">
            <li>Terms & Conditions</li>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Investor Relations</li>
          </ul>
        </div>

        <div className="min-w-[150px]">
          <h4 className="text-base font-bold mb-2">Social Links</h4>
          <div className="flex gap-4 text-lg mt-2">
            <FontAwesomeIcon icon={faInstagram} />
            <FontAwesomeIcon icon={faFacebookF} />
            <FontAwesomeIcon icon={faPinterestP} />
            <FontAwesomeIcon icon={faTwitter} />

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
