import React, { useEffect } from 'react';
import moment from 'moment';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import './singleNews.scss';
import { ContentComponent } from '../../components/ContentComponent';

const SingleNews = () => {
  const { singlePost } = useGlobalContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singlePost]);

  return (
    <section className='single-news container'>
      <div className='single-news-content'>
        <div className='news-header'>
          <h2 className='h2'>{singlePost.title}</h2>
          <span className='news-date'>
            {moment(singlePost.scheduledPublishTime).format('DD MMMM YYYY')}
          </span>
        </div>
        <div className='news-body mt-3'>
          {singlePost?.featured && (
            <div className=''>
              <img src={singlePost?.featured} alt='news'></img>
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
