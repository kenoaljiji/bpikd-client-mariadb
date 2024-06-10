import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { localhost } from '../../config/config';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './personSortSearch.scss';
import { useAuthContext } from '../../context/auth/AuthState';
import { useSortedItemsContext } from '../../context/sortedItems/SortedItemsProvider';
import Loader from '../../components/loader/Loader';
import Alerts from '../Alerts';

// A simple reordering function
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const PersonSortSearch = () => {
  const { user } = useAuthContext();

  const [loading, setLoading] = useState();

  const initialPlaceholders = Array.from({ length: 4 }, (_, index) => ({
    id: `placeholder-${index}`,
    placeholder: true,
    text: `Select person ${index + 1}`,
    featured: '/assets/no-picture.png',
  }));

  const { sortedItems, getSortedItems, updateSortedItems } =
    useSortedItemsContext();

  useEffect(() => {
    getSortedItems();
  }, []);

  // Initial states

  const [searchTermFirstRow, setSearchTermFirstRow] = useState('');
  const [searchResultsFirstRow, setSearchResultsFirstRow] = useState([]);
  const [selectedFirstRow, setSelectedFirstRow] = useState(
    sortedItems?.firstRowItems
  );

  const [searchTermSecondRow, setSearchTermSecondRow] = useState('');
  const [searchResultsSecondRow, setSearchResultsSecondRow] = useState([]);

  const [selectedSecondRow, setSelectedSecondRow] = useState(
    sortedItems?.secondRowItems
  );

  const [errorFirstRow, setErrorFirstRow] = useState('');
  const [errorSecondRow, setErrorSecondRow] = useState('');

  // Odraditi debounce ovdje

  const handleSearch = async (term, setResults, row) => {
    if (term.length >= 3) {
      try {
        const response = await axios.get(
          `${localhost}/post/persons/find?searchQuery=${term}`
        );
        setResults(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          if (row === 'firstRow') {
            setErrorFirstRow('No results found for your search.');
            setSearchResultsFirstRow([]); // Clear previous results
          } else if (row === 'secondRow') {
            setErrorSecondRow('No results found for your search.');
            setSearchResultsSecondRow([]); // Clear previous results
          }
        }
      }
    } else {
      if (row === 'firstRow') {
        setErrorFirstRow('');
        setSearchResultsFirstRow([]);
      } else if (row === 'secondRow') {
        setErrorSecondRow('');
        setSearchResultsSecondRow([]);
      }
      // Set search results for the successful search
    }
  };

  function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedSearch = React.useMemo(() => debounce(handleSearch, 300), []);

  // Selection handlers
  const handleSelectFirstRow = (person) => {
    setSelectedFirstRow(person);
    setSearchTermFirstRow('');
  };

  const handleSelectSecondRow = (person) => {
    // First, check if the person is already in the selectedSecondRow
    const isPersonAlreadySelected = selectedSecondRow?.some(
      (item) => item.id === person.id
    );

    // If the person is already selected, exit the function to avoid adding them again
    if (isPersonAlreadySelected) {
      console.log('This person is already selected.');
      return;
    }

    // Clone the current state to ensure immutability
    let updatedRow = [...selectedSecondRow];

    // Find the index of the first placeholder
    const firstPlaceholderIndex = updatedRow.findIndex(
      (item) => item.placeholder
    );

    // If a placeholder exists, replace it with the selected person

    if (firstPlaceholderIndex !== -1) {
      updatedRow[firstPlaceholderIndex] = person;
    }

    // Update the state with the modified array
    setSelectedSecondRow(updatedRow);
    setSearchTermSecondRow('');
  };

  const removeSelectedSecondRow = (personId) => {
    let updatedRow = selectedSecondRow?.map((item, index) => {
      if (item.id === personId) {
        return {
          id: `placeholder-${index}`,
          placeholder: true,
          text: `Select person ${index + 1}`,
          featured: '/assets/no-picture.png',
        };
      }
      return item;
    });

    setSelectedSecondRow(updatedRow);
  };

  // Handler when drag ends
  const onDragEnd = (result) => {
    if (!result.destination) {
      console.log(result);
      return; // dropped outside the list
    }

    const items = reorder(
      selectedSecondRow,
      result.source.index,
      result.destination.index
    );

    setSelectedSecondRow(items);
  };

  const addUpdateSortedItems = async () => {
    const data = {
      firstRowItems: selectedFirstRow,
      secondRowItems: selectedSecondRow,
      userId: user.user.id,
      /*  id: sortedItems?.id, */
    };

    updateSortedItems(data, setLoading);
  };

  useEffect(() => {
    console.log(selectedFirstRow);
  }, [selectedFirstRow]);

  return (
    <div className='person-sort-search mb-5'>
      <div className='sort-search'>
        <div>
          {/* First Row Search and Selection */}
          <input
            type='text'
            placeholder='Search for the first row...'
            value={searchTermFirstRow}
            onChange={(e) => {
              setSearchTermFirstRow(e.target.value);
              debouncedSearch(
                e.target.value,
                setSearchResultsFirstRow,
                'firstRow'
              );
            }}
          />
          <div className='search-row-result'>
            {searchResultsFirstRow.length > 0 ? (
              searchResultsFirstRow?.map((person) => (
                <div
                  className='second-row-result'
                  key={person.id}
                  onClick={() => handleSelectFirstRow(person)}
                >
                  <div className='result-box'>
                    <img
                      src={person?.featured}
                      alt='featured'
                      style={{ width: 50, height: 50 }}
                    />
                    <div className='row-names'>
                      <span>
                        {person.firstName} {person.lastName}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className='second-row-result'
                style={{
                  width: '239px',
                  height: '150px',
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {errorFirstRow ? errorFirstRow : 'Search a person'}
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Second Row Search and Selection */}
          <input
            type='text'
            placeholder='Search for the second row...'
            value={searchTermSecondRow}
            onChange={(e) => {
              setSearchTermSecondRow(e.target.value);
              debouncedSearch(
                e.target.value,
                setSearchResultsSecondRow,
                'secondRow'
              );
            }}
          />
          <div className='search-row-result'>
            {searchResultsSecondRow.length > 0 ? (
              searchResultsSecondRow?.map((person) => (
                <div
                  key={person.id}
                  onClick={() => handleSelectSecondRow(person)}
                  className='second-row-result'
                >
                  <div className='result-box'>
                    <img
                      src={person.featured}
                      alt='featured'
                      style={{ width: 50, height: 50 }}
                    />
                    <div className='row-names'>
                      <span>
                        {person.firstName} {person.lastName}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className='second-row-result'
                style={{
                  width: '239px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {errorSecondRow ? errorSecondRow : 'Search a person'}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Display Selected Persons for     Second Row */}
      <div className='sort-result'>
        {' '}
        {/* Display Selected Person for First Row */}
        {selectedFirstRow && Object.keys(selectedFirstRow).length !== 0 ? (
          <div className='first-row'>
            <h5>Row One</h5>
            <div
              className='row-items'
              onClick={() => setSelectedFirstRow(null)}
            >
              <span className='delete-item'>X</span>
              <img
                src={selectedFirstRow?.featured}
                alt='selected'
                style={{
                  width: '150px',
                  height: '180px',
                  marginRight: '8px',
                  objectFit: 'cover',
                }}
              />
              <div className='row-names'>
                <span>
                  {selectedFirstRow.firstName} {selectedFirstRow.lastName}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className='first-row'>
            <h5>Row One</h5>
            <div>
              <div
                className='first-row-person'
                style={{
                  width: '150px',
                  height: '180px',
                  border: '1px solid #eee',
                }}
              >
                <span className='blank-text'>Select Person</span>
                <img
                  src='/assets/no-picture.png'
                  alt='no-pict'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div className='second-row mt-2'>
          <h5>Row Two</h5>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='droppable' direction='horizontal'>
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {selectedSecondRow &&
                    selectedSecondRow?.map((item, index) => (
                      <Draggable
                        key={item.id.toString()}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                            className='second-row droppable-container'
                          >
                            <div className='row-items'>
                              {item.placeholder ? (
                                <div
                                  style={{
                                    width: '150px',
                                    height: '180px',

                                    border: '1px solid #eee',
                                  }}
                                >
                                  <div>
                                    <img
                                      src={item.featured}
                                      alt=''
                                      className='blank-image'
                                    />
                                    <span className='blank-text'>
                                      {item.text}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div
                                    className='delete'
                                    onClick={() =>
                                      removeSelectedSecondRow(item.id)
                                    }
                                  >
                                    X
                                  </div>
                                  <img
                                    src={item.featured}
                                    alt='selected'
                                    style={{
                                      width: '150px',
                                      height: '180px',
                                      marginRight: '8px',
                                      objectFit: 'cover',
                                    }}
                                  />
                                  <div className='row-names'>
                                    <span>
                                      {item.firstName} {item.lastName}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <div className='container'>
        <div className='button-container px-2 my-3'>
          {/* <button type='button' className='me-2'>
            Preview
          </button> */}
          <button
            type='submit'
            className='btn btn-primary'
            onClick={addUpdateSortedItems}
          >
            Update
          </button>
        </div>
        {loading && (
          <div className='text-center'>
            <div className='mt-4 my-3'>
              <Loader />
            </div>
            <span class='mt-5 blink-text'>
              Please Wait....
              <span class='dots'></span>
            </span>
          </div>
        )}
        {!loading && <Alerts />}
      </div>
    </div>
  );
};

export default PersonSortSearch;
