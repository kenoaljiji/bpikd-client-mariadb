import React, { useEffect, useState } from "react";
import Alerts from "../../components/Alerts";
import PostsTable from "../../components/postsTable/PostsTable";
import { useGlobalContext } from "../../context/bpikd/GlobalState";
import { useNavigate } from "react-router-dom";
import { usePreviewContext } from "../../context/previewContext/PreviewState";
import { LIST_SINGLE_POST } from "../../context/types";

const Posts = () => {
  const {
    authors,
    posts,
    listAuthors,
    listPosts,
    setCategory,
    /*   listPages, */
    getPartnersData,
    category,
    dispatch,
  } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { previewSinglePost } = usePreviewContext();

  useEffect(() => {
    previewSinglePost({});
    dispatch({
      type: LIST_SINGLE_POST,
      payload: {},
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (category === "News") {
      listPosts(setLoading, category);
    }
    if (category === "Person of Interest") {
      listAuthors(setLoading);
    }

    if (["Button1", "Button2", "About", "Shop", "Soon"].includes(category)) {
      listPosts(setLoading, category);
    }

    if (category === "Partners") {
      getPartnersData(setLoading);
    }
    //eslint-disable-next-line
  }, [category]);

  return (
    <div className="posts my-5 text-center">
      <div className="mb-4">
        <Alerts />
      </div>
      <h2 className="mb-5">Posts</h2>
      <div className="post-category bg-gray ">
        <div className="category-select d-flex align-items-center p-1">
          <label>Select category:</label>
          <select
            className=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Person of Interest">Person of Interest</option>
            <option value="News">News</option>
            <option value="Partners">Partners</option>
            <option value="About">About</option>
            <option value="Button2">Button2Page</option>
            <option value="Button1">Button1Page</option>
            <option value="Shop">Shop</option>
            <option value="Soon">Coming</option>
          </select>
        </div>
      </div>
      <div className="mt-5">
        <h3>{category === "Soon" ? "Coming" : category}</h3>
      </div>
      {category === "News" && (
        <PostsTable
          posts={posts}
          loading={loading}
          listPosts={() => listPosts(setLoading, category)}
          category={category}
        />
      )}
      {category === "Person of Interest" && (
        <PostsTable
          posts={authors}
          loading={loading}
          listPosts={() => listAuthors(setLoading)}
          category={category}
        />
      )}
      {["Button1", "Button2", "About", "Shop", "Soon"].includes(category) && (
        <PostsTable
          posts={posts}
          loading={loading}
          listPosts={() => listPosts(setLoading, category)}
          category={category}
        />
      )}
      {category === "Partners" && (
        <div className="container mt-5 custom-table">
          <table className="table table-striped text-start">
            <thead>
              <tr>
                <th className="ps-4">Page</th>
              </tr>
            </thead>
            <tbody
              onClick={() =>
                navigate(
                  `/admin/posts/create-edit/${category.toLowerCase()}/1
                  `
                )
              }
              style={{ cursor: "pointer" }}
            >
              <tr>
                <td className="ps-4 text-start d-flex">
                  <span className="w-75 d-flex align-items-center">
                    {category}
                  </span>

                  <div className="action-icons">
                    <i className="fa fa-edit"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Posts;
