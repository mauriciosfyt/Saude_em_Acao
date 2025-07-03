import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Loja from '../pages/Loja';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Loja" element={<Loja />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
