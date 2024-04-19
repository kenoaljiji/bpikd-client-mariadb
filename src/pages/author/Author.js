import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TabContent from "../../components/tabNavContent/TabContent";
/* import { authors } from '../../helpers/people'; */
import "../author/author.scss";
import VideoModal from "../../components/VideoModal/VideoModal";
import { slugify } from "../../utils/slugify";
import { useGlobalContext } from "../../context/bpikd/GlobalState";
import { localhost } from "../../config/config";
import axios from "axios";
import moment from "moment";
import Loader from "../../components/loader/Loader";

const displayContentWithLineBreaks = (content) => {
  return content.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

const Authors = () => {
  const { authors } = useGlobalContext();
  const [loading, setLoading] = useState();
  const [author, setAuthor] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedTab, setSelectedTab] = useState("releases");
  const [openWorkItems, setOpenWorkItems] = useState([]);
  const [openWorkIndex, setOpenWorkIndex] = useState(-1);
  const [isVideoGalleryOpen, setIsVideoGalleryOpen] = React.useState(false); // State for modal visibility
  const [expandedWorkId, setExpandedWorkId] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const slugFromUrl = id; // 'id' is the slug from URL params
    // Decode the slug to handle URL encoded characters
    const decodedSlug = decodeURIComponent(slugFromUrl);

    // Attempt to find the author in the state by comparing slugs
    const foundAuthor = authors.find((author) => {
      const authorSlug = slugify(`${author.firstName} ${author.lastName}`);
      return authorSlug === decodedSlug;
    });

    console.log(foundAuthor);

    // If the author is found, use their _id to fetch detailed data
    if (foundAuthor) {
      console.log(foundAuthor);
      const authorId = foundAuthor.id;

      fetchAuthorDataById(authorId);
      console.log("fetched");
    }
  }, [authors, id]);

  const fetchAuthorDataById = async (authorId) => {
    try {
      setLoading(true); // Assuming you have a setLoading function to handle loading state
      const response = await axios.get(
        `${localhost}/post/persons/data/${authorId}`
      );
      const data = response.data;

      setAuthor(data); // Assuming you have a setAuthor function to update the author state
      // Handle setting works and other states as needed
    } catch (error) {
      console.error("Failed to fetch author data:", error);
      // Handle errors
    } finally {
      setLoading(false); // Ensure loading state is updated regardless of request outcome
    }
  };

  useEffect(() => {
    if (author && author.works) {
      setSelectedWork(author.works[0]);
      console.log(author);
      setOpenWorkItems(new Array(author.works.length).fill(false)); // Init with the length of works
      setOpenWorkIndex(-1);
    } else {
      // Reset states if author or works are not available
      setSelectedWork(null);
      setOpenWorkItems([]);
      setOpenWorkIndex(-1);
    }
  }, [author]);

  const handleOpenModal = () => setIsVideoGalleryOpen(true);
  const handleCloseModal = () => setIsVideoGalleryOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log();
  }, [id]);

  useEffect(() => {
    /*  window.scrollTo(180, 180); */
  }, [openWorkIndex]);

  useEffect(() => {
    const handleScroll = () => {
      // Update the scroll position state when the user scrolls
      const currentPosition = window.scrollY;

      // Log the scroll position to the console
      console.log("Scroll position:", currentPosition);
    };

    // Add event listener for the scroll event
    window.addEventListener("scroll", handleScroll);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty de

  const toggleTextDisplay = (id) => {
    console.log(expandedWorkId);
    if (expandedWorkId === id) {
      setExpandedWorkId(null); // Collapse if it's already expanded
    } else {
      setExpandedWorkId(id); // Expand this item
    }
  };

  const handleWorkClick = (index) => {
    setSelectedWork(author?.works[index]);
    setSelectedTab("releases"); // Reset tab to 'releases' when selecting a new work
    setOpenWorkIndex(openWorkIndex === index ? -1 : index); // Toggle the open/close state
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <section className="author">
      {loading && <Loader />}
      <div className="container d-flex">
        <div className="d-flex" style={{ gap: "10px" }}>
          {author && (
            <div className="box">
              <div className="">
                <img src={author?.featured} alt="persons" />
              </div>
              <div className="">
                <p>{displayContentWithLineBreaks(author?.aboutPerson)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container">
        <div className="works">
          <div className="">
            <div>
              {author?.works?.map((work, index) => (
                <>
                  <a
                    key={work.id}
                    className="link"
                    onClick={(e) => {
                      handleWorkClick(index);
                      e.stopPropagation(); // Prevent the click from triggering the onClick of the parent
                      toggleTextDisplay(work.id);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={index === openWorkIndex ? "active" : ""}
                      /*   onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from triggering the onClick of the parent
                        toggleTextDisplay(work.id);
                      }} */
                    >
                      {expandedWorkId !== work.id && work.title.length > 10
                        ? `${work.title.slice(0, 10)}...`
                        : work.title}
                    </span>
                    <span style={{ color: "#333333", marginRight: "10px" }}>
                      {` - ${moment(work.scheduledPublishTime).format(
                        "DD MMMM YYYY"
                      )}`}
                    </span>
                    {work.title.length > 10 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the click from triggering the onClick of the parent
                          /*   toggleTextDisplay(work.id); */
                        }}
                        style={{
                          cursor: "pointer",
                          color: "#0087d5",
                          marginLeft: "5px",
                        }}
                      >
                        {/*   {expandedWorkId === work.id ? "Hide" : "Show more"} */}
                      </span>
                    )}
                    <span
                      className={`arrow ${
                        index === openWorkIndex ? "down" : "up"
                      }`}
                    >
                      {/*  &#9660; */}
                    </span>
                  </a>
                  {selectedWork && (
                    <div
                      className={`selected-work ${
                        index === openWorkIndex ? "open" : "close"
                      }`}
                    >
                      <div className="">
                        <div className="tab-header">
                          <div className="nav-tabs">
                            <button
                              className={
                                selectedTab === "releases" ? "selected" : ""
                              }
                              onClick={() => handleTabClick("releases")}
                            >
                              Releases
                              <span className="arrow">&#9660;</span>
                            </button>
                            <button
                              className={
                                selectedTab === "documents" ? "selected" : ""
                              }
                              onClick={() => handleTabClick("documents")}
                            >
                              Documents
                              <span className="arrow">&#9660;</span>
                            </button>
                            <button
                              className={
                                selectedTab === "images" ? "selected" : ""
                              }
                              onClick={() => handleTabClick("images")}
                            >
                              Images
                              <span className="arrow">&#9660;</span>
                            </button>
                            <button
                              className={
                                selectedTab === "audio" ? "selected" : ""
                              }
                              onClick={() => handleTabClick("audio")}
                            >
                              Audio
                              <span className="arrow">&#9660;</span>
                            </button>
                            <button
                              className={
                                selectedTab === "video" ? "selected" : ""
                              }
                              onClick={() => handleTabClick("video")}
                            >
                              Video
                              <span className="arrow">&#9660;</span>
                            </button>
                          </div>
                        </div>
                        <div className="tab-body">
                          <TabContent
                            tab={selectedTab}
                            selectedWork={selectedWork}
                            openModal={handleOpenModal}
                            closeModal={handleCloseModal}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        closeModal={handleCloseModal}
        isVideoGalleryOpen={isVideoGalleryOpen}
      />
    </section>
  );
};

export default Authors;
