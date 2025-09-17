import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.25rem 0.5rem 12.5rem;
  margin-top: 0;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
`;

const FiltersRow = styled(Row)`
  & > select {
    min-width: 8rem;
    max-width: 12rem;
  }
`;
export default function TodosViewForm({
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  function preventRefresh() {
    event.preventDefault();
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);
    return () => clearTimeout(debounce);
  }, [localQueryString]);

  return (
    <StyledForm onSubmit={preventRefresh}>
      <div>
        <Row>
          <label htmlFor="searchTodos">Search Todos:</label>{' '}
          <input
            id="searchTodos"
            type="text"
            value={localQueryString}
            onChange={(e) => setLocalQueryString(e.target.value)}
            placeholder="Find todos..."
          />
          <button onClick={() => setLocalQueryString('')}>Clear</button>
        </Row>
      </div>

      <div>
        <FiltersRow>
          <label htmlFor="sortField">Sort by: </label>
          <select
            id="sortField"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
          <label htmlFor="sortDirection" style={{ marginLeft: '1rem' }}>
            Direction:{' '}
          </label>
          <select
            id="sortDirection"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </FiltersRow>
      </div>
    </StyledForm>
  );
}
