import "./App.css";
import Navbar from "./components";
import Header from "./containers";

import { createContext, useState, useEffect } from "react";

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

function App() {
  const [theme, setTheme] = useState("light-theme");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light-theme" ? "dark-theme" : "light-theme"));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={`App ${theme}`}>
          <Navbar />
          <Header />
        </div>
      </ThemeContext.Provider>
  );
}

export default App;
