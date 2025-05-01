import React, { useState } from 'react';
import { FaPhone, FaRegClock, FaAngleUp } from 'react-icons/fa';

const Footer = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="
        container mx-auto px-4 py-1
        grid grid-cols-1 gap-4 
        md:grid-cols-3
        md:justify-items-start
      ">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h3 className="text-3xl font-extrabold text-white font-serif tracking-widest mb-2">
            Song Wu
          </h3>
          <p className="text-gray-500 text-sm">
            All rights reserved by Song Wu 2023–2024
          </p>
        </div>

        <div className="flex flex-col items-center text-center md:items-start md:text-left md:border-l md:border-gray-700 md:pl-4">
          <div className="flex items-center justify-center md:justify-start mb-2">
            <h4 className="text-white font-semibold text-lg">
              Навігація
            </h4>
            <button
              className="md:hidden text-white ml-2"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation links"
            >
              <FaAngleUp
                className={`${navOpen ? '' : 'rotate-180'} transition-transform`}
              />
            </button>
          </div>

          <ul 
            className={`
              flex flex-col space-y-1 text-left
              ${navOpen ? 'block' : 'hidden'}
              md:block
            `}
          >
            <li>
              <a href="/promotions" className="no-underline hover:text-white">
                Акції
              </a>
            </li>
            <li>
              <a href="/articles" className="no-underline hover:text-white">
                Статті
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center text-center md:items-start md:text-left md:border-l md:border-gray-700 md:pl-4">
          <h4 className="text-white font-semibold text-lg mb-2">Контакти</h4>
          <div className="flex items-center mb-1">
            <FaPhone className="text-green-400 mr-2" />
            <span>(098) 222-51-51</span>
          </div>
          <div className="flex items-center">
            <FaRegClock className="text-green-400 mr-2" />
            <span>10:30–22:00</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
