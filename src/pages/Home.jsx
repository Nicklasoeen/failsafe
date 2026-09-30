import { Link } from "react-router";

export default function Home() {
	return (
		<main>
			<h1>Failsafe</h1>
			<p>No articles have been published yet.</p>
			<p>
				<Link to="/login">Log in</Link> or{" "}
				<Link to="/register"> create an account</Link> to get started.
			</p>
		</main>
	);
}
