import React from 'react';
import MenuPage from './MenuPage';

const AppetizersPage = () => {
  return <MenuPage apiEndpoint="/api/appetizers" title="Закуски" />;
};

export default AppetizersPage;
