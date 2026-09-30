import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <header>
      <Link to="/">FAILSAFE</Link>

      <nav>
        <Link to="/">Home</Link>

        {user ? (
          <>
            <Link to="/create">Create article</Link>
            <button type="button" onClick={signOut}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}