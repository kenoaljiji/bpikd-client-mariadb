import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useGlobalContext } from "../../context/bpikd/GlobalState";

const categories = ["Button2" /* "Button1" */, "About", "Shop", "Soon"];

const Pages = () => {
  const navigate = useNavigate();
  const { listPages, getPartnersData } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [pagesByCategory, setPagesByCategory] = useState({});

  useEffect(() => {
    categories.forEach((category) => {
      listPages(setLoading, category).then((pages) => {
        setPagesByCategory((prev) => ({ ...prev, [category]: pages }));
      });
    });

    // Example if Partners is a special case
    getPartnersData(setLoading).then((partnersData) => {
      setPagesByCategory((prev) => ({ ...prev, Partners: partnersData }));
    });
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="container mt-5 custom-table">
      <table className="table table-striped text-start">
        <thead>
          <tr>
            <th className="ps-4">Category</th>
            <th>Page Title</th>
            <th>Created By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(pagesByCategory).map(([category, posts]) =>
            posts?.map((post) => (
              <tr
                key={category + "t" + post.id}
                onClick={() =>
                  navigate(
                    `/admin/posts/create-edit/${category.toLowerCase()}/${
                      post.id
                    }`
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <td>{category}</td>
                <td className="ps-4 text-start">{post.title}</td>
                <td>{post.createdBy}</td>
                <td>{moment(post.updatedAt).format("DD MMMM YYYY")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Pages;
