import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import { ContentComponent } from '../../components/ContentComponent';
import './about.scss';
import moment from 'moment';

const About = () => {
  const { singlePost, listPages } = useGlobalContext();
  useEffect(() => {
    listPages(setLoading, 'about');
    //eslint-disable-next-line
  }, []);

  const [loading, setLoading] = useState(false);

  return (
    <section className='about-page'>
      <div className='container'>
        <div className='mb-5'>
          <h2 className='pb-0'>{singlePost?.title}</h2>
          {singlePost && (
            <span>{moment(singlePost?.updatedAt).format('DD MMMM YYYY')}</span>
          )}

          <div className='news-description'>
            <ContentComponent content={singlePost?.content} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
