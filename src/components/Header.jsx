import { Link, NavLink } from "react-router";
import { useAuth } from "../context/useAuth";

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
          <NavLink to="/" end>Latest</NavLink>

          {user ? (
            <>
              <NavLink
                to="/create"
                end
                className="site-nav__create"
              >
                Create article
              </NavLink>

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
              <NavLink to="/login" end>
                Log in
              </NavLink>

              <NavLink
                to="/register"
                end
                className="site-nav__register"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}