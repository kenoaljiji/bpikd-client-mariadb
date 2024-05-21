import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './searchResult.scss';
import moment from 'moment';
import axios from 'axios';
import { localhost } from '../../config/config';
import DOMPurify from 'dompurify';
import { slugify } from '../../utils/slugify';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import Loader from '../../components/loader/Loader';
import * as Yup from 'yup';

export function ContentComponent({ content }) {
  const [shortenedContent, setShortenedContent] = useState('');

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const textContent = doc.body.textContent || '';

    // Truncate the text content to the first sentence or up to a maximum character length.
    const maxCharacters = 250;
    let shortened = textContent.substr(0, maxCharacters).trim();
    const lastSpaceIndex = shortened.lastIndexOf(' ');

    // Try to avoid cutting words in half
    if (lastSpaceIndex > 0 && lastSpaceIndex < maxCharacters) {
      shortened = shortened.substr(0, lastSpaceIndex);
    }

    if (textContent.length > maxCharacters) {
      shortened += '...';
    }

    // Re-sanitize and set the shortened content.
    // This does not preserve HTML formatting since it might introduce complexity with unmatched tags.
    // If preserving HTML tags up to the truncation point is critical, a more sophisticated approach is needed.
    const sanitizedShortenedContent = DOMPurify.sanitize(shortened);
    setShortenedContent(sanitizedShortenedContent);
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: shortenedContent }} />;
}

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { getPostById } = useGlobalContext();

  const [results, setResults] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [loading, setLoading] = useState();

  const initialCategories = queryParams.getAll('categories');

  const [selectedCategories, setSelectedCategories] =
    useState(initialCategories);

  const navigate = useNavigate();

  // Function to remove a category

  const handleAddCategory = (category) => {
    const newCategories = [...formik.values.categories, category];
    formik.setFieldValue('categories', newCategories);
  };

  // Function to remove category
  // Function to remove category
  const handleRemoveCategory = (category) => {
    const filteredCategories = formik.values.categories.filter(
      (c) => c !== category
    );
    formik.setFieldValue('categories', filteredCategories);
    formik.submitForm();
  };

  useEffect(() => {}, [results, navigate, location]);

  // Extracting initial values from the query params or setting defaults
  const initialValues = {
    words: queryParams.get('words')
      ? decodeURIComponent(queryParams.get('words')).split(',').join(' ')
      : '',
    page: 1,
    phrase: queryParams.get('phrase') || '',
    anyWords: queryParams.get('anyWords') || '',
    excludeWords: queryParams.get('excludeWords') || '',
    createdStartDate: queryParams.get('createdStartDate') || '',
    createdEndDate: queryParams.get('createdEndDate') || '',
    releasedEndDate: queryParams.get('releasedEndDate') || '',
    releasedStartDate: queryParams.get('releasedStartDate') || '',
    includeExternalSources:
      queryParams.get('includeExternalSources') === 'true',
    categories: queryParams.get('categories')
      ? queryParams.get('categories').split(',')
      : '',
    sort: queryParams.get('sort') || 'relevance', // Default sort order
  };

  // Effect to submit the form on mount if query parameters exist
  /* useEffect(() => {
    if (!results.page) {
      formik.setFieldValue('categories', '');
    }
  }, [results]); */

  /*   useEffect(() => {
    if (
      initialCategories.includes('Person of Interest', 'News', 'Coming') &&
      results.data.length !== 0
    ) {
      console.log('Postoji');
    }
  }, [results]); */

  const handleSearch = async (data) => {
    try {
      const response = await axios.get(localhost + '/search', {
        data,
      });
    } catch (err) {}
  };

  const handleCategoryChange = (category) => {
    const newCategories = formik.values.categories.includes(category)
      ? formik.values.categories.filter((c) => c !== category)
      : [...formik.values.categories, category];
    formik.setFieldValue('categories', newCategories);
  };

  const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const handlePageChange = (newPage) => {
      onPageChange(newPage);
    };

    return (
      <ul className='pagination custom-pagination'>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <div
            style={{ color: '#428bca', cursor: 'pointer' }}
            className='page-link'
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label='Previous'
          >
            <span aria-hidden='true'>&laquo;</span>
            <span className='sr-only'>Previous</span>
          </div>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            style={{
              backgroundColor:
                currentPage === index + 1 ? '#428bca' : '#428bca',
              cursor: 'pointer',
            }}
          >
            <div
              className='page-link'
              href='#'
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </div>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? 'disabled' : ''
          }`}
        >
          <div
            className='page-link'
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label='Next'
            style={{ color: '#428bca', cursor: 'pointer' }}
          >
            <span aria-hidden='true'>&raquo;</span>
            <span className='sr-only'>Next</span>
          </div>
        </li>
      </ul>
    );
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      const filteredValues = {};
      Object.keys(values).forEach((key) => {
        if (values[key] && values[key] !== '') {
          if (key === 'anyWords' || key === 'excludeWords') {
            // Handle splitting by commas for 'anyWords' or 'excludeWords'
            filteredValues[key] = values[key]
              .split(',')
              .map((word) => word.trim())
              .filter((word) => word);
          } else if (key === 'words') {
            // Split 'searchTerm' by spaces to support multiple search terms
            filteredValues[key] = values[key]
              .split(' ')
              .map((word) => word.trim())
              .filter((word) => word.length > 0);
          } else if (key.endsWith('Date')) {
            // Format date fields
            filteredValues[key] = moment(values[key]).format('YYYY-MM-DD');
          } else {
            // Direct assignment for other fields
            filteredValues[key] = values[key];
          }
        }

        filteredValues.sort = values.sort;
      });

      const queryString = new URLSearchParams(filteredValues).toString();

      console.log(queryString);

      console.log(filteredValues);

      navigate(`/search?${queryString}`);

      try {
        setLoading(true);
        const response = await axios.post(localhost + '/search', {
          query: filteredValues,
        });

        setResults(response.data);
        console.log(response.data);
      } catch (err) {
        console.error('Search error:', err);
        // Optionally handle errors in UI, e.g., display error message
      }
      setLoading(false);
    },
  });

  const [searchDescription, setSearchDescription] = useState('');

  const resultsElementRef = useRef(null);

  /* useEffect(() => {
    if (location.state?.hasNavigatedBack) {
      if (resultsElementRef.current) {
        resultsElementRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }, [location]); */

  useEffect(() => {
    if (results?.data?.length > 0 && resultsElementRef.current) {
      setTimeout(() => {
        resultsElementRef.current.scrollIntoView({ behavior: 'auto' });
      }, 10);
    }
  }, [results]);

  // Effect to handle navigation and potentially trigger scroll
  /*  useEffect(() => {
    if (location.state?.fromBackNavigation) {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.state]); */

  useEffect(() => {
    formik.submitForm();
    setSelectedCategories(queryParams.getAll('categories'));
  }, [location.search]);

  function createSearchDescription(params) {
    let description = '';
    const words = params.get('words');
    const anyWords = params.get('anyWords');
    const excludeWords = params.get('excludeWords');
    const phrase = params.get('phrase');
    /*  const includeExternalSources = params.get('includeExternalSources'); */

    if (words) {
      description += `${words} `;
    }

    if (phrase) {
      description += `"${phrase}" `;
    }
    if (anyWords) {
      description += `[${anyWords.split(',').join(', ')}] `;
    }
    if (excludeWords) {
      description += `![${excludeWords.split(',').join(', ')}]`;
    }

    /*    if (includeExternalSources === 'true') {
      description += `, including external sources`;
    } */

    return description;
  }

  const categoryArray = ['Person of Interest', 'News', 'Coming'];

  const getNewsByIdAndTitle = async (id, title) => {
    const shortenedTitle = title.split(' ').slice(0, 5).join('-').toLowerCase();
    try {
      await getPostById(id);
      navigate(`/news/${shortenedTitle}`);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  const handleNavigation = async (result) => {
    if (result.source_table === 'works') {
      navigate(
        `/person/${slugify(`${result.id}`)}/${slugify(`${result.title}`)}`
      );
    } else if (result.source_table === 'persons') {
      navigate(`/person/${slugify(result.title)}`);
    } else if (result.source_table === 'news') {
      // Use the special function for news
      await getNewsByIdAndTitle(result.id, result.title);
    } else if (result.source_table === 'soon') {
      navigate(`/coming`);
    } else {
      navigate(`/${slugify(result.category)}`);
    }
  };

  return (
    <div className='search-result'>
      <div className='container'>
        <h2 className='mb-5'>Advanced Search</h2>
        <h3 className='text-secondary pb-2'>Words</h3>
      </div>

      <div className='container mt-3'>
        <form onSubmit={formik.handleSubmit}>
          <div className='row '>
            <div className='col-md-3'>
              <div className='form-group mt-2'>
                <label htmlFor='words'>
                  <strong>All</strong> these words
                </label>
              </div>
            </div>
            <div className='col-md-9'>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  id='words'
                  name='words'
                  onChange={formik.handleChange}
                  value={formik.values.words}
                />
                <span style={{ fontSize: '12px' }}>
                  You can use any of these search operators in this input field
                </span>
              </div>
            </div>
          </div>

          <div className='row mt-3 align-items-center'>
            <div className='col-md-3'>
              <div className='form-group'>
                <label htmlFor='phrase'>
                  This <strong>Exact</strong> phrase
                </label>
              </div>
            </div>
            <div className='col-md-9'>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  id='phrase'
                  name='phrase'
                  onChange={formik.handleChange}
                  value={formik.values.phrase}
                />
              </div>
            </div>
          </div>

          <div className='row mt-3 align-items-center'>
            <div className='col-md-3'>
              <div className='form-group'>
                <label htmlFor='anyWords'>
                  <strong>Any</strong> of these words
                </label>
              </div>
            </div>
            <div className='col-md-9'>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  id='anyWords'
                  name='anyWords'
                  onChange={formik.handleChange}
                  value={formik.values.anyWords}
                />
              </div>
            </div>
          </div>

          <div className='row mt-3 align-items-center'>
            <div className='col-md-3'>
              <div className='form-group'>
                <label htmlFor='excludeWords'>
                  <strong>Exclude</strong> these words
                </label>
              </div>
            </div>
            <div className='col-md-9'>
              <div className='form-group'>
                <input
                  type='text'
                  className='form-control'
                  id='excludeWords'
                  name='excludeWords'
                  onChange={formik.handleChange}
                  value={formik.values.excludeWords}
                />
              </div>
            </div>
          </div>

          <h3 className='text-secondary pt-5 pb-2'>Dates</h3>
          <div className='row mt-3 align-items-center'></div>

          <div className='row d-flex column align-items-center'>
            <div className='col-md-3'>
              <label htmlFor='createdDate'>Origin or created</label>
            </div>
            <div className='col-md-9'>
              <div className='created-grid'>
                <div>
                  <ReactDatePicker
                    selected={formik.values.createdStartDate}
                    onChange={(date) =>
                      formik.setFieldValue('createdStartDate', date)
                    }
                    id='createdStartDate'
                    name='createdStartDate'
                    className='form-control'
                    placeholderText='yyyy-mm-dd'
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                <label htmlFor='endDate' className='text-center'>
                  to
                </label>
                <div>
                  <ReactDatePicker
                    selected={formik.values.createdEndDate}
                    onChange={(date) =>
                      formik.setFieldValue('createdEndDate', date)
                    }
                    id='createdEndDate'
                    name='createdEndDate'
                    className='form-control'
                    placeholderText='yyyy-mm-dd'
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='row mt-3 d-flex column align-items-center'>
            <div className='col-md-3'>
              <label htmlFor='releasedStartDate'>Released by Bpikd</label>
            </div>
            <div className='col-md-9'>
              <div className='created-grid'>
                <div>
                  <ReactDatePicker
                    selected={formik.values.releasedStartDate}
                    onChange={(date) =>
                      formik.setFieldValue('releasedStartDate', date)
                    }
                    id='releasedStartDate'
                    name='releasedStartDate'
                    className='form-control'
                    placeholderText='yyyy-mm-dd'
                    style={{ cursor: 'pointer' }}
                  />
                </div>

                <label htmlFor='endDate' className='text-center'>
                  to
                </label>

                <div>
                  <ReactDatePicker
                    selected={formik.values.releasedEndDate}
                    onChange={(date) =>
                      formik.setFieldValue('releasedEndDate', date)
                    }
                    id='releasedEndDate'
                    name='releasedEndDate'
                    className='form-control'
                    placeholderText='yyyy/mm/dd'
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='row mt-3' style={{ marginBottom: '80px' }}>
            <div className='col-md-3'></div>
            <div className='col-md-9'>
              <div className='form-check mt-4'>
                <input
                  className='form-check-input mt-1'
                  type='checkbox'
                  id='flexCheckDefault'
                  name='includeExternalSources'
                  onChange={formik.handleChange}
                  checked={formik.values.includeExternalSources}
                />
                <label
                  className='form-check-label ms-1'
                  htmlFor='flexCheckDefault'
                >
                  Include external sources
                </label>
              </div>
              <p className='mt-1' style={{ fontSize: '12px' }}>
                Associated Twitter accounts, Snowden + Hammond Documents,
                Cryptome Documents, ICWatch, This Day in WikiLeaks Blog and
                WikiLeaks Press, WL Central
              </p>
              <button type='submit' className='btn btn-secondary'>
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* <div className='container'>
        {results?.data?.length === 0 &&
          formik.values.categories &&
          formik?.values.categories.map((category, index) => (
            <div key={index} className='categories'>
              <span>{category}</span>
              <div
                className='categories-x'
                onClick={() => handleRemoveCategory(category)}
              >
                X
              </div>
            </div>
          ))}
      </div>
 */}
      {results?.data?.length > 0 && (
        <div
          className='search-result-display'
          id='results'
          ref={resultsElementRef}
        >
          <div className='container'>
            <p
              style={{
                fontSize: '20px',
                marginTop: '40px',
                marginBottom: '40px',
              }}
            >
              Searching for : <strong>{searchDescription}</strong>
            </p>
          </div>

          <div className='container mt-4'>
            <div className='row'>
              <div className='col-md-3'>
                {results?.data?.length > 0 ? (
                  <div>
                    <div className='filter-data'>
                      <h5 className='mb-4'>
                        <strong>Filter results by leak</strong>
                      </h5>
                      {categoryArray.map((category, index) => (
                        <div className='form-check mt-3 ms-2' key={index}>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            id={category}
                            value={category}
                            onChange={() => handleCategoryChange(category)}
                            checked={formik.values.categories.includes(
                              category
                            )}
                          />
                          <label
                            className='form-check-label ms-2'
                            htmlFor={category}
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                      <button
                        type='button'
                        className='button-filter ms-2'
                        onClick={() => formik.submitForm()}
                      >
                        Apply filter
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '18px' }}>No filters available</p>
                )}
              </div>
              <div className='col-md-9 search-final-result'>
                {formik.values.categories &&
                  formik?.values.categories.map((category, index) => (
                    <div key={index} className='categories'>
                      <span>{category}</span>
                      <div
                        className='categories-x'
                        onClick={() => handleRemoveCategory(category)}
                      >
                        X
                      </div>
                    </div>
                  ))}

                <div className='form-group d-flex justify-content-between'>
                  <select
                    className='py-1 mb-4 px-1 border-0 mb-2'
                    style={{ width: '250px' }}
                    id='sortSelect'
                    name='sort'
                    value={formik.values.sort}
                    onChange={formik.handleChange}
                  >
                    <option value='relevance'>Relevance</option>
                    <option value='release_desc'>
                      Release Date (Newest First)
                    </option>
                    <option value='release_asc'>
                      Release Date (Oldest First)
                    </option>
                    <option value='document_desc'>
                      Document Date (Newest First)
                    </option>
                    <option value='document_asc'>
                      Document Date (Oldest First)
                    </option>
                  </select>
                  <div className='mt-2'>
                    Results: <strong>{results.totalResults}</strong>
                  </div>
                </div>
                {loading ? (
                  <div className='search-loading'>
                    <Loader />
                  </div>
                ) : (
                  results &&
                  results?.data?.map((result, index) => (
                    <div
                      key={result.id + ' d' + index + result.source_table}
                      className='row mb-2 bg-white py-3 m-0 '
                    >
                      <div className='col-md-8 px-4'>
                        <div
                          onClick={() => handleNavigation(result)}
                          style={{
                            cursor: 'pointer',
                            color: '#004a7a',
                            fontSize: '22px',
                          }}
                        >
                          <h4>{result.title}</h4>
                        </div>

                        <div
                          style={{
                            fontSize: '13px',
                            letterSpacing: '.2px',
                          }}
                        >
                          <ContentComponent content={result.content} />
                        </div>
                      </div>
                      <div className='col-md-4 text-center'>
                        {result.source_table === 'works' && (
                          <p style={{ fontWeight: 'bold' }}>{result.id}</p>
                        )}
                        {result.source_table === 'persons' && (
                          <p style={{ fontWeight: 'bold' }}>{result.title}</p>
                        )}

                        <img
                          src={'assets/images/default.png'}
                          alt='Result'
                          className='img-fluid my-2'
                        />
                        <div
                          className='d-flex justify-content-between w-75 m-auto'
                          style={{ fontSize: '12px' }}
                        >
                          <div>
                            <span className='d-block'>created:</span>
                            <span>
                              {moment(result.created_at).format('YYYY-MM-DD')}
                            </span>
                          </div>
                          <div className=''>
                            <span className='d-block'>Released:</span>
                            <span>
                              {moment(result.scheduledPublishTime).format(
                                'YYYY-MM-DD'
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {!loading && results !== 0 && (
                  <div className='mt-4'>
                    <Pagination
                      totalPages={results?.pages}
                      currentPage={formik.values.page}
                      onPageChange={(newPage) => {
                        // Update the state that controls the page, or perform a fetch operation here
                        console.log('Switch to page:', newPage);
                        formik.setFieldValue('page', newPage);
                        formik.submitForm();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
