import React from "react";
import useTheme from "../hooks/useTheme";

const Sidebar = ({
  user,
  onSignOut,
  onNavigate,
  activeRoute,
  isMobileOpen,
  isDesktopCollapsed,
  onToggleMobile,
  onToggleDesktop,
}) => {
  const [theme, toggleTheme] = useTheme();

  const handleNavClick = (e, target) => {
    e.preventDefault();
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
        {/* ... (no changes to the header section) */}
        {!isDesktopCollapsed && (
          <div id="sidebar-header">
            <h1 className="text-2xl font-bold text-indigo-400">
              Affairs Acumen
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
        {/* --- CHANGE 1: Renamed "Home" to "Current Affairs" --- */}
        <a
          href="#"
          id="nav-ca"
          className={`nav-link ${isDesktopCollapsed && "justify-center"} ${
            activeRoute === "currentAffairs" ? "bg-gray-700 text-white" : ""
          }`}
          onClick={(e) => handleNavClick(e, "currentAffairs")}
        >
          <i className="fas fa-globe-asia w-6"></i>
          {!isDesktopCollapsed && <span className="ml-4">Current Affairs</span>}
        </a>
        {/* --- CHANGE 2: Added "Computer Awareness" link --- */}
        <a
          href="#"
          id="nav-ca"
          className={`nav-link ${isDesktopCollapsed && "justify-center"} ${
            activeRoute === "computerAwareness" ? "bg-gray-700 text-white" : ""
          }`}
          onClick={(e) => handleNavClick(e, "computerAwareness")}
        >
          <i className="fas fa-laptop-code w-6"></i>
          {!isDesktopCollapsed && (
            <span className="ml-4">Computer Awareness</span>
          )}
        </a>
        <a
          href="#"
          id="nav-bookmarks"
          className={`nav-link ${isDesktopCollapsed && "justify-center"} ${
            activeRoute === "bookmarks" ? "bg-gray-700 text-white" : ""
          }`}
          onClick={(e) => handleNavClick(e, "bookmarks")}
        >
          <i className="fas fa-bookmark w-6"></i>
          {!isDesktopCollapsed && <span className="ml-4">Bookmarks</span>}
        </a>
        <a
          href="#"
          id="nav-profile"
          className={`nav-link ${isDesktopCollapsed && "justify-center"} ${
            activeRoute === "profile" ? "bg-gray-700 text-white" : ""
          }`}
          onClick={(e) => handleNavClick(e, "profile")}
        >
          <i className="fas fa-user-circle w-6"></i>
          {!isDesktopCollapsed && <span className="ml-4">Profile</span>}
        </a>
      </nav>

      <div className={`p-4 border-t border-gray-700`}>
        {/* ... (no changes to the bottom section) */}
        {user && !isDesktopCollapsed && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-400">Signed in as</p>
            <p className="font-bold text-white truncate">{user.email}</p>
          </div>
        )}
        <button
          id="sign-out-button"
          className="w-full flex items-center justify-center nav-button bg-red-600 hover:bg-red-700 mb-4"
          onClick={onSignOut}
        >
          <i className={`fas fa-sign-out-alt mr-2`}></i>
          {!isDesktopCollapsed && <span>Sign Out</span>}
        </button>
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
