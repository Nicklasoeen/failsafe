import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../lib/supabase";

export default function Article() {
  const { id } = useParams();

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

      {article.image_url && (
        <img src={article.image_url} alt="" />
      )}

      <div>{article.content}</div>
    </main>
  );
}