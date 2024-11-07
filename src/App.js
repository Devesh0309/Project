import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Employee from './pages/employee';
import Assessment from './pages/assessment';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/assessment" element={<Assessment />} />
      </Routes>
    </Router>
  );
};

export default App;
