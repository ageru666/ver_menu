import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import DrinksPage from './pages/DrinksPage';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/salads"
              element={<MenuPage apiEndpoint="/api/salads" title="Salads" />}
            />
            <Route
              path="/drinks"
              element={<DrinksPage />}
            />
            <Route
              path="/soups"
              element={<MenuPage apiEndpoint="/api/soups" title="Soups" />}
            />
            <Route
              path="/appetizers"
              element={<MenuPage apiEndpoint="/api/appetizers" title="Appetizers" />}
            />
            <Route
              path="/noodles"
              element={<MenuPage apiEndpoint="/api/noodles" title="Noodles" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
