import React from 'react';

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">Song Wu</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/salads">Salads</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/drinks">Drinks</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/soups">Soups</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/appetizers">Appetizers</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/noodles">Noodles</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
