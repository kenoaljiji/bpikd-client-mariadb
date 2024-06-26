import React, { useState } from 'react';
import './styles/Search.scss';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [value, setValue] = useState('');

  const navigate = useNavigate();

  const onSubmit = () => {
    if (value !== '') {
      navigate(`/search?words=${value}&sort=relevance&page=1`);
    } else navigate(`/search?words=${value}`);
  };

  return (
    <div className='container search'>
      <form className='' onSubmit={onSubmit}>
        <div className='text-center position-relative'>
          <input
            className=''
            type='search'
            placeholder='Search Keywords'
            aria-label='Search'
            style={{ maxWidth: '700px', padding: '5px' }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <img
            src='/assets/images/magnifier-green.png'
            alt=''
            onClick={onSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default Search;
