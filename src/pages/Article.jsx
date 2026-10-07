import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

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
    return <main>Loading article...</main>;
  }

  if (error) {
    return (
      <main>
        <h1>Could not load article</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main>
      <p>{article.article_type}</p>

      <h1>{article.title}</h1>

      {article.excerpt && <p>{article.excerpt}</p>}

      <p>{article.category}</p>

      {user?.id === article.author_id && (
        <button type="button" onClick={handleDelete}>
          Delete article
        </button>
      )}

      {article.image_url && (
        <img src={article.image_url} alt="" />
      )}

      <div>{article.content}</div>
    </main>
  );
}