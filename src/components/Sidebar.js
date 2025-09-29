import React from "react";
import useTheme from "../hooks/useTheme";

const Sidebar = ({
  onNavigate,
  activeRoute,
  isMobileOpen,
  isDesktopCollapsed,
  onToggleMobile,
  onToggleDesktop,
}) => {
  const [theme, toggleTheme] = useTheme();

  const handleNavClick = (e, target) => {
    e.preventDefault(); // Prevent default anchor tag behavior
    onNavigate(target);
    if (isMobileOpen) {
      onToggleMobile();
    }
  };

  return (
    <aside
      id="sidebar"
      className={`bg-gray-800 text-white fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out z-30 flex flex-col
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${isDesktopCollapsed ? "md:w-20" : "md:w-64"}
        md:translate-x-0`}
    >
      <div className="p-5 border-b border-gray-700 flex justify-between items-center">
        {!isDesktopCollapsed && (
          <div id="sidebar-header">
            <h1 className="text-2xl font-bold text-indigo-400">
              Current Affairs
            </h1>
            <p className="text-xs text-gray-400 mt-1">Main Menu</p>
          </div>
        )}
        <button
          id="sidebar-collapse-toggle"
          className="hidden md:block text-2xl text-gray-400 hover:text-white"
          onClick={onToggleDesktop}
        >
          <i
            className={`fas ${
              isDesktopCollapsed ? "fa-chevron-right" : "fa-chevron-left"
            }`}
          ></i>
        </button>
      </div>

      <nav className={`flex-1 space-y-2 ${isDesktopCollapsed ? "p-2" : "p-4"}`}>
        <a
          href="#"
          id="nav-home"
          className={`nav-link ${isDesktopCollapsed && "justify-center"} ${
            activeRoute === "home" ? "bg-gray-700 text-white" : ""
          }`}
          onClick={(e) => handleNavClick(e, "home")}
        >
          <i className="fas fa-home w-6"></i>
          {!isDesktopCollapsed && <span className="ml-4">Home</span>}
        </a>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          id="theme-switcher"
          className="w-full flex items-center justify-center nav-button"
          onClick={toggleTheme}
        >
          <i
            className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"} mr-2`}
          ></i>
          {!isDesktopCollapsed && (
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
