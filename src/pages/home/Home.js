import React from 'react';
import GridItems from '../../components/GridItems';
import { HomepageMetaTags } from '../../components/HomePageMetaTags';

import Search from '../../components/Search';

import { useRouteContext } from '../../context/route/RouteProvider';

const Home = () => {
  const { state } = useRouteContext();
  const { headersData } = state;

  const { logoImgPath } = headersData;

  const url = new URL(window.location.origin);

  return (
    <div>
      <HomepageMetaTags
        title={'Bpikd'}
        description={'Persons of Interest'}
        imageUrl={logoImgPath && logoImgPath}
        url={url}
      />
      <Search />
      <GridItems />
    </div>
  );
};
export default Home;
