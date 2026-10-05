import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error: fetchError } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          excerpt,
          image_url,
          category,
          article_type,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setArticles(data);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <main>Loading articles...</main>;
  }

  if (error) {
    return (
      <main>
        <h1>Could not load articles</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>FAILSAFE</h1>

      <p>
        Independent reporting on AI safety, autonomy, and emerging risks.
      </p>

      <section>
        <h2>Latest</h2>

        {articles.length === 0 ? (
          <p>No articles published yet.</p>
        ) : (
          articles.map((article) => (
            <article key={article.id}>
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt=""
                />
              )}

              <p>
                {article.article_type} · {article.category}
              </p>

              <h3>
                <Link to={`/article/${article.id}`}>
                  {article.title}
                </Link>
              </h3>

              {article.excerpt && <p>{article.excerpt}</p>}
            </article>
          ))
        )}
      </section>
    </main>
  );
}