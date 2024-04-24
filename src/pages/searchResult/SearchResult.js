import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './searchResult.scss';

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const navigate = useNavigate();

  // Extracting initial values from the query params or setting defaults
  const initialValues = {
    words: queryParams.get('words') || '',
    phrase: queryParams.get('phrase') || '',
    anyWords: queryParams.get('anyWords') || '',
    excludeWords: queryParams.get('excludeWords') || '',
    createdStartDate: queryParams.get('createdStartDate') || '',
    createdEndDate: queryParams.get('createdEndDate') || '',
    releasedEndDate: queryParams.get('releasedEndDate') || '',
    releasedStartDate: queryParams.get('releasedStartDate') || '',
    includeExternalSources:
      queryParams.get('includeExternalSources') === 'true' ? true : false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      // Filtering and submitting values
      const filteredValues = {};
      Object.keys(values).forEach((key) => {
        if (values[key] && values[key] !== '') {
          if (key === 'anyWords' || key === 'excludeWords') {
            filteredValues[key] = values[key]
              .split(',')
              .map((word) => word.trim())
              .filter((word) => word);
          } else {
            filteredValues[key] = values[key];
          }
        }
      });

      const queryString = new URLSearchParams(filteredValues).toString();
      navigate(`/search?${queryString}`);
    },
  });

  const [searchDescription, setSearchDescription] = useState('');

  useEffect(() => {
    setSearchDescription(createSearchDescription(queryParams));
  }, [location.search]); // Update description when search parameters change

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

  return (
    <div className='py-5 search-result'>
      <div className='container'>
        <h2 className='mb-5'>Advanced Search</h2>
        <h3 className='text-secondary pb-2'>Words</h3>
      </div>

      <div className='container mt-3'>
        <form onSubmit={formik.handleSubmit}>
          <div className='row '>
            <div className='col-md-3'>
              <div className='form-group mt-2'>
                <label htmlFor='words'>All these words</label>
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
                <label htmlFor='phrase'>This Exact phrase</label>
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
                <label htmlFor='anyWords'>Any of these words</label>
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
                <label htmlFor='excludeWords'>Exclude these words</label>
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

          <h3 className='text-secondary pt-5 pb-2'>Words</h3>
          <div className='row mt-3 align-items-center'>
            <div className='col-md-6 ps-0'>
              <div className='form-group'>
                <div className='container'>
                  <div className='row ml-0 align-items-center'>
                    <div className='col-md-6'>
                      <label htmlFor='createdDate'>Origin or created</label>
                    </div>
                    <div className='col-md-6'>
                      {/*   <input
                        type="date"
                        className="form-control"
                        id="createdStartDate"
                        name="createdStartDate"
                        onChange={formik.handleChange}
                        value={formik.values.createdStartDate}
                      /> */}
                      <ReactDatePicker
                        selected={formik.values.createdStartDate}
                        onChange={(date) =>
                          formik.setFieldValue('createdStartDate', date)
                        }
                        id='createdStartDate'
                        name='createdStartDate'
                        className='form-control'
                        placeholderText='yyyy/mm/dd'
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='container'>
                <div className='row ml-0 align-items-center'>
                  <div className='col-md-2'>
                    <label htmlFor='endDate'>to</label>
                  </div>
                  <div className='col-md-6'>
                    <ReactDatePicker
                      selected={formik.values.createdEndDate}
                      onChange={(date) =>
                        formik.setFieldValue('createdEndDate', date)
                      }
                      id='createdEndDate'
                      name='createdEndDate'
                      className='form-control'
                      placeholderText='yyyy/mm/dd'
                      style={{ cursor: 'pointer' }}
                    />
                    {/*    <input
                      type='date'
                      className='form-control'
                      id='createdEndDate'
                      name='createdEndDate'
                      onChange={formik.handleChange}
                      value={formik.values.createdEndDate}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row mt-3 align-items-center'>
            <div className='col-md-6 ps-0'>
              <div className='form-group'>
                <div className='container'>
                  <div className='row ml-0 align-items-center'>
                    <div className='col-md-6'>
                      <label htmlFor='releasedStartDate'>
                        Released by Bpikd
                      </label>
                    </div>
                    <div className='col-md-6'>
                      {/*  <input
                        type='date'
                        className='form-control'
                        id='releasedStartDate'
                        name='releasedStartDate'
                        onChange={formik.handleChange}
                        value={formik.values.releasedStartDate}
                      /> */}
                      <ReactDatePicker
                        selected={formik.values.releasedStartDate}
                        onChange={(date) =>
                          formik.setFieldValue('releasedStartDate', date)
                        }
                        id='releasedStartDate'
                        name='releasedStartDate'
                        className='form-control'
                        placeholderText='yyyy/mm/dd'
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='container'>
                <div className='row ml-0 align-items-center'>
                  <div className='col-md-2'>
                    <label htmlFor='endDate'>to</label>
                  </div>
                  <div className='col-md-6'>
                    {/* <input
                      type='date'
                      className='form-control'
                      id='releasedEndDate'
                      name='releasedEndDate'
                      onChange={formik.handleChange}
                      value={formik.values.releasedEndDate}
                    /> */}
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
          </div>

          <div className='row mt-3'>
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
      <div className='search-result-finall bg-gray text-white'>
        <div className='container'>
          <p>
            Search for : <strong>{searchDescription}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
