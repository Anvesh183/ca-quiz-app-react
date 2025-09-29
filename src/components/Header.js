import React from "react";

const Header = ({ onToggleSidebar }) => (
  <header className="md:hidden bg-gray-800 p-4 flex items-center justify-between">
    <button onClick={onToggleSidebar} className="text-white text-2xl">
      <i className="fas fa-bars"></i>
    </button>
    <h1 className="text-lg font-semibold text-indigo-400">Affairs Acumen</h1>
  </header>
);

export default Header;
