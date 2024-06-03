import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import CustomSearch from '../components/CustomSearch';
import MobileMenu from '../components/mobileMenu/MobileMenu';
import { useContext, useState } from 'react';
import Footer from './Footer';
import './style/layout.scss';
import { ThemeContext } from '../context/theme/ThemeContext';

function Layout({ children }) {
  const { pathname } = useLocation();

  const { maintenance } = useContext(ThemeContext);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    console.log(isActive);
    setIsActive(!isActive);
  };

  // Function to determine whether to render the header and footer based on the route
  const shouldRenderHeaderFooter = () => {
    return !pathname.startsWith('/admin');
    /* !pathname.startsWith('/login') &&
      !pathname.startsWith('/register') */
  };

  return (
    <div className='relative'>
      {shouldRenderHeaderFooter() && (
        <>
          <Header handleClick={handleClick} isActive={isActive} />
          <MobileMenu isActive={isActive} setIsActive={setIsActive} />
          <div className='mt-2'>
            {pathname !== '/' ? (
              <CustomSearch type={'custom-search-2'} />
            ) : null}
          </div>
        </>
      )}
      <main className={pathname === '/' ? 'home-layout' : ''}>
        <Outlet />
      </main>
      {shouldRenderHeaderFooter() && <Footer />}{' '}
      {/* Render footer except for Dashboard, Login, and Register routes */}
    </div>
  );
}

export default Layout;
