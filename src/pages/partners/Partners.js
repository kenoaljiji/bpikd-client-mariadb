import React, { useEffect, useState } from 'react';
import { footerCompanies } from '../../helpers/people';
import { useRouteContext } from '../../context/route/RouteProvider';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import './partners.scss';
import Loader from '../../components/loader/Loader';

const Partners = () => {
  const { state } = useRouteContext();
  const { routes } = state.headersData;

  const { partners, getPartnersData } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPartnersData(setLoading);
  }, []);

  return (
    <section className='partners'>
      {loading ? (
        <Loader />
      ) : (
        <div className='container'>
          <h2>{routes?.partners}</h2>

          <div className='grid grid-5 items-center mt-4'>
            {partners.length > 0 ? (
              partners.map((img) => (
                <img src={img.imagePath} alt={'partners-' + img.id} />
              ))
            ) : (
              <p> There is no partners data</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Partners;
