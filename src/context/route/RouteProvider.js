import React, { createContext, useContext, useEffect, useReducer } from "react";
import { routeReducer } from "./routeReducer";
import { useAlertContext } from "../alert/AlertState";
import axios from "axios";
import { localhost } from "../../config/config";
import { useAuthContext } from "../auth/AuthState";

const RouteContext = createContext();

export const useRouteContext = () => useContext(RouteContext);

const initialState = {
  headersData: {
    routes: {
      person: "Person of Interest",
      news: "News",
      about: "About",
      partners: "Partners",
      shop: "Shop",
      soon: "Soon",
    },
    buttons: {
      button1: "Donate",
      button2: "Submit",
    },
    logoImgPath: "",
  },
  loading: false,
};

export const RouteProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [state, dispatch] = useReducer(routeReducer, initialState);
  const { setAlert, alerts } = useAlertContext();

  const changeHeaderAndRoutes = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("routes", JSON.stringify(values.routes));
    formData.append("buttons", JSON.stringify(values.buttons));
    if (values.logoImgPath) {
      formData.append("logoImg", values.logoImgPath, values.logoImgPath.name);
    }

    /*  for (let [key, value] of formData.entries()) {
      console.log(key, value);
    } */

    try {
      const res = await axios.post(
        `${localhost}/header/updateHeader`,
        formData,
        {
          headers: {
            Authorization: user.token, // Assuming 'user.token' is your auth token
          },
        }
      );
      /*  dispatch({
        type: "UPDATE_ROUTE_PATHS",
        payload: res.data,
      }); */
      loadHeaderConfig();
      setAlert("Header updated successfully", "success");
      console.log("Server response:", res.data);
    } catch (error) {
      console.error("Error updating header:", error);
      setAlert("Error updating header", "danger");
    }
  };

  const loadHeaderConfig = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await axios.get(`${localhost}/header/getHeader`, {
        headers: { Authorization: user.token },
      });

      // Parse JSON strings to objects
      const headerConfig = {
        ...res.data,
        routes: JSON.parse(res.data.routes),
        buttons: JSON.parse(res.data.buttons),
      };

      console.log(headerConfig);

      dispatch({
        type: "GET_HEADER_CONFIG",
        payload: headerConfig,
      });

      console.log("Processed Header Data:", headerConfig);
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : "Failed to load header configuration",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    loadHeaderConfig();
  }, []);

  return (
    <RouteContext.Provider
      value={{ state, dispatch, changeHeaderAndRoutes, loadHeaderConfig }}
    >
      {children}
    </RouteContext.Provider>
  );
};
