import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="text-white text-2xl mr-4 block lg:hidden focus:outline-none"
            aria-label="Toggle menu"
            onClick={toggleMenu}
          >
            ☰
          </button>
          <Link to="/" className="text-white text-2xl font-bold">
            Song Wu
          </Link>
        </div>

        <ul className="hidden lg:flex space-x-6">
          <li>
            <Link to="/" className="text-gray-300 hover:text-white transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/noodles" className="text-gray-300 hover:text-white transition">
              Noodles
            </Link>
          </li>
          <li>
            <Link to="/soups" className="text-gray-300 hover:text-white transition">
              Soups
            </Link>
          </li>
          <li>
            <Link to="/salads" className="text-gray-300 hover:text-white transition">
              Salads
            </Link>
          </li>
          <li>
            <Link to="/appetizers" className="text-gray-300 hover:text-white transition">
              Appetizers
            </Link>
          </li>
          <li>
            <Link to="/drinks" className="text-gray-300 hover:text-white transition">
              Drinks
            </Link>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          <Link to="/profile" className="text-white text-2xl focus:outline-none">
            <FaUserCircle />
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-gray-700">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link to="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/noodles" className="text-gray-300 hover:text-white transition">
                Noodles
              </Link>
            </li>
            <li>
              <Link to="/soups" className="text-gray-300 hover:text-white transition">
                Soups
              </Link>
            </li>
            <li>
              <Link to="/salads" className="text-gray-300 hover:text-white transition">
                Salads
              </Link>
            </li>
            <li>
              <Link to="/appetizers" className="text-gray-300 hover:text-white transition">
                Appetizers
              </Link>
            </li>
            <li>
              <Link to="/drinks" className="text-gray-300 hover:text-white transition">
                Drinks
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
