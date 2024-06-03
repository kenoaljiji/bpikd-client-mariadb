import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import { useRouteContext } from '../../context/route/RouteProvider';
import './partners.scss';

const Partners = () => {
  const { state } = useRouteContext();
  const { routes } = state.headersData;

  const { partners, getPartnersData } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPartnersData(setLoading);
  }, []);

  useEffect(() => {
    console.log(partners);
  }, [partners]);

  return (
    <section className='partners'>
      <div className='container'>
        {partners.length > 0 && <h2>{routes?.partners}</h2>}

        <div className='grid grid-5 items-center mt-4'>
          {partners?.map((img, index) => (
            <a
              href={img.url}
              target='_blank'
              rel='noreferrer'
              className='partners-links'
            >
              <img
                src={img.imagePath}
                alt={'partners-' + img.id}
                key={img.id ? img.id : index + 'pd2'}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
