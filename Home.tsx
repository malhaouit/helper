import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Online Event Finder</h1>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}

export default Home;
