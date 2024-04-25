import React, { useEffect } from "react";
import "./mobileMenu.scss";
import { Link } from "react-router-dom";

import { useLocation } from "react-router-dom";
const MobileMenu = ({ isActive, setIsActive }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    setIsActive(false);
  }, [pathname]);

  return (
    <div
      className={`overlay ${isActive ? "show" : ""}`}
      onClick={(e) => {
        setIsActive(false);
      }}
    >
      <div
        className={`fullscreenmenu ${isActive ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          <li>
            <Link to="/person-of-interest">Person of Interest</Link>
          </li>

          <li>
            <Link to="/news">News</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/partners">partners</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
