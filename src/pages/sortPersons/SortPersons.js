import React from 'react';
import PersonSortSearch from '../../components/personSortSearch/PersonSortSearch';

const SortPersons = () => {
  return (
    <div className='persons mt-5'>
      <div className='text-center my-5'>
        <h3>Sort Persons</h3>
      </div>

      <div className='container'>
        <PersonSortSearch />
      </div>
    </div>
  );
};

export default SortPersons;
