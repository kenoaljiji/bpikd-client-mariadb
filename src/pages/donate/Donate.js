import React, { useEffect, useState } from "react";

import { useRouteContext } from "../../context/route/RouteProvider";
import { useGlobalContext } from "../../context/bpikd/GlobalState";
import { ContentComponent } from "../../components/ContentComponent";

/* export function ContentComponent({ content }) {
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
} */

const Donate = () => {
  const { state } = useRouteContext();

  const { posts, listPosts, getPostById } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listPosts(setLoading, "Button1");

    //eslint-disable-next-line
  }, []);

  const onClickHandler = async (id, title) => {
    // Shorten the title to the first 5 words and replace spaces with hyphens
    const shortenedTitle = title.split(" ").slice(0, 5).join("-").toLowerCase();
    // Wait for getPostById to complete before navigating
    await getPostById(id, "news", setLoading, shortenedTitle);
  };

  return (
    <section className="news container">
      {posts?.map((news) => {
        if (news.isPublished) {
          return (
            <div className="news-content box" key={news.id}>
              <div className="news-header mt-2">
                <h3
                  className="h3"
                  /*   onClick={() => onClickHandler(news.id, news.title)} */
                >
                  {news.title}
                </h3>
                {/*  <span className='news-date'>
                  {moment(news?.scheduledPublishTime).format('DD MMMM YYYY')}
                </span> */}
              </div>
              <div className="news-body">
                {news.featured && (
                  <div className="featured-images">
                    <img src={news.featured} alt="news "></img>
                  </div>
                )}
                <div className="news-description">
                  <ContentComponent content={news.content} />
                </div>
              </div>
            </div>
          );
        }
      })}
    </section>
  );
};
export default Donate;
