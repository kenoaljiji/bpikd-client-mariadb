import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import { useRouteContext } from '../../context/route/RouteProvider';
import { footerCompanies } from '../../helpers/people';
import './partners.scss';

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
      <div className='container'>
        {partners.length > 0 && <h2>{routes?.partners}</h2>}

        <div className='grid grid-5 items-center mt-4'>
          {partners?.map((img) => (
            <img src={img.imagePath} alt={'partners-' + img.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
