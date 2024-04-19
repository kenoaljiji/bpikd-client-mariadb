import React, { useEffect, useState } from 'react';
import { newsData } from '../../helpers/people';
import { useRouteContext } from '../../context/route/RouteProvider';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import moment from 'moment';
import './news.scss';
import Loader from '../../components/loader/Loader';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';

export function ContentComponent({ content }) {
  const [shortenedContent, setShortenedContent] = useState('');

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const textContent = doc.body.textContent || '';

    // Truncate the text content to the first sentence or up to a maximum character length.
    const maxCharacters = 250;
    let shortened = textContent.substr(0, maxCharacters).trim();
    const lastSpaceIndex = shortened.lastIndexOf(' ');

    // Try to avoid cutting words in half
    if (lastSpaceIndex > 0 && lastSpaceIndex < maxCharacters) {
      shortened = shortened.substr(0, lastSpaceIndex);
    }

    if (textContent.length > maxCharacters) {
      shortened += '...';
    }

    // Re-sanitize and set the shortened content.
    // This does not preserve HTML formatting since it might introduce complexity with unmatched tags.
    // If preserving HTML tags up to the truncation point is critical, a more sophisticated approach is needed.
    const sanitizedShortenedContent = DOMPurify.sanitize(shortened);
    setShortenedContent(sanitizedShortenedContent);
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: shortenedContent }} />;
}

const News = () => {
  const { state } = useRouteContext();

  const { routes } = state;

  const { posts, listPosts, getPostById, loading } = useGlobalContext();

  useEffect(() => {
    listPosts();

    /*     console.log(posts); */
  }, []);

  const navigate = useNavigate();

  const onClickHandler = (id, title) => {
    // Shorten the title to first 5 words and replace spaces with hyphens
    const shortenedTitle = title.split(' ').slice(0, 5).join('-').toLowerCase();
    // Navigate to the news detail page with newsId and shortened title

    getPostById(id, shortenedTitle);
    navigate(`/news/${shortenedTitle}`);
  };

  return (
    <section className='news container'>
      {/*     <h2>{routes.news}</h2> */}
      {loading ? (
        <Loader />
      ) : (
        posts.map((news) => (
          <div className='news-content'>
            <div className='news-header'>
              <h3
                className='h3'
                onClick={() => onClickHandler(news._id, news.title)}
              >
                {news.title}
              </h3>
              <span className='news-date'>
                {moment(news.scheduledPublishTime).format('DD MMMM YYYY')}
              </span>
            </div>
            <div className='news-body'>
              {news.featured && (
                <div className=' '>
                  <img src={news.featured} alt='news '></img>
                </div>
              )}
              <div className='news-description'>
                <ContentComponent content={news.content} />
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default News;
