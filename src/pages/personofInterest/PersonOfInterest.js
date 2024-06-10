import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './personOfInterst.scss';
import { useRouteContext } from '../../context/route/RouteProvider';
import { slugify } from '../../utils/slugify';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const PersonOfInterest = () => {
  const { state } = useRouteContext();

  useEffect(() => {
    listAuthors(setLoading);
  }, []);

  const [loading, setLoading] = useState(false);

  const { routes } = state.headersData;
  const navigate = useNavigate();

  const { listAuthors, authors } = useGlobalContext();

  const handleAuthorClick = (author) => {
    const fullName = slugify(author.firstName + '-' + author.lastName);

    /* if (!author.placeholder) {
      navigate(`/person/${fullName}`);
    }

    
 */
    if (!author.placeholder) {
      window.open(`/person/${fullName}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className='persons'>
      <div className='container'>
        <h2>{routes.person}</h2>

        <div
          className='grid grid-5'
          style={{ columnGap: '18px', rowGap: '25px' }}
        >
          {authors?.map((author, index) => {
            return (
              <div
                key={'aut456' + author._id + index}
                className='img-container'
                onClick={() => handleAuthorClick(author)}
              >
                {author.featured ? (
                  <>
                    <img
                      src={author.featured}
                      alt=''
                      className='img-fluid w-100'
                    />
                    <h5>
                      {author.firstName} <br /> {author.lastName}
                    </h5>
                  </>
                ) : (
                  <>
                    <LazyLoadImage
                      src='/assets/no-picture.png' // This is the image to be lazy loaded
                      alt='No author available' // Alternative text for the image
                      effect='blur' // Apply a blur effect while the image is loading
                      width='100%'
                      height='100%'
                      style={{ border: '1px solid #eee' }}
                    />
                    <h5
                      style={{
                        padding: '5px 25px',
                        background: 'transparent',
                        width: '120%',
                      }}
                    >
                      {author.firstName} <br /> {author.lastName}
                    </h5>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PersonOfInterest;
