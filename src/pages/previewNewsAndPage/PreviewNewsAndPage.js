import React, { useEffect, useState } from 'react';
import moment from 'moment';
import './previewPage.scss';
import { ContentComponent } from '../../components/ContentComponent';
import { usePreviewContext } from '../../context/previewContext/PreviewState';
import { useNavigate } from 'react-router-dom';

const PreviewNewsAndPage = () => {
  const { singlePost, togglePreviewMode } = usePreviewContext();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    togglePreviewMode(false);
  }, []);

  return (
    <section className='single-news container'>
      <div className='preview-mode bg-gray text-end'>
        <button
          onClick={() => {
            navigate('/admin/posts/create-edit');
          }}
        >
          Exit Perview
        </button>
      </div>
      <div className='single-news-content'>
        <div className='news-header'>
          <h2 className='h2'>{singlePost.title}</h2>
          <span className='news-date'>
            {singlePost.scheduledPublishTime &&
              moment(singlePost.scheduledPublishTime).format('DD MMMM YYYY')}
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

export default PreviewNewsAndPage;
