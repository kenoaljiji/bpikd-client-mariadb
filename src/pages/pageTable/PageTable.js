import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useGlobalContext } from "../../context/bpikd/GlobalState";

const PageTable = ({ page: post }) => {
  const navigate = useNavigate();

  const { category, listPages } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  const handleNavigate = async (postId) => {
    // Ensure we have the post data before navigating
    await listPages(setLoading, category); // This should be an async function that fetches and sets the singlePost data
    navigate(`/admin/posts/create-edit/${category.toLowerCase()}/${postId}`);
  };

  return (
    <div className="container mt-5 custom-table">
      <table className="table table-striped text-start">
        <thead>
          <tr>
            <th className="ps-4">Page Title</th>
            <th>Created By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody
          onClick={() =>
            navigate(
              `/admin/posts/create-edit/${category.toLowerCase()}/${post.id}`
            )
          }
          style={{ cursor: "pointer" }}
        >
          <tr key={post.id}>
            <td className="ps-4 text-start d-flex">
              <span className="w-75 d-flex align-items-center">
                {post.title}
              </span>

              <div className="action-icons">
                <i className="fa fa-edit"></i>

                {/*  <i
                  className="fa fa-trash"
                  onClick={() => handleDeleteClick(post)}
                ></i> */}
              </div>
            </td>

            <>
              <td>{post.createdBy}</td>
              <td>{moment(post.updatedAt).format("DD MMMM YYYY")}</td>
            </>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PageTable;
