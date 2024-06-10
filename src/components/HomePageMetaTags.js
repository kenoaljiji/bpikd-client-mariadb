import React from 'react';
import { Helmet } from 'react-helmet';

export const HomepageMetaTags = ({ title, description, imageUrl }) => {
  return (
    <Helmet>
      <title>{title}</title>
      {/*       <meta name='description' content={description} /> */}
      <meta property='og:title' content={title} />
      {/*     <meta property='og:description' content={description} /> */}
      <meta property='og:image' content={imageUrl} />
      <meta property='og:type' content='website' />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      {/*     <meta name='wasitter:description' content={description} /> */}
      <meta name='twitter:image' content={imageUrl} />
    </Helmet>
  );
};
