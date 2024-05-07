import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import { ContentComponent } from '../../components/ContentComponent';
import Loader from '../../components/loader/Loader';
import moment from 'moment';
import LoaderPage from '../../components/loader/LoaderPage';

const Shop = () => {
  const { posts, listPosts, singlePost, listPages } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listPages(setLoading, 'shop');
  }, []);

  return (
    <section className='shop-page'>
      <div className='container'>
        {loading ? (
          <LoaderPage />
        ) : (
          <div className='mb-5'>
            <h2 className='pb-0'>{singlePost?.title}</h2>
            <span>{moment(singlePost?.updatedAt).format('DD MMMM YYYY')}</span>
            <div className='news-description'>
              <ContentComponent content={singlePost?.content} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Shop;
