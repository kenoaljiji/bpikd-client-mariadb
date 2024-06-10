import React, { useContext, useEffect } from 'react';
import './style/footer.scss';
import BackTopButton from '../components/BackTopButton';
import { Link, useLocation } from 'react-router-dom';
import { useFooterContext } from '../context/footer/FooterProvider';
import { ThemeContext } from '../context/theme/ThemeContext';

const Footer = () => {
  const { footerCompanies } = useFooterContext();

  const { theme } = useContext(ThemeContext);

  const location = useLocation();

  return (
    <>
      <footer
        className={`footer ${location.pathname !== '/search' && 'mt-6'}`}
        style={{ background: theme.footerColor, color: theme.footerTextColor }}
      >
        <BackTopButton />
        <div className='container'>
          <div className='grid'>
            {footerCompanies?.map((company, index) => (
              <Link
                to={company.url}
                target='_blank'
                key={company.name + 'c' + index}
              >
                <div className='g-col-4'>
                  <div className=''>
                    <div className='teaser'>
                      <img src={`${company.src}`} alt='' />
                    </div>
                    <p style={{ color: theme.footerTextColor }}>
                      {' '}
                      {company.description}
                    </p>
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
