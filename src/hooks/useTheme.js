import { useState, useEffect } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
    document.body.className = storedTheme === "light" ? "light-mode" : "";
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "light" ? "light-mode" : "";
  };

  return [theme, toggleTheme];
};

export default useTheme;
