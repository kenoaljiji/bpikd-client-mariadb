import React, { useEffect, useState } from 'react';
import Alerts from '../../components/Alerts';
import PostsTable from '../../components/postsTable/PostsTable';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import PageTable from '../pageTable/PageTable';
import { useNavigate } from 'react-router-dom';

const Posts = () => {
  const {
    authors,
    posts,
    listAuthors,
    listPosts,
    setCategory,
    listPages,
    singlePost,
    getPartnersData,
    category,
  } = useGlobalContext();

  /* const [data, setData] = useState([]); */

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {}, [category, singlePost]);

  useEffect(() => {
    if (category === 'News') {
      listPosts(setLoading);
    }
    if (category === 'Person of Interest') {
      listAuthors(setLoading);
    }
    if (['Button1', 'Button2', 'About', 'Shop', 'Soon'].includes(category)) {
      listPages(setLoading, category);
    }
    if (category === 'Partners') {
      getPartnersData(setLoading);
    }
  }, [category]);

  return (
    <div className='posts my-5 text-center'>
      <div className='mb-4'>
        {/* <div className={`alert p-1 alert-success`}>
          <i className='fas fa-info-circle' /> {'Halo my muther '}
        </div> */}
        <Alerts />
      </div>
      <h2 className='mb-5'>Posts</h2>
      <div className='post-category bg-gray '>
        <div className='category-select d-flex align-items-center p-1'>
          <label>Select category:</label>
          <select
            className=''
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value='Person of Interest'>Person of Interest</option>
            <option value='News'>News</option>
            <option value='Partners'>Partners</option>
            <option value='About'>About</option>
            <option value='Button2'>Button2Page</option>
            <option value='Shop'>Shop</option>
            <option value='Soon'>Coming</option>
          </select>
        </div>
      </div>
      <div className='mt-5'>
        <h3>{category === 'Soon' ? 'Coming' : category}</h3>
      </div>
      {category === 'News' && (
        <PostsTable
          posts={posts}
          loading={loading}
          listPosts={() => listPosts(setLoading)}
          category={category}
        />
      )}
      {category === 'Person of Interest' && (
        <PostsTable
          posts={authors}
          loading={loading}
          listPosts={() => listAuthors(setLoading)}
          category={category}
        />
      )}
      {['Button1', 'Button2', 'About', 'Shop', 'Soon'].includes(category) && (
        <PageTable loading={loading} setLoading={setLoading} />
      )}
      {category === 'Partners' && (
        <div className='container mt-5 custom-table'>
          <table className='table table-striped text-start'>
            <thead>
              <tr>
                <th className='ps-4'>Page</th>
              </tr>
            </thead>
            <tbody
              onClick={() =>
                navigate(
                  `/admin/posts/create-edit/${category.toLowerCase()}/1
                  `
                )
              }
              style={{ cursor: 'pointer' }}
            >
              <tr>
                <td className='ps-4 text-start d-flex'>
                  <span className='w-75 d-flex align-items-center'>
                    {category}
                  </span>

                  <div className='action-icons'>
                    <i className='fa fa-edit'></i>

                    {/*  <i
                  className="fa fa-trash"
                  onClick={() => handleDeleteClick(post)}
                ></i> */}
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
