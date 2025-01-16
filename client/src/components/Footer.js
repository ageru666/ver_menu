import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 text-center py-1 mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm md:text-base">
          &copy; 2025 Song Wu. All rights reserved.
        </p>
        <p className="mt-2 text-sm md:text-base">
          Visit us in Kyiv or call us:{' '}
          <a href="tel:+380123456789" className="text-blue-400 hover:underline">
            +38 012 345 6789
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
