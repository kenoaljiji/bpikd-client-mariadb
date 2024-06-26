import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import { ContentComponent } from '../../components/ContentComponent';
import './donate.scss';
import { Link } from 'react-router-dom';

const Donate = () => {
  const { singlePost, listPages } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listPages(setLoading, 'button1');
    //eslint-disable-next-line
  }, []);

  const style = {
    color: '#317eac',
  };
  return (
    <section className='container page1'>
      <h2 className='pb'>{singlePost?.title}</h2>
      <div className='news-description'>
        <ContentComponent content={singlePost?.content} />
      </div>
      <div className='card-custom mt-3'>
        <h2
          className='card-title p-3 rounded'
          style={{ ...style, background: '#d9edf7' }}
        >
          Paypal
        </h2>
        <div className='card mt-3 border-top-0 rounded-0'>
          <div className='card-body p-0'>
            <div className='p-3'>
              <p className='font-weight-bold' style={{ fontWeight: 'bold' }}>
                Global PayPal donations
              </p>
              <p>
                Donations made via the Wau Holland Foundation are tax deductible
                in the EU.
              </p>
              <Link
                className='btn btn-success'
                target='_blank'
                to='https://paypal.com'
              >
                Donate Paypal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
