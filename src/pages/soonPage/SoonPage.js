import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
/* import { ContentComponent } from "../../components/ContentComponent"; */
/* import "./about.scss"; */
import DOMPurify from 'dompurify';
import './soon.scss';

export function ContentComponent({ content }) {
  const config = {
    ADD_TAGS: ['img'],
    ADD_ATTR: ['src', 'alt', 'title', 'width', 'height', 'style'],
    ALLOW_DATA_ATTR: true, // Allow data attributes which might be necessary for base64 images
  };

  const sanitizedContent = DOMPurify.sanitize(content, config);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}

const SoonPage = () => {
  useEffect(() => {
    listPages(setLoading, 'soon');
  }, []);

  const { singlePost, listPages } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  return (
    <section className='soon-page'>
      <div className='container'>
        <div className='mb-5'>
          <h2 className='pb-0'>{singlePost?.title}</h2>
          {singlePost && (
            <span>{moment(singlePost?.updatedAt).format('DD MMMM YYYY')}</span>
          )}
          {singlePost && (
            <div className='news-description'>
              <ContentComponent content={singlePost?.content} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SoonPage;
