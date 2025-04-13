import React from 'react';
import { Navigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Snaccdle from './Snaccdle';

const App: React.FC = () => (
  <Router>
    <div className="min-h-screen">
      <Routes>
        <Route path="/:year/:month/:song_index" element={<Snaccdle />} />
        <Route path="*" element={<Navigate to="2025/february/1" />} />
      </Routes>
    </div>
  </Router>
);

export default App;
