import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole'); 

  if (!token) return <Navigate to="/login" />;
  if (roleRequired && userRole !== roleRequired) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
