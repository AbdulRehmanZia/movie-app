import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
      <div>
        <img src='./../../public/search.svg'/>
        <input
        className='text-white'
        type='text'
        placeholder='Search Cool Movies'
        value={searchTerm}
        onChange={(e)=> setSearchTerm(e.target.value)}
        ></input>
      </div>
    </div>
  )
}

export default Search
