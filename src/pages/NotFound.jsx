import { Link } from 'react-router-dom';
import '../App.css';

export default function NotFound() {
  return (
    <div className="notfound-container" style={{ marginTop: '0.25rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <img
        src="https://cataas.com/cat/says/404?size=50&color=white"
        alt="Gato gracioso"
        className="notfound-image"
      />
      <Link to="/">
        <button>Go Back Home</button>
      </Link>
    </div>
  );
}
