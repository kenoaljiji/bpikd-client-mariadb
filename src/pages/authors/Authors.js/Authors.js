import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authors } from "../../../helpers/people";

const Authors = () => {
  const [author, setAuthor] = useState();

  const { id } = useParams();

  useEffect(() => {
    const newAuthor = authors.find((author) => author.id === parseInt(id));

    setAuthor(newAuthor);
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="authors">
      {/*   <div className='container'>
        <h2>{author?.person}</h2>
      </div> */}
      <div className="container pt-4">
        <div className="row d-flex items-center">
          <div className="col-md-3 col-sm-12">
            <img src={author?.src} alt="" />
          </div>
          <div className="col-md-6  mt-sm-3 mt-md-0">
            <p className="">{author?.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Authors;
