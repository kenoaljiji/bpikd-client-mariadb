import React, { useEffect } from 'react';
import './style/footer.scss';
import BackTopButton from '../components/BackTopButton';
import { Link, useLocation } from 'react-router-dom';
import { useFooterContext } from '../context/footer/FooterProvider';

const Footer = () => {
  const { footerCompanies, getFooterData } = useFooterContext();

  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <>
      <footer className={`footer ${location.pathname !== '/search' && 'mt-6'}`}>
        <BackTopButton />
        <div className='container'>
          <div className='grid'>
            {footerCompanies?.map((company, index) => (
              <Link to={company.url} target='_blank'>
                <div className='g-col-4'>
                  <div className=''>
                    <div className='teaser'>
                      <img src={`${company.src}`} alt='' />
                    </div>
                    <p>{company.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
