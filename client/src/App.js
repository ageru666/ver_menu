import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import DrinksPage from './pages/DrinksPage';
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';
import PrivateRoute from './utils/PrivateRoute';
import CheckoutPage from './pages/CheckoutPage';
import UserProfilePage from './pages/UserProfilePage';
import SearchPage from './pages/SearchPage';
import PromotionsPage from './pages/PromotionsPage';
import ArticlesPage from './pages/ArticlesPage';
import ContactsPage from './pages/ContactsPage';
import AdminFoodsPage from './pages/AdminFoodsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminReservationsPage from './pages/AdminReservationsPage';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute roleRequired="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
             <Route
             path="/admin/foods"
             element={
            <PrivateRoute roleRequired="admin">
             <AdminFoodsPage />
             </PrivateRoute>
            }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute roleRequired="admin">
                  <AdminUsersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <PrivateRoute roleRequired="admin">
                  <AdminOrdersPage />
                </PrivateRoute>
              }
            />
             <Route
              path="/admin/reservations"
              element={
                <PrivateRoute roleRequired="admin">
                  <AdminReservationsPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfilePage />
                </PrivateRoute>
              }
            />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/salads"
              element={<MenuPage apiEndpoint="/api/dishes/salads" title="Салати" />}
            />
            <Route
              path="/drinks"
              element={<DrinksPage />}
            />
            <Route
              path="/soups"
              element={<MenuPage apiEndpoint="/api/dishes/soups" title="Супи" />}
            />
            <Route
              path="/appetizers"
              element={<MenuPage apiEndpoint="/api/dishes/appetizers" title="Закуски" />}
            />
           <Route
              path="/noodles"
              element={<MenuPage apiEndpoint="/api/dishes/noodles" title="Локшина" />} 
              />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
