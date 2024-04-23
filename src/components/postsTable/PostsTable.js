import React, { useEffect, useState } from "react";
import "../styles/tables.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../../context/auth/AuthState";
import { localhost } from "../../config/config";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";
import moment from "moment";
import transformPath from "../../utils/transformPath";
import Loader from "../loader/Loader";

const PostsTable = ({ posts, category, listPosts, loading }) => {
  const { user } = useAuthContext();
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  // Inside your UsersTable component
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const headers =
    category !== "Person of Interest"
      ? { name: category, user: "User", date: "Date" }
      : { name: "Persons", user: "User", date: "Date" };

  const navigate = useNavigate();

  // Function to handle selecting/deselecting a post
  // Function to handle selecting/deselecting a user checkbox
  const handleSelectPost = (postId) => {
    const isSelected = selectedPostIds.includes(postId);
    setSelectedPostIds(
      isSelected
        ? selectedPostIds.filter((id) => id !== postId)
        : [...selectedPostIds, postId]
    );
  };

  const deleteSelectedPosts = async () => {
    const path = category !== "Person of Interest" ? "news" : "persons";
    try {
      const data = {
        personIds: selectedPostIds, // Pass the person IDs to delete here
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token, // Use the user's token from state
        },
      };

      const res = await axios.post(
        `${localhost}/post/${path}/delete-multiply`, // Make sure the URL is correct
        data, // passing data as the second argument
        config // config as the third argument
      );

      console.log("Response:", res.data); // Logging the response from the server
      setSelectedPostIds([]); // Clear the selected person IDs
      listPosts(); // Assuming this is a function to refresh the list after deletion
      // Handle successful operation (e.g., display a message, update state if necessary)
    } catch (err) {
      console.error("Error in deleting posts:", err);
      // Handle errors (e.g., show error message)
    }

    setIsModalOpen(false); // Close the modal after action
  };

  const deletePost = async (postId) => {
    const path = category !== "Person of Interest" ? "news" : "persons";
    try {
      // Optional: Add a token or authorization header if needed
      console.log(user.token);
      const token = user.user.token;
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const res = await axios.delete(
        `${localhost}/post/${path}/${postId}`,
        config
      );

      listPosts();

      // Navigate to dashboard or login page after successful registration
      // Optional: Redirect or load users again
    } catch (err) {
      console.error(err.message);
    }
  };

  // Call this when the delete button for a single user is clicked
  const handleDeleteClick = (post) => {
    // Assuming `category` is accessible here, directly or from state/context
    const isPersonOfInterestCategory = category === "Person of Interest";
    const displayName = isPersonOfInterestCategory
      ? `${post.firstName} ${post.lastName}`
      : post.title;

    setIsModalOpen(true);
    setModalContent({
      message: `Are you sure you want to delete ${displayName}`,
      onConfirm: () => {
        deletePost(post.id);
      },
    });
  };

  // Call this when the bulk delete button is clicked
  const handleBulkDeleteClick = () => {
    setIsModalOpen(true);
    setModalContent({
      message: `Are you sure you want to delete these ${selectedPostIds?.length} users?`,
      onConfirm: () => deleteSelectedPosts(),
    });
  };

  // Debouncing searchTerm
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Delay in ms

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const filteredPosts =
    debouncedSearchTerm.length >= 3
      ? posts.filter((post) =>
          category === "Person of Interest"
            ? post.person?.firstName
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              post.person?.lastName
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
            : post?.title
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
        )
      : posts;

  return (
    <div className="custom-table mt-5">
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              className="btn btn-success"
              onClick={() => navigate("/admin/posts/create-edit")}
            >
              <i className="fa fa-plus"></i> Add Post
            </button>
            <div className="search-bar">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredPosts?.length > 0 ? (
            <table className="table table-striped text-start">
              <thead>
                <tr>
                  <th className="ps-4">{headers.name}</th>
                  <th>{headers.user}</th>
                  <th>{headers.date}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts?.length > 0 ? (
                  filteredPosts?.map((post) => (
                    <tr key={category + post.id}>
                      <td className="ps-4 text-start d-flex">
                        <input
                          className="me-2"
                          type="checkbox"
                          onChange={() => handleSelectPost(post.id)}
                          checked={selectedPostIds.includes(post.id)}
                        />
                        <span className="w-75 d-flex align-items-center">
                          {category !== "Person of Interest"
                            ? post.title
                            : `${post.firstName} ${post.lastName}`}
                        </span>

                        <div className="action-icons">
                          <i
                            className="fa fa-edit"
                            onClick={() =>
                              navigate(
                                `/admin/posts/create-edit/${transformPath(
                                  category
                                )}/${post.id}`
                              )
                            }
                          ></i>

                          <i
                            className="fa fa-trash"
                            onClick={() => handleDeleteClick(post)}
                          ></i>
                        </div>
                      </td>
                      {category === "Person of Interest" ? (
                        <>
                          <td>{post.createdBy}</td>
                          <td>
                            {moment(post.updatedAt).format("DD MMMM YYYY")}
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{post.createdBy}</td>
                          <td>
                            {moment(post.updatedAt).format("DD MMMM YYYY")}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      Cannot find user
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <p>No posts found.</p>
          )}
          <div className="d-flex justify-content-start">
            {selectedPostIds?.length > 0 && (
              <button
                className="btn btn-sm btn-danger"
                onClick={handleBulkDeleteClick}
              >
                Delete
              </button>
            )}
          </div>

          {isModalOpen && (
            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={modalContent.onConfirm}
              message={modalContent.message}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostsTable;
