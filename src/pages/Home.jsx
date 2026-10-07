import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";

function formatArticleDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

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
    return <main className="home-page">Loading articles...</main>;
  }

  if (error) {
    return (
      <main className="home-page">
        <h1>Could not load articles</h1>
        <p>{error}</p>
      </main>
    );
  }

  const featuredArticle = articles[0];
  const latestArticles = articles.slice(1);

  return (
    <main className="home-page">
      {featuredArticle && (
        <section
          className={`featured-story${
            featuredArticle.image_url ? "" : " featured-story--no-image"
          }`}
          aria-labelledby="featured-title"
        >
          <div className="featured-story__content">
            <p className="featured-story__label">Featured</p>

            <p className="article-meta">
              {featuredArticle.article_type} · {featuredArticle.category}
            </p>

            <h1 id="featured-title">
              <Link
                to={`/article/${featuredArticle.id}`}
              >
                {featuredArticle.title}
              </Link>
            </h1>

            {featuredArticle.excerpt && (
              <p className="featured-story__excerpt">
                {featuredArticle.excerpt}
              </p>
            )}

            <p className="article-date">
              {formatArticleDate(featuredArticle.created_at)}
            </p>

            <Link
              to={`/article/${featuredArticle.id}`}
              className="featured-story__link"
            >
              Read article <span aria-hidden="true">→</span>
            </Link>
          </div>

          {featuredArticle.image_url && (
            <Link
              to={`/article/${featuredArticle.id}`}
              className="featured-story__image"
            >
              <img
                src={featuredArticle.image_url}
                alt=""
              />
            </Link>
          )}
        </section>
      )}

      <section className="latest-section">
        <div className="section-heading">
          <h2>Latest reports</h2>
        </div>

        {latestArticles.length > 0 ? (
          <div className="article-grid">
            {latestArticles.map((article) => (
              <article
                className="article-card"
                key={article.id}
              >
                {article.image_url && (
                  <Link to={`/article/${article.id}`}>
                    <img
                      src={article.image_url}
                      alt=""
                      className="article-card__image"
                    />
                  </Link>
                )}

                <p className="article-meta">
                  {article.article_type} · {article.category}
                </p>

                <h3>
                  <Link to={`/article/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>

                {article.excerpt && (
                  <p className="article-card__excerpt">
                    {article.excerpt}
                  </p>
                )}

                <p className="article-date">
                  {formatArticleDate(article.created_at)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="latest-section__empty">No other reports yet.</p>
        )}
      </section>
    </main>
  );
}