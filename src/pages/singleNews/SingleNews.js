import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import './singleNews.scss';
import { ContentComponent } from '../../components/ContentComponent';
import { useParams } from 'react-router-dom';

const SingleNews = () => {
  const { singlePost, getPostById } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isNaN(slug)) {
      getPostById(slug, 'news', setLoading);
    }
    //eslint-disable-next-line
  }, [singlePost]);

  return (
    <section className='single-news container'>
      <div className='single-news-content mt-5'>
        <div className='news-heade r'>
          <h3 className='h3'>{singlePost.title}</h3>
          {/*   <span className='news-date'>
            {moment(singlePost.scheduledPublishTime).format('DD MMMM YYYY')}
          </span> */}
        </div>
        <div className='news-body mt-3'>
          {singlePost?.featured && (
            <div className=''>
              <img
                src={singlePost?.featured}
                alt='news'
                className='single-post-image'
              ></img>
            </div>
          )}
          <div className='news-description'>
            {singlePost?.content && (
              <ContentComponent content={singlePost.content} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleNews;
