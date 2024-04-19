import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { localhost } from "../../config/config";
import { useAlertContext } from "../alert/AlertState";
import { useAuthContext } from "../auth/AuthState";

const SortedItemsContext = createContext();

export const useSortedItemsContext = () => useContext(SortedItemsContext);

export const SortedItemsProvider = ({ children }) => {
  const [sortedItems, setSortedItems] = useState({});
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { setAlert } = useAlertContext();

  /*   const updateSortedItems = (firstRow, secondRow) => {
    setSortedItems({ firstRow, secondRow });
  }; */

  const updateSortedItems = async (data) => {
    console.log(data);

    try {
      const response = await axios.put(`${localhost}/sort/data`, data);

      console.log(response);
      setSortedItems(response.data);

      setAlert("Sorted items successfully update", "success");
    } catch (error) {
      console.error(
        "Error saving search results:",
        error.response ? error.response.data : error.message
      );
      setAlert("Error saving sorted items", "danger");
    }
    setSuccess(false);
    setError(false);
  };

  const getSortedItems = async () => {
    /*   console.log(requestBody); */

    try {
      // Assuming the token is stored in state.user.token
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(`${localhost}/sort`, config);

      setSortedItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSortedItems();
  }, []);

  useEffect(() => {
    console.log(sortedItems);
  }, [sortedItems]);

  return (
    <SortedItemsContext.Provider
      value={{
        sortedItems,
        updateSortedItems,
        getSortedItems,
      }}
    >
      {children}
    </SortedItemsContext.Provider>
  );
};
