import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { localhost } from "../../config/config";
import { useAlertContext } from "../alert/AlertState";

const SortedItemsContext = createContext();

export const useSortedItemsContext = () => useContext(SortedItemsContext);

export const SortedItemsProvider = ({ children }) => {
  const initialPlaceholders = Array.from({ length: 4 }, (_, index) => ({
    id: `placeholder-${index}`,
    placeholder: true,
    text: `Select person ${index + 1}`,
  }));
  const [sortedItems, setSortedItems] = useState({
    firstRowItems: {},
    secondRowItems: initialPlaceholders,
  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { setAlert } = useAlertContext();

  /*   const updateSortedItems = (firstRow, secondRow) => {
    setSortedItems({ firstRow, secondRow });
  }; */

  const updateSortedItems = async (data) => {
    try {
      const response = await axios.put(`${localhost}/sort/data`, data);

      setSortedItems(response.data);
      getSortedItems();

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
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(`${localhost}/sort`, config);
      if (
        res.data &&
        res.data.secondRowItems &&
        res.data.secondRowItems.length === 0
      ) {
        // Set secondRowItems to initial placeholders if empty
        res.data.secondRowItems = initialPlaceholders;
      }
      // Update the state with either modified or received data
      setSortedItems(res.data);
    } catch (err) {
      console.error("Error fetching sorted items:", err);
      setAlert("Failed to fetch sorted items", "danger");
    }
  };

  useEffect(() => {
    getSortedItems();
  }, []);

  useEffect(() => {
    console.log(sortedItems);
  }, []);

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
