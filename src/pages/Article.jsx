import { useParams } from "react-router";

export default function Article() {
	const { id } = useParams();

	return (
		<main>
			<h1>Article</h1>
			<p>Article {id} could not be loaded.</p>
		</main>
	);
}
