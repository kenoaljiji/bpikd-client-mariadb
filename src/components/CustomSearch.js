import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomSearch = ({ type }) => {
  const [value, setValue] = useState('');

  const navigate = useNavigate();

  const onClickHandeler = () => {
    navigate(`/search?q=${value}`);
  };
  return (
    <form
      className={`d-flex items-center mx-2 ${type}`}
      onSubmit={(e) => {
        e.preventDefault(e);
        onClickHandeler();
      }}
    >
      <input
        type='text'
        className='mx-2'
        aria-label='Search'
        value={value}
        onChange={(e) => {
          e.preventDefault(e);
          setValue(e.target.value);
        }}
        placeholder='Search'
        style={{
          border: '0',
          borderBottom: '2px solid #2e2b2b',
          outline: 'none',
        }}
      />
      <svg
        onClick={() => onClickHandeler()}
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M22.1333 24L13.7333 15.6C13.0667 16.1333 12.3 16.5556 11.4333 16.8667C10.5667 17.1778 9.64444 17.3333 8.66667 17.3333C6.24444 17.3333 4.19467 16.4942 2.51733 14.816C0.84 13.1378 0.000888889 11.088 0 8.66667C0 6.24444 0.839111 4.19467 2.51733 2.51733C4.19556 0.84 6.24533 0.000888889 8.66667 0C11.0889 0 13.1391 0.839111 14.8173 2.51733C16.4956 4.19556 17.3342 6.24533 17.3333 8.66667C17.3333 9.64444 17.1778 10.5667 16.8667 11.4333C16.5556 12.3 16.1333 13.0667 15.6 13.7333L24 22.1333L22.1333 24ZM8.66667 14.6667C10.3333 14.6667 11.7502 14.0836 12.9173 12.9173C14.0844 11.7511 14.6676 10.3342 14.6667 8.66667C14.6667 7 14.0836 5.58356 12.9173 4.41733C11.7511 3.25111 10.3342 2.66756 8.66667 2.66667C7 2.66667 5.58356 3.25022 4.41733 4.41733C3.25111 5.58444 2.66756 7.00089 2.66667 8.66667C2.66667 10.3333 3.25022 11.7502 4.41733 12.9173C5.58444 14.0844 7.00089 14.6676 8.66667 14.6667Z'
          fill='#093A41'
        />
      </svg>
    </form>
  );
};

export default CustomSearch;
