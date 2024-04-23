import React from "react";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import "./searchResult.scss";

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  const formik = useFormik({
    initialValues: {
      words: query || "",
      phrase: "",
      anyWords: "",
      excludeWords: "",
      createdStartDate: "",
      createdEndDate: "",
      releasedEndDate: "",
      releasedStartDate: "",

      includeExternalSources: false, // Assuming you want to handle the checkbox with Formik as well
    },
    onSubmit: (values) => {
      console.log(values);
      // Here you can handle your form submission to server or any other logic
    },
  });

  return (
    <div className="py-5 search-result">
      <div className="container">
        <h2 className="mb-5">Advanced Search</h2>
        <h3 className="text-secondary pb-2">Words</h3>
      </div>

      <div className="container mt-3">
        <form onSubmit={formik.handleSubmit}>
          <div className="row ">
            <div className="col-md-3">
              <div className="form-group mt-2">
                <label htmlFor="words">All these words</label>
              </div>
            </div>
            <div className="col-md-9">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="words"
                  name="words"
                  onChange={formik.handleChange}
                  value={formik.values.words}
                />
                <span style={{ fontSize: "12px" }}>
                  You can use any of these search operators in this input field
                </span>
              </div>
            </div>
          </div>

          <div className="row mt-3 align-items-center">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="phrase">This Exact phrase</label>
              </div>
            </div>
            <div className="col-md-9">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="phrase"
                  name="phrase"
                  onChange={formik.handleChange}
                  value={formik.values.phrase}
                />
              </div>
            </div>
          </div>

          <div className="row mt-3 align-items-center">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="anyWords">Any of these words</label>
              </div>
            </div>
            <div className="col-md-9">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="anyWords"
                  name="anyWords"
                  onChange={formik.handleChange}
                  value={formik.values.anyWords}
                />
              </div>
            </div>
          </div>

          <div className="row mt-3 align-items-center">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="excludeWords">Exclude these words</label>
              </div>
            </div>
            <div className="col-md-9">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="excludeWords"
                  name="excludeWords"
                  onChange={formik.handleChange}
                  value={formik.values.excludeWords}
                />
              </div>
            </div>
          </div>

          <h3 className="text-secondary pt-5 pb-2">Words</h3>
          <div className="row mt-3 align-items-center">
            <div className="col-md-6 ps-0">
              <div className="form-group">
                <div className="container">
                  <div className="row ml-0 align-items-center">
                    <div className="col-md-6">
                      <label htmlFor="createdDate">Origin or created</label>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        id="createdStartDate"
                        name="createdStartDate"
                        onChange={formik.handleChange}
                        value={formik.values.createdStartDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="container">
                <div className="row ml-0 align-items-center">
                  <div className="col-md-2">
                    <label htmlFor="endDate">to</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control"
                      id="createdEndDate"
                      name="createdEndDate"
                      onChange={formik.handleChange}
                      value={formik.values.createdEndDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3 align-items-center">
            <div className="col-md-6 ps-0">
              <div className="form-group">
                <div className="container">
                  <div className="row ml-0 align-items-center">
                    <div className="col-md-6">
                      <label htmlFor="releasedStartDate">
                        Released by Bpikd
                      </label>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        id="releasedStartDate"
                        name="releasedStartDate"
                        onChange={formik.handleChange}
                        value={formik.values.releasedStartDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="container">
                <div className="row ml-0 align-items-center">
                  <div className="col-md-2">
                    <label htmlFor="endDate">to</label>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control"
                      id="releasedEndDate"
                      name="releasedEndDate"
                      onChange={formik.handleChange}
                      value={formik.values.releasedEndDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-3"></div>
            <div className="col-md-9">
              <div className="form-check mt-4">
                <input
                  className="form-check-input mt-1"
                  type="checkbox"
                  id="flexCheckDefault"
                  name="includeExternalSources"
                  onChange={formik.handleChange}
                  checked={formik.values.includeExternalSources}
                />
                <label
                  className="form-check-label ms-1"
                  htmlFor="flexCheckDefault"
                >
                  Include external sources
                </label>
              </div>
              <p className="mt-1" style={{ fontSize: "12px" }}>
                Associated Twitter accounts, Snowden + Hammond Documents,
                Cryptome Documents, ICWatch, This Day in WikiLeaks Blog and
                WikiLeaks Press, WL Central
              </p>
              <button type="submit" className="btn btn-secondary">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchResult;
