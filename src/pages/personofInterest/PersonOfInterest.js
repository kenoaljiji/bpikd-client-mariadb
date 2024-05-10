import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authors } from '../../helpers/people';
import './personOfInterst.scss';
import { useRouteContext } from '../../context/route/RouteProvider';
import { slugify } from '../../utils/slugify';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import Loader from '../../components/loader/Loader';
import LoaderPage from '../../components/loader/LoaderPage';

const PersonOfInterest = () => {
  const { state } = useRouteContext();

  useEffect(() => {
    listAuthors(setLoading);
  }, []);

  const [loading, setLoading] = useState(false);

  const { routes } = state.headersData;
  const navigate = useNavigate();

  const { listAuthors, authors } = useGlobalContext();

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
                key={'aut456' + author._id}
                className='img-container'
                onClick={() =>
                  navigate(
                    `/person/${slugify(
                      author.firstName + '-' + author.lastName
                    )}`
                  )
                }
              >
                <img src={author.featured} alt='' className='img-fluid w-100' />
                <h5>
                  {author.firstName} <br /> {author.lastName}
                </h5>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PersonOfInterest;
