import React from 'react';

export default function TodosViewForm({
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  function preventRefresh() {
    event.preventDefault();
  }
  return (
    <form onSubmit={preventRefresh}>
      <div>
          <label htmlFor="searchTodos">Search Todos:</label>{' '}
        <input
          id="searchTodos"
          type="text"
          value={queryString}
          onChange={(e) => setQueryString(e.target.value)}
          placeholder="Find todos..."
        />
        <button onClick={() => setQueryString('')}>Clear</button>
      </div>

      <div>
        <label htmlFor="sortField">Sort by</label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>
        <label htmlFor="sortDirection" style={{ marginLeft: '1rem' }}>
          Direction
        </label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}
