import React from 'react';
import './style/footer.scss';
import BackTopButton from '../components/BackTopButton';
import { Link } from 'react-router-dom';
import { useFooterContext } from '../context/footer/FooterProvider';
import { localhost } from '../config/config';

const Footer = () => {
  const { footerCompanies, getFooterData } = useFooterContext();

  return (
    <>
      <footer className='footer mt-6'>
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
