import React, { useEffect, useState } from "react";
import Alerts from "../../components/Alerts";
import PostsTable from "../../components/postsTable/PostsTable";
import { useGlobalContext } from "../../context/bpikd/GlobalState";

const Posts = () => {
  const { authors, posts, listAuthors, listPosts, category, setCategory } =
    useGlobalContext();

  /* const [data, setData] = useState([]); */

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listAuthors(setLoading);
  }, [category]);

  useEffect(() => {
    if (category === "News") {
      listPosts(setLoading);
    }
  }, [category]);

  useEffect(() => {}, []);

  return (
    <div className="posts my-5 text-center">
      <div className="mb-4">
        {/* <div className={`alert p-1 alert-success`}>
          <i className='fas fa-info-circle' /> {'Halo my muther '}
        </div> */}
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
          </select>
        </div>
      </div>
      {category === "News" && (
        <PostsTable posts={posts} listPosts={listPosts} category={category} />
      )}
      {category === "Person of Interest" && (
        <PostsTable
          posts={authors}
          listPosts={() => listAuthors(setLoading)}
          category={category}
        />
      )}
    </div>
  );
};

export default Posts;
