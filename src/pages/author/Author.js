import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TabContent from '../../components/tabNavContent/TabContent';
/* import { authors } from '../../helpers/people'; */
import '../author/author.scss';
import VideoModal from '../../components/VideoModal/VideoModal';
import { slugify } from '../../utils/slugify';
import { useGlobalContext } from '../../context/bpikd/GlobalState';
import { localhost } from '../../config/config';
import axios from 'axios';
import moment from 'moment';
import Loader from '../../components/loader/Loader';

const displayContentWithLineBreaks = (content) => {
  return content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

const Authors = () => {
  const { authors, listAuthors } = useGlobalContext();
  const [loading, setLoading] = useState();
  const [author, setAuthor] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedTab, setSelectedTab] = useState('releases');
  const [openWorkItems, setOpenWorkItems] = useState([]);
  const [openWorkIndex, setOpenWorkIndex] = useState(-1);
  const [isVideoGalleryOpen, setIsVideoGalleryOpen] = React.useState(false);
  const [expandedWorkId, setExpandedWorkId] = useState(null);
  const [smallLoading, setSmallLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (authors && authors.length === 0) {
      listAuthors(setLoading);
    }
  }, []);

  useEffect(() => {
    const slugFromUrl = id; // 'id' is the slug from URL params
    // Decode the slug to handle URL encoded characters
    const decodedSlug = decodeURIComponent(slugFromUrl);

    // Attempt to find the author in the state by comparing slugs
    const foundAuthor = authors.find((author) => {
      const authorSlug = slugify(`${author.firstName} ${author.lastName}`);
      return authorSlug === decodedSlug;
    });

    // If the author is found, use their _id to fetch detailed data
    if (foundAuthor) {
      const authorId = foundAuthor.id;

      fetchAuthorDataById(authorId);
    }
  }, [authors, id]);

  const fetchAuthorDataById = async (authorId) => {
    try {
      setLoading(true); // Assuming you have a setLoading function to handle loading state
      const response = await axios.get(
        `${localhost}/post/persons/data/${authorId}`
      );
      const data = response.data;

      setAuthor(data);
      // Handle setting works and other states as needed
    } catch (error) {
      console.error('Failed to fetch author data:', error);
      // Handle errors
    } finally {
      setLoading(false); // Ensure loading state is updated regardless of request outcome
    }
  };

  useEffect(() => {
    if (author && author.works) {
      /* setSelectedWork(author.works[0]); */

      setOpenWorkItems(new Array(author.works.length).fill(false));
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
  }, [id]);

  useEffect(() => {
    /*  window.scrollTo(180, 180); */
  }, [openWorkIndex]);

  useEffect(() => {
    const handleScroll = () => {
      // Update the scroll position state when the user scrolls
      const currentPosition = window.scrollY;
    };

    // Add event listener for the scroll event
    window.addEventListener('scroll', handleScroll);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty de

  const { title } = useParams();

  const toggleTextDisplay = (work) => {
    const id = work.workId;

    if (expandedWorkId === id) {
      setExpandedWorkId(null); // Collapse if it's already expanded
    } else {
      setExpandedWorkId(id); // Expand this item
      fetchWorkDetails(work.workId);
    }
  };

  const fetchWorkDetails = async (workId) => {
    if (!workId) {
      return;
    }
    try {
      setSmallLoading(true);
      const res = await axios.get(`${localhost}/post/persons/works/${workId}`);
      setSelectedWork(res.data);
      /*    setSelectedWork(res.data); */
    } catch (err) {
      console.error('Error fetching work details:', err);
    }
    setSmallLoading(false);
  };

  useEffect(() => {
    // Find the work by title
    if (title) {
      const work = author?.works?.map((work, index) => {
        if (slugify(work.title) === title) {
          setExpandedWorkId(work.workId);
          /* setSelectedWork(work); */
          setOpenWorkIndex(openWorkIndex === index ? -1 : index);
        }
      });
    }
  }, [title, author]); // Effect dependencies

  const handleWorkClick = (index) => {
    setSelectedWork(author?.works[index]);
    setSelectedTab('releases');

    setOpenWorkIndex(openWorkIndex === index ? -1 : index);
    /* scrollToElement(index); */
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  /*   useEffect(() => {
    console.log(author);
  }, [author]); */

  const svgEye = () => (
    <svg
      width='21px'
      height='21px'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M1.5 12c0-2.25 3.75-7.5 10.5-7.5S22.5 9.75 22.5 12s-3.75 7.5-10.5 7.5S1.5 14.25 1.5 12zM12 16.75a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM14.7 12a2.7 2.7 0 1 1-5.4 0 2.7 2.7 0 0 1 5.4 0z'
        fill='#000000'
      />
    </svg>
  );

  const scrollToElement = (index) => {
    const element = document.getElementById('tabBody');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className='author'>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className='container d-flex'>
            <div
              className='d-flex'
              style={{ gap: '10px', width: '100%', maxWidth: '1068px' }}
            >
              {author && (
                <div className='box'>
                  <div className='item-1'>
                    <img src={author?.featured} alt='persons' />
                  </div>
                  <div className='item-2'>
                    <p>{displayContentWithLineBreaks(author?.aboutPerson)}</p>{' '}
                    <div className='counter-date'>
                      <span style={{ marginRight: '5px' }}>
                        {author?.personViewCount}
                      </span>
                      {svgEye()}
                      <span>{`${moment(author?.createdAt).format(
                        'HH:mm DD.MM.YYYY'
                      )}`}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='container'>
            <div className='works'>
              <div className=''>
                <div>
                  {author?.works?.map((work, index) =>
                    work.isPublished ? (
                      <>
                        <a
                          key={'work' + work.id}
                          className='link'
                          onClick={(e) => {
                            handleWorkClick(index);
                            e.stopPropagation();
                            toggleTextDisplay(work);
                          }}
                          style={{ cursor: 'pointer', display: 'flex' }}
                        >
                          <span
                            className={index === openWorkIndex ? 'active' : ''}
                            style={{
                              minWidth: '263px',
                            }}
                            /* onClick={(e) => {
                              e.stopPropagation(); // Prevent the click from triggering the onClick of the parent
                              toggleTextDisplay(work.id);
                            }} */
                          >
                            {expandedWorkId !== work.workId &&
                            work.title.length > 27
                              ? `${work.title.slice(0, 27)}...`
                              : work.title}
                          </span>

                          <span
                            className={`arrow ${
                              index === openWorkIndex ? 'down' : 'up'
                            }`}
                          ></span>
                        </a>
                        {selectedWork && (
                          <div
                            className={`selected-work ${
                              index === openWorkIndex ? 'open' : 'close'
                            }`}
                          >
                            <div className=''>
                              <div className='tab-header'>
                                <div className='nav-tabs'>
                                  <button
                                    className={
                                      selectedTab === 'releases'
                                        ? 'selected'
                                        : ''
                                    }
                                    onClick={() => handleTabClick('releases')}
                                  >
                                    Releases
                                    <span className='arrow'>&#9660;</span>
                                  </button>
                                  <button
                                    className={
                                      selectedTab === 'documents'
                                        ? 'selected'
                                        : ''
                                    }
                                    onClick={() => handleTabClick('documents')}
                                  >
                                    Documents
                                    <span className='arrow'>&#9660;</span>
                                  </button>
                                  <button
                                    className={
                                      selectedTab === 'images' ? 'selected' : ''
                                    }
                                    onClick={() => handleTabClick('images')}
                                  >
                                    Images
                                    <span className='arrow'>&#9660;</span>
                                  </button>
                                  <button
                                    className={
                                      selectedTab === 'audio' ? 'selected' : ''
                                    }
                                    onClick={() => handleTabClick('audio')}
                                  >
                                    Audio
                                    <span className='arrow'>&#9660;</span>
                                  </button>
                                  <button
                                    className={
                                      selectedTab === 'video' ? 'selected' : ''
                                    }
                                    onClick={() => handleTabClick('video')}
                                  >
                                    Video
                                    <span className='arrow'>&#9660;</span>
                                  </button>
                                </div>
                              </div>
                              <div className='tab-body' id='tabBody'>
                                <TabContent
                                  tab={selectedTab}
                                  selectedWork={selectedWork}
                                  openModal={handleOpenModal}
                                  closeModal={handleCloseModal}
                                  isPlaying={isVideoPlaying}
                                  setIsPlaying={setIsVideoPlaying}
                                  smallLoading={smallLoading}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>

          <VideoModal
            closeModal={handleCloseModal}
            isVideoGalleryOpen={isVideoGalleryOpen}
            isPlaying={isVideoPlaying}
            setIsPlaying={setIsVideoPlaying}
          />
        </>
      )}
    </section>
  );
};

export default Authors;
