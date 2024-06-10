import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth/AuthState';
import { complexString } from '../utils/complexString';

const AuthHeader = () => {
  const { user, isAuthenticated } = useAuthContext();

  const navigate = useNavigate();

  const location = useLocation();

  return (
    <header className='px-5 py-3 header-auth'>
      <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex'>
          {!isAuthenticated ? (
            <Link to='/'>
              <img src='/assets/images/logo-white-new.png' alt='' width='130' />
            </Link>
          ) : (
            <>
              {location.pathname !== '/admin/dashboard' ? (
                <Link to='dashboard'>
                  <div className='d-flex align-items-center'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 34 34'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M15.2468 4.23689V11.002C15.2468 11.5621 15.1362 12.1168 14.9212 12.6341C14.7062 13.1514 14.3911 13.6211 13.9939 14.0164C13.5968 14.4117 13.1255 14.7247 12.6071 14.9375C12.0887 15.1503 11.5333 15.2586 10.9728 15.2563H4.23914C3.68021 15.2597 3.12635 15.1503 2.61076 14.9345C2.09517 14.7188 1.62847 14.4013 1.23863 14.0009C0.843624 13.608 0.530706 13.1406 0.318074 12.6258C0.105441 12.1109 -0.00266186 11.559 4.97768e-05 11.002V4.25433C4.03213e-05 3.12903 0.4461 2.04955 1.24059 1.25221C2.03507 0.45487 3.11326 0.0046119 4.23914 0H10.9903C11.5486 0.000536177 12.1013 0.111768 12.6164 0.327255C13.1314 0.542742 13.5986 0.858204 13.9908 1.25538C14.3884 1.64357 14.7044 2.10732 14.9201 2.61934C15.1358 3.13137 15.2469 3.68133 15.2468 4.23689ZM34 4.25433V11.002C33.991 12.1245 33.542 13.1987 32.7494 13.9941C31.9569 14.7895 30.884 15.2427 29.7609 15.2563H22.9923C21.864 15.2494 20.7822 14.8057 19.9744 14.0184C19.5796 13.6217 19.267 13.1511 19.0545 12.6335C18.8419 12.1159 18.7336 11.5615 18.7358 11.002V4.25433C18.7334 3.69584 18.8433 3.14256 19.0591 2.62738C19.2749 2.11219 19.5921 1.64562 19.9918 1.25538C20.384 0.858204 20.8512 0.542742 21.3662 0.327255C21.8813 0.111768 22.434 0.000536177 22.9923 0H29.7435C30.8695 0.00911381 31.9469 0.460263 32.7432 1.25614C33.5395 2.05201 33.9909 3.12883 34 4.25433ZM34 22.9978V29.7454C33.991 30.868 33.542 31.9422 32.7494 32.7376C31.9569 33.533 30.884 33.9861 29.7609 33.9998H22.9923C21.8568 34.0113 20.7616 33.5797 19.9395 32.7967C19.5432 32.4012 19.2295 31.9308 19.0169 31.4129C18.8043 30.8951 18.6968 30.3401 18.7009 29.7803V23.0327C18.6986 22.4742 18.8086 21.9209 19.0244 21.4058C19.2401 20.8906 19.5573 20.424 19.9569 20.0337C20.3492 19.6366 20.8164 19.3212 21.3314 19.1057C21.8464 18.8902 22.3991 18.779 22.9574 18.7783H29.7086C30.8347 18.7875 31.912 19.2386 32.7083 20.0345C33.5046 20.8303 33.956 21.9072 33.9651 23.0327L34 22.9978ZM15.2468 23.0152V29.7629C15.2331 30.8883 14.7773 31.9633 13.9777 32.7559C13.1782 33.5485 12.099 33.9953 10.9728 33.9998H4.23914C3.68181 34.0021 3.12954 33.8941 2.61418 33.682C2.09883 33.4699 1.6306 33.1579 1.2365 32.764C0.842409 32.3701 0.530248 31.9021 0.318031 31.387C0.105814 30.8719 -0.00225804 30.3199 4.97768e-05 29.7629V23.0152C0.00454392 21.8897 0.451508 20.811 1.24453 20.0119C2.03756 19.2127 3.11309 18.7572 4.23914 18.7435H10.9903C12.1214 18.7532 13.2042 19.2036 14.0082 19.9988C14.8039 20.8011 15.2492 21.8856 15.2468 23.0152Z'
                        fill='white'
                      />
                    </svg>
                    <h5
                      className='text-white ms-2'
                      style={{ paddingTop: '1px' }}
                    >
                      Dashboard
                    </h5>
                  </div>
                </Link>
              ) : (
                <div className='d-flex align-items-center'>
                  <h5 className='text-white ms-2' style={{ paddingTop: '2px' }}>
                    Dashboard
                  </h5>
                </div>
              )}
            </>
          )}
        </div>
        {user?.user ? (
          <>
            <div className='users d-flex'>
              <Link to={'/admin/users/create-edit/' + user.user.id}>
                <div className='d-flex align-items-center'>
                  <span>{user.user.username}</span>
                  <i className='fa-regular fa-user ms-2'></i>
                </div>
              </Link>
              <div
                className='logout d-flex ms-5'
                onClick={() => {
                  navigate('/' + complexString + '/admin');
                }}
              >
                <div className='d-flex align-items-center'>
                  <span>logout</span>
                  <i className='fa-solid fa-power-off ms-2'></i>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
};

export default AuthHeader;
