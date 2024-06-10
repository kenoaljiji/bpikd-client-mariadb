import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import 'swiper/css/bundle'; // Import all Swiper styles
import './styles/GridItems.scss';
import 'slick-carousel/slick/slick.css';

import 'slick-carousel/slick/slick-theme.css';

import Slider from 'react-slick';
import { useSortedItemsContext } from '../context/sortedItems/SortedItemsProvider';
import { useGlobalContext } from '../context/bpikd/GlobalState';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const GridItems = () => {
  const navigate = useNavigate();

  const { sortedItems } = useSortedItemsContext();

  const [blankImage, setBlankImage] = useState();

  const { listAuthors, authors } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listAuthors(setLoading);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setBlankImage('/assets/no-picture.png');
    }, 200);
  }, []);

  useEffect(() => {}, [authors]);

  const { firstRowItems, secondRowItems } = sortedItems;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    spaceBetween: 15,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      // Breakpoint for max-width 1200px: 4 items
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      // Breakpoint for max-width 992px (adjusted for common usage): 2 items
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 3,
        },
      },
      // Breakpoint for all screens below 768px: 1 item
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'transparent' }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'transparent' }}
        onClick={onClick}
      />
    );
  }

  const sliderRef = React.createRef(null);

  /*  const handleAuthorClick = (author) => {
    const fullName = slugify(author.firstName + '-' + author.lastName);

    if (!author.placeholder) {
      window.open(`/person/${fullName}`, '_blank', 'noopener,noreferrer');
    }
  }; */

  return (
    <div className='authors'>
      <div className='container-md pb-4'>
        <div className={'flex-center mb-3 firstRowItem'}>
          <div className='img-container'>
            <a
              href={`/person/${slugify(
                firstRowItems.firstName + '-' + firstRowItems.lastName
              )}`}
              target='_blank'
              rel='noreferrer'
            >
              <div>
                {!firstRowItems.placeholder ? (
                  <img
                    src={
                      firstRowItems?.featured
                        ? firstRowItems?.featured
                        : '/assets/no-picture.png'
                    }
                    alt=''
                  />
                ) : (
                  <LazyLoadImage
                    src='/assets/no-picture.png'
                    alt='No author available'
                    effect='blur'
                    style={{ border: '1px solid #eee', cursor: 'default' }}
                  />
                )}
              </div>
              {!firstRowItems.featured ? (
                <h5
                  style={{
                    padding: '13px 0',
                    backgroundColor: 'transparent',
                    opacity: 1,
                    cursor: 'default',
                  }}
                >
                  Coming
                </h5>
              ) : (
                <h5>
                  {firstRowItems?.firstName} <br /> {firstRowItems?.lastName}
                </h5>
              )}
            </a>
          </div>
        </div>

        <div className='grid mb-4'>
          {secondRowItems?.map((author, index) => {
            const { firstName, lastName } = author;
            const fullName = slugify(firstName + '-' + lastName);
            return (
              <div
                className={`items div${index + 1}`}
                key={author.id + 'e5er45'}
              >
                <a
                  href={`/person/${fullName}`}
                  target='_blank'
                  rel='noreferrer'
                >
                  <div className='img-container'>
                    {!author?.placeholder && author.featured ? (
                      <img src={author?.featured} alt='' />
                    ) : (
                      <LazyLoadImage
                        src='/assets/no-picture.png' // This is the image to be lazy loaded
                        alt='No author available' // Alternative text for the image
                        effect='blur' // Apply a blur effect while the image is loading
                        style={{ border: '1px solid #eee', cursor: 'default' }}
                      />
                    )}

                    {author.placeholder ? (
                      <h5
                        style={{
                          padding: '13px 0',
                          background: 'transparent',
                          cursor: 'default',
                        }}
                      >
                        coming
                      </h5>
                    ) : (
                      <h5>
                        {firstName} <br /> {lastName}
                      </h5>
                    )}
                  </div>
                </a>
              </div>
            );
          })}
        </div>
        <div className='custom-slider'>
          <Slider {...settings} ref={sliderRef}>
            {authors?.map((author, index) => {
              const { firstName, lastName } = author;

              const fullName = slugify(
                author.firstName + '-' + author.lastName
              );
              return (
                <div key={author.id + 'ffe45g'} className='slide-item'>
                  <a
                    href={`/person/${fullName}`}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <div className='img-container'>
                      {!author?.placeholder && author.featured ? (
                        <img src={author?.featured} alt='' />
                      ) : (
                        <LazyLoadImage
                          src='/assets/no-picture.png' // This is the image to be lazy loaded
                          alt='No author available' // Alternative text for the image
                          effect='blur' // Apply a blur effect while the image is loading
                          style={{ border: '1px solid #eee' }}
                        />
                      )}

                      {author.placeholder ? (
                        <h5
                          style={{
                            padding: '13px 0',
                            background: 'transparent',
                            cursor: 'default',
                          }}
                        >
                          coming
                        </h5>
                      ) : (
                        <h5
                          style={{
                            backgroundColor: !author?.featured && 'transparent',
                            marginBottom: !author?.featured && '8px',
                            cursor: 'pointer',
                          }}
                        >
                          {firstName} <br /> {lastName}
                        </h5>
                      )}
                    </div>
                  </a>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default GridItems;
