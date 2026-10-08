import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" aria-label="FAILSAFE home">
            <img src="/failsafe-logo.svg" alt="" />
          </Link>
          <p>Independent reporting on AI safety, autonomy and emerging risks.</p>
        </div>

        <small className="site-footer__copyright">
          © {new Date().getFullYear()} FAILSAFE. All rights reserved.
        </small>
      </div>
    </footer>
  );
}