import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import "./style/header.scss";
import CustomSearch from "../components/CustomSearch";
import { useRouteContext } from "../context/route/RouteProvider";

const Header = ({ handleClick, isActive }) => {
  const { state } = useRouteContext();

  const { headersData } = state;

  const { routes, buttons } = headersData;
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const moveLeftOnActive = {
    left: isActive ? "10px" : "-6px",
  };

  return (
    <header
      className="p-3"
      style={{ borderBottom: pathname !== "/" && "1px solid #eee" }}
    >
      <div className="d-flex justify-content-between">
        <div className="col-sm d-flex">
          <div
            className={`hamburger-menu`}
            style={moveLeftOnActive}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <span className={`bar bar-top ${isActive ? "animate0" : ""}`} />
            <span className={`bar bar-middle ${isActive ? "hide" : ""}`} />
            <span className={`bar bar-bottom ${isActive ? "animate2" : ""}`} />
          </div>
          <Link to="/">
            <img
              src={"/assets/images/logo.png"}
              alt="Logo"
              className="d-inline-block align-top me-5 mt-1"
            />
          </Link>
          <Navbar />
        </div>

        {pathname !== "/" ? <CustomSearch type={"custom-search"} /> : null}

        <div className="row align-items-center justify-content-end">
          <div className="col-sm d-flex">
            <div className="cta-buttons d-flex">
              <button
                type="button"
                className="me-1 px-3"
                onClick={() => navigate(routes?.shop)}
              >
                {routes?.shop}
              </button>
              <button
                type="button"
                className="btn btn-danger me-1 px-2"
                onClick={() => navigate(buttons.button1)}
              >
                {/* Donat e*/}
                {buttons.button1}
              </button>
              <button
                type="button"
                className="btn btn-secondary me-1 px-2 btn-last"
                onClick={() => navigate(buttons.button2)}
              >
                {buttons.button2}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
