import React from 'react';
import { Link } from 'react-router-dom';
import './searchInfo.scss';

const SearchInfo = () => {
  return (
    <div className='search-info'>
      <div className='container'>
        <h2 className='my-3'>Search tips</h2>
      </div>
      <div className='container'>
        <p>
          Search operators can help narrow your search. Many of these can be
          used by selecting options on the Advanced Search page, but using the
          operators directly in the search box may give you additional
          flexibility. Some operators allow you to be more precise in your
          search parameters - for instance, you may specify that results do not
          contain certain words. Some operators can also allow you to be more
          vague in your search parameters - for instance by specifying that all
          matching documents must contain a certain number of some given words.
        </p>
        <p>
          {' '}
          The operators must be typed into the usual search box (the simple
          search box or top search box in the advanced search), and most of them
          can be combined with other search operators.
        </p>
        <h4 className='my-4'>Search operators</h4>
        <div className='container my-3'>
          <p>
            <span style={{ fontWeight: 'bold' }}>Search all terms: </span> The
            search will automatically yield results containing all words entered
            in the search box, unless the query is expressly limited by other
            operators. Terms will also automatically be matched with their
            stemmed keyword. For instance, entering
          </p>
          <div class='testquery'>
            <div className='textquery-item'>
              <pre>Nele Clee</pre>
              {/* <span>
              <Link to='/search?q=words=nele%2Clee'>test query</Link>
            </span> */}
            </div>
            <p className='mt-3'>
              will match both pages containing the word elected and the word
              official, as well as pages with words such as elect or electing
              along with the word official.
            </p>
          </div>
        </div>
        <div className='container my-3'>
          <p>
            <span style={{ fontWeight: 'bold' }}>Search phrase: </span> Entering
            a phrase will search for the words in sequence. For instance,
            entering
          </p>
          <div class='testquery'>
            <div className='textquery-item'>
              <pre>This person achive the best results</pre>
              {/* <span>
              <Link to='/search?q=words=nele%2Clee'>test query</Link>
            </span> */}
            </div>
            <p className='mt-3'>
              will yield results which contain the words This person achive the
              best results
            </p>
          </div>
        </div>
        <div className='container my-3'>
          <p>
            <span style={{ fontWeight: 'bold' }}>Any of this words (",") </span>
          </p>
          <div class='testquery'>
            <div className='textquery-item'>
              <pre>James,Mark</pre>
              {/* <span>
              <Link to='/search?q=words=nele%2Clee'>test query</Link>
            </span> */}
            </div>
            <p className='mt-3'>
              will yield results which will include the words James, Mark
            </p>
          </div>
        </div>
        <div className='container my-3'>
          <p>
            <span style={{ fontWeight: 'bold' }}>
              Exclude words with seperator (","){' '}
            </span>
          </p>
          <div class='testquery'>
            <div className='textquery-item'>
              <pre>James,Mark</pre>
              {/* <span>
              <Link to='/search?q=words=nele%2Clee'>test query</Link>
            </span> */}
            </div>
            <p className='mt-3'>
              will yield results which will exclude the words James, Mark. You
              can also exclude one word
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInfo;
