import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const {
    user,
    loading,
    signOut,
  } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          to="/"
          className="failsafe-logo"
          aria-label="FAILSAFE home"
        >
          <img src="/failsafe-logo.svg" alt="" />
        </Link>

        <nav
          className="site-nav"
          aria-label="Main navigation"
        >
          <Link to="/">Latest</Link>

          {user ? (
            <>
              <Link
                to="/create"
                className="site-nav__create"
              >
                Create article
              </Link>

              <button
                className="site-nav__button"
                type="button"
                onClick={signOut}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                Log in
              </Link>

              <Link
                to="/register"
                className="site-nav__register"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}