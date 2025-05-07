// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaUserCircle,
  FaShoppingCart,
  FaAngleDown,
  FaAngleUp,
  FaMugHot,
  FaCarrot,
  FaCookieBite,
  FaGlassWhiskey,
} from 'react-icons/fa';
import { FaBowlRice } from 'react-icons/fa6';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [categoriesHovered, setCategoriesHovered] = useState(false);
  const [profileTimeout, setProfileTimeout] = useState(null);

  const navigate = useNavigate();

  // Проверяем авторизацию каждые 500ms
  useEffect(() => {
    const authInterval = setInterval(() => {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(!!token);
      setUserRole(role);
    }, 500);
    return () => clearInterval(authInterval);
  }, []);

  // Обновляем количество в корзине каждые 500ms
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };
    updateCartCount();
    const cartInterval = setInterval(updateCartCount, 500);
    return () => clearInterval(cartInterval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setProfileOpen(false);
    navigate('/');
  };

  const categories = [
    { label: 'Локшина', icon: <FaBowlRice />,   to: '/noodles'    },
    { label: 'Супи',    icon: <FaMugHot />,     to: '/soups'      },
    { label: 'Салати',  icon: <FaCarrot />,     to: '/salads'     },
    { label: 'Закуски', icon: <FaCookieBite />, to: '/appetizers' },
    { label: 'Напої',   icon: <FaGlassWhiskey /> , to: '/drinks'  },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) setCatOpen(false);
  };
  const toggleCat = () => {
    setCatOpen(!catOpen);
    if (!catOpen) setMobileMenuOpen(false);
  };

  return (
    <header className="w-full">
      {/* Верхній хедер */}
      <div className="bg-gray-800 w-full">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="text-white text-2xl md:hidden" onClick={toggleMobileMenu}>
              ≡
            </button>
            <Link to="/" className="text-white font-serif text-3xl tracking-widest font-bold no-underline">
              Song Wu
            </Link>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center space-x-40">
            <Link to="/contacts"   className="text-gray-300 no-underline hover:text-white transition-colors">Контакти</Link>
            <Link to="/promotions" className="text-gray-300 no-underline hover:text-white transition-colors">Акції</Link>
            <Link to="/articles"   className="text-gray-300 no-underline hover:text-white transition-colors">Статті</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/search')}
              className="text-white text-xl hover:text-gray-200 transition-colors"
            >
              <FaSearch />
            </button>
            <div
              className="relative"
              onMouseEnter={() => {
                if (profileTimeout) clearTimeout(profileTimeout);
                setProfileOpen(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => setProfileOpen(false), 200);
                setProfileTimeout(timeout);
              }}
            >
              <button
                className="flex items-center justify-center text-white text-xl hover:text-gray-200 transition-colors"
                onClick={() => window.innerWidth < 768 && setProfileOpen(!profileOpen)}
              >
                <FaUserCircle />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-md py-2 z-50">
                  {!isLoggedIn ? (
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 no-underline" onClick={() => setProfileOpen(false)}>
                      Увійти/Реєстрація
                    </Link>
                  ) : (
                    <>
                      {userRole === 'admin' ? (
                        <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 no-underline" onClick={() => setProfileOpen(false)}>
                          Управління
                        </Link>
                      ) : (
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 no-underline" onClick={() => setProfileOpen(false)}>
                          Профіль
                        </Link>
                      )}
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Вийти
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <Link to="/cart" className="text-white text-xl hover:text-gray-200 transition-colors no-underline">
                <FaShoppingCart />
              </Link>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-700 px-4 py-2">
            <Link to="/contacts"   className="block text-gray-300 no-underline hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Контакти</Link>
            <Link to="/promotions" className="block text-gray-300 no-underline hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Акції</Link>
            <Link to="/articles"   className="block text-gray-300 no-underline hover:text-white py-1" onClick={() => setMobileMenuOpen(false)}>Статті</Link>
          </div>
        )}
      </div>

      {/* Нижній хедер (Categories Bar) */}
      <div className="bg-gray-700 text-gray-200 md:w-4/5 w-full mx-auto rounded-b py-1">
        <div className="md:hidden flex items-center justify-center">
          <h3 className="text-lg font-semibold mr-2">Категорія</h3>
          <button onClick={toggleCat} className="text-white text-xl">
            {catOpen ? <FaAngleUp /> : <FaAngleDown />}
          </button>
        </div>
        <div
          className={`${catOpen ? 'block' : 'hidden'} md:flex md:justify-between md:items-center px-4 py-1`}
          onMouseEnter={() => setCategoriesHovered(true)}
          onMouseLeave={() => setCategoriesHovered(false)}
        >
          {categories.map(cat => (
            <CategoryItem
              key={cat.label}
              cat={cat}
              onClickMobile={() => setCatOpen(false)}
              categoriesHovered={categoriesHovered}
            />
          ))}
        </div>
      </div>
    </header>
  );
};

const CategoryItem = ({ cat, onClickMobile, categoriesHovered }) => (
  <>
    <Link
      to={cat.to}
      onClick={onClickMobile}
      className="block md:hidden rounded-full bg-gray-800 hover:bg-gray-600 transition-colors text-white no-underline px-6 py-3 text-center mb-2"
    >
      <div className="flex flex-col items-center justify-center">
        <span className="text-2xl mb-1">{cat.icon}</span>
        <span className="text-base">{cat.label}</span>
      </div>
    </Link>
    <Link to={cat.to} className="hidden md:inline-block no-underline">
      <div className={`flex flex-col items-center transition-all duration-300 px-3 ${categoriesHovered ? 'h-[60px]' : 'h-[30px]'}`}>
        <div className={`overflow-hidden transition-all duration-300 flex items-center justify-center ${categoriesHovered ? 'h-[30px]' : 'h-0'}`}>
          <span className={`text-2xl transition-opacity duration-300 ${categoriesHovered ? 'opacity-100' : 'opacity-0'}`}>{cat.icon}</span>
        </div>
        <div className="flex items-center justify-center h-[30px]">
          <span className="text-lg">{cat.label}</span>
        </div>
      </div>
    </Link>
  </>
);

export default Header;
