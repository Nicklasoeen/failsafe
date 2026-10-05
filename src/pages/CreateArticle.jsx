import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function CreateArticle() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("Incidents");
  const [articleType, setArticleType] = useState("NEWS");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { data, error: insertError } = await supabase
      .from("articles")
      .insert({
        title,
        excerpt,
        content,
        image_url: imageUrl || null,
        category,
        article_type: articleType,
        author_id: user.id,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    navigate(`/article/${data.id}`);
  };

  return (
    <main>
      <h1>Create article</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <label htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
        />

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="Incidents">Incidents</option>
          <option value="Security">Security</option>
          <option value="Research">Research</option>
          <option value="Policy">Policy</option>
          <option value="Work">Work</option>
          <option value="Society">Society</option>
        </select>

        <label htmlFor="articleType">Article type</label>
        <select
          id="articleType"
          value={articleType}
          onChange={(event) => setArticleType(event.target.value)}
        >
          <option value="NEWS">News</option>
          <option value="INCIDENT">Incident</option>
          <option value="ANALYSIS">Analysis</option>
          <option value="RESEARCH">Research</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish article"}
        </button>
      </form>

      {error && <p>{error}</p>}
    </main>
  );
}