// Import statements
import React, { useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const PersonSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFirstRow, setSelectedFirstRow] = useState(null);
  const [selectedSecondRow, setSelectedSecondRow] = useState([]);

  // Function to handle search
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length >= 3) {
      try {
        const response = await axios.get(`/api/search?searchTerm=${term}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    }
  };

  // Function to add a person to the first or second row
  const handleSelect = (person, row) => {
    if (row === "first") {
      setSelectedFirstRow(person);
    } else if (row === "second" && selectedSecondRow.length < 4) {
      setSelectedSecondRow([...selectedSecondRow, person]);
    }
  };

  // Function to remove a person from a row
  const handleRemove = (index, row) => {
    if (row === "first") {
      setSelectedFirstRow(null);
    } else if (row === "second") {
      setSelectedSecondRow(selectedSecondRow.filter((_, i) => i !== index));
    }
  };

  // Function to handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(selectedSecondRow);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedSecondRow(items);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search persons..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {/* Display selected person for the first row */}
      <div>
        {selectedFirstRow && (
          <div>
            <img src={selectedFirstRow.featured} alt="Selected" />
            <button onClick={() => handleRemove(null, "first")}>X</button>
          </div>
        )}
      </div>
      {/* Search and select for the second row */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {selectedSecondRow.map((person, index) => (
                <Draggable
                  key={person.id}
                  draggableId={person.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <img src={person.featured} alt="Selected" />
                      <button onClick={() => handleRemove(index, "second")}>
                        X
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/* Display search results */}
      {searchResults.map((person) => (
        <div key={person.id} onClick={() => handleSelect(person, "second")}>
          <img src={person.featured} alt={person.name} />
        </div>
      ))}
    </div>
  );
};

export default PersonSearch;
