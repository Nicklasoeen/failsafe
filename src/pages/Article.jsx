import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/useAuth";
import { supabase } from "../lib/supabase";

function formatArticleDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function Article() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error: fetchError } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setArticle(data);
      setLoading(false);
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("articles")
      .delete()
      .eq("id", article.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    navigate("/");
  };

  if (loading) {
    return (
      <main className="article-page article-page--status">
        <p>Loading article...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="article-page article-page--status">
        <h1>Could not load article</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="article-page">
      <article className="article-detail">
        <header className="article-detail__header">
          <p className="article-detail__meta">
            {article.article_type} <span aria-hidden="true">·</span> {article.category}
          </p>

          <h1>{article.title}</h1>

          {article.excerpt && (
            <p className="article-detail__excerpt">{article.excerpt}</p>
          )}

          <div className="article-detail__byline">
            {article.created_at && (
              <time dateTime={article.created_at}>
                {formatArticleDate(article.created_at)}
              </time>
            )}

            {user?.id === article.author_id && (
              <button
                className="article-detail__delete"
                type="button"
                onClick={handleDelete}
              >
                Delete article
              </button>
            )}
          </div>
        </header>

      {article.image_url && (
          <figure className="article-detail__figure">
            <img src={article.image_url} alt="" />
          </figure>
      )}

        <div className="article-detail__body">{article.content}</div>
      </article>
    </main>
  );
}