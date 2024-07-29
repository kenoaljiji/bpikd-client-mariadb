import React from 'react';
import { Helmet } from 'react-helmet';

export const HomepageMetaTags = ({ title, description, imageUrl, url }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />

      {/* Open Graph Meta Tags */}
      <meta property='og:title' content={title} />
      <meta property='og:site_name' content='Bpikd' />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={imageUrl} />
      <meta property='og:url' content={url} />
      <meta property='og:type' content='website' />

      {/* Twitter Card Meta Tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={imageUrl} />
    </Helmet>
  );
};
