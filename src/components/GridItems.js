import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { slugify } from "../utils/slugify";

import "swiper/css/bundle"; // Import all Swiper styles
import "./styles/GridItems.scss";
import "slick-carousel/slick/slick.css";

import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import { useSortedItemsContext } from "../context/sortedItems/SortedItemsProvider";
import { useGlobalContext } from "../context/bpikd/GlobalState";

const GridItems = () => {
  const navigate = useNavigate();

  const { sortedItems, getSortedItems } = useSortedItemsContext();

  const { listAuthors, authors } = useGlobalContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listAuthors(setLoading);
  }, []);

  useEffect(() => {
    console.log(authors);
  }, [authors]);

  const { firstRowItems, secondRowItems } = sortedItems;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    spaceBetween: 15,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      // Breakpoint for max-width 1200px: 4 items
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      // Breakpoint for max-width 992px (adjusted for common usage): 2 items
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 3,
        },
      },
      // Breakpoint for all screens below 768px: 1 item
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "transparent" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "transparent" }}
        onClick={onClick}
      />
    );
  }

  const sliderRef = React.createRef(null); // Create a ref for the slider

  return (
    <div className="authors">
      <div className="container-md pb-4">
        <div className={"flex-center mb-3"}>
          <div
            className="img-container"
            onClick={() =>
              navigate(
                `/author/${slugify(
                  firstRowItems?.firstName + "-" + firstRowItems?.lastName
                )}`
              )
            }
          >
            <img src={firstRowItems?.featured} alt="" />
            <h5>
              {firstRowItems?.firstName} <br /> {firstRowItems?.lastName}
            </h5>
          </div>
        </div>

        <div className="grid mb-4">
          {secondRowItems?.map((author, index) => {
            const { firstName, lastName } = author;

            const fullName = slugify(author.firstName + "-" + author.lastName);
            return (
              <div
                className={`items div${index + 1}`}
                onClick={() => navigate(`/author/${fullName}`)}
                key={author.id + "e5er45"}
              >
                <div className="img-container">
                  <img src={author?.featured} alt="" />
                  <h5>
                    {firstName} <br /> {lastName}
                  </h5>
                </div>
              </div>
            );
          })}
        </div>
        <div className="custom-slider">
          <Slider {...settings} ref={sliderRef}>
            {authors?.map((author, index) => {
              const { firstName, lastName } = author;

              const fullName = slugify(
                author.firstName + "-" + author.lastName
              );
              return (
                <div
                  key={author.id}
                  className="slide-item"
                  onClick={() => navigate(`/author/${slugify(fullName)}`)}
                >
                  <div className="img-container">
                    <img src={author?.featured} alt="" />
                    <h5>
                      {firstName}
                      <br />
                      {lastName}
                    </h5>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default GridItems;
