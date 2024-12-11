import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ species: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const allData = [];
    let page = 1;
    while (allData.length < 300) {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
      const data = await response.json();
      allData.push(...data.results);
      page++;
    }
    setData(allData.slice(0, 300));
  };

  const handleRowClick = (character) => {
    setSelectedCharacter(character);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredData = data.filter((character) => {
    return (
      (filters.species ? character.species.toLowerCase().includes(filters.species.toLowerCase()) : true) &&
      (filters.status ? character.status.toLowerCase().includes(filters.status.toLowerCase()) : true)
    );
  });

  const paginateData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getPageRange = () => {
    const startPage = Math.max(currentPage - 5, 1);
    const endPage = Math.min(currentPage + 5, totalPages);
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handlePageSkip = (direction) => {
    let newPage = currentPage + direction * 5;
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    const pageNumbers = getPageRange();

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageSkip(-1)}
          disabled={currentPage === 1}
        >
          Previous 5
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? 'active' : ''}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageSkip(1)}
          disabled={currentPage === totalPages}
        >
          Next 5
        </button>
      </div>
    );
  };

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Species</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginateData.map((character) => (
            <tr key={character.id} onClick={() => handleRowClick(character)}>
              <td>{character.id}</td>
              <td>{character.name}</td>
              <td>{character.species}</td>
              <td>{character.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCharacterDetails = () => {
    if (!selectedCharacter) return null;
    return (
      <div className="character-details">
        <h3>{selectedCharacter.name}</h3>
        <img src={selectedCharacter.image} alt={selectedCharacter.name} />
        <p><strong>Status:</strong> {selectedCharacter.status}</p>
        <p><strong>Species:</strong> {selectedCharacter.species}</p>
        <p><strong>Gender:</strong> {selectedCharacter.gender}</p>
        <p><strong>Origin:</strong> {selectedCharacter.origin.name}</p>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Rick and Morty Characters</h1>
      
      <div className="filter-container">
        <div>
          <label>Species:</label>
          <input
            type="text"
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      {filteredData.length > 0 ? (
        renderTable()
      ) : (
        <p>No characters match the filter.</p>
      )}

      {renderCharacterDetails()}

      {renderPagination()}
    </div>
  );
};

export default App;
