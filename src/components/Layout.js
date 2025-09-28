import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children, onNavigate, activeRoute }) => {
  // <-- Accept activeRoute
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setDesktopSidebarCollapsed] =
    useState(false);

  useEffect(() => {
    const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    setDesktopSidebarCollapsed(isCollapsed);
  }, []);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const toggleDesktopSidebar = () => {
    localStorage.setItem("sidebarCollapsed", !isDesktopSidebarCollapsed);
    setDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
  };

  const mainContentPadding = isDesktopSidebarCollapsed
    ? "md:pl-20"
    : "md:pl-64";

  return (
    <div className="antialiased">
      <Sidebar
        onNavigate={onNavigate}
        activeRoute={activeRoute} // <-- Pass activeRoute to Sidebar
        isMobileOpen={isMobileSidebarOpen}
        isDesktopCollapsed={isDesktopSidebarCollapsed}
        onToggleMobile={toggleMobileSidebar}
        onToggleDesktop={toggleDesktopSidebar}
      />
      <div
        id="main-content"
        className={`transition-all duration-300 ease-in-out ${mainContentPadding}`}
      >
        <Header onToggleSidebar={toggleMobileSidebar} />
        <main className="overflow-y-auto p-4 md:p-6 lg:p-8 min-h-screen">
          <div id="app-container" className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      {isMobileSidebarOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;
