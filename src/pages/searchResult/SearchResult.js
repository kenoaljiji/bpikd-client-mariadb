import React from "react";
import { useLocation } from "react-router-dom";
import "./searchResult.scss";

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  return (
    <div className="py-5 search-result">
      <div className="container">
        <h2 className="mb-5">Advenced Search</h2>
        <h3 className="text-secondary pb-2">Words</h3>
      </div>

      <div className="container mt-3">
        <form>
          <div className="row ">
            <div className="col-md-3">
              {/* First column - smaller */}
              <div className="form-group mt-2">
                <label htmlFor="words">
                  <strong className="font-weight-bold">All</strong> these words
                </label>
              </div>
            </div>
            <div className="col-md-9">
              {/* Second column - larger */}
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="words"
                  defaultValue={query}
                />
                <span style={{ fontSize: "12px" }}>
                  You can use any of these search operators in this input field
                </span>
              </div>
            </div>
          </div>
          <div className="row mt-3 align-items-center">
            <div className="col-md-3">
              {/* First column - smaller */}
              <div className="form-group">
                <label htmlFor="phrase">
                  This<strong className="font-weight-bold"> Exact</strong>{" "}
                  phrase
                </label>
              </div>
            </div>
            <div className="col-md-9">
              {/* Second column - larger */}
              <div className="form-group">
                <input type="text" className="form-control" id="phrase" />
              </div>
            </div>
          </div>
          <div className="row mt-3 align-items-center">
            <div className="col-md-3">
              {/* First column - smaller */}
              <div className="form-group">
                <label htmlFor="anyWords">
                  <strong className="font-weight-bold">Any</strong> of these
                  words
                </label>
              </div>
            </div>
            <div className="col-md-9">
              {/* Second column - larger */}
              <div className="form-group">
                <input type="text" className="form-control" id="anyWords" />
              </div>
            </div>
          </div>
          <div className="row mt-3 align-items-center">
            <div className="col-md-3">
              {/* First column - smaller */}
              <div className="form-group">
                <label htmlFor="excludeWords">
                  <strong className="font-weight-bold">Exclude</strong> these
                  words
                </label>
              </div>
            </div>
            <div className="col-md-9">
              {/* Second column - larger */}
              <div className="form-group">
                <input type="text" className="form-control" id="excludeWords" />
              </div>
            </div>
          </div>
          <h3 className="text-secondary pt-5 pb-2">Words</h3>
          <div className="row mt-3 align-items-center">
            <div className="col-md-6 ps-0">
              {/* First column - smaller */}
              <div className="form-group">
                <div className="container">
                  <div className="row ml-0 align-items-center">
                    <div className="col-md-6 ">
                      <label htmlFor="createdDate">Origin or created</label>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        id="createdDate"
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
                    <input type="date" className="form-control" id="endDate" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6 ps-0">
              {/* First column - smaller */}
              <div className="form-group">
                <div className="container">
                  <div className="row ml-0">
                    <div className="col-md-6">
                      <label htmlFor="releasedDate">Released by Bpikd</label>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        id="releasedDate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="container">
                <div className="row">
                  <div className="col-md-2">
                    <label htmlFor="endDate">to</label>
                  </div>
                  <div className="col-md-6">
                    <input type="date" className="form-control" id="endDate" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-3"></div>
            <div className="col-md-9">
              {/* Second column - larger */}
              <div className="form-check mt-4">
                <div className="flex items-center">
                  <input
                    className="form-check-input mt-1"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label ms-1"
                    for="flexCheckDefault"
                    style={{ fontSize: "16px" }}
                  >
                    Include external sources
                  </label>
                </div>
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
