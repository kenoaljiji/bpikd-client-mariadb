import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/bpikd/GlobalState";
import { ContentComponent } from "../../components/ContentComponent";

const Button2Page = () => {
  const { posts, listPosts, singlePost, listPages } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listPages(setLoading, "button2");
  }, []);
  return (
    <section className="container">
      <h2 className="pb-3 border-bottom border-gray">{singlePost?.title}</h2>
      <div className="news-description">
        <ContentComponent content={singlePost?.content} />
      </div>
    </section>
  );
};

export default Button2Page;
