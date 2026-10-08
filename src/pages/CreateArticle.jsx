import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/useAuth";

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
    <main className="create-article-page">
      <header className="create-article__header">
        <h1>Create article</h1>
        <p>Write your report and set how it appears in the feed.</p>
      </header>

      <form className="create-article__form" onSubmit={handleSubmit}>
        <section className="create-article__editor" aria-label="Article content">
          <div className="create-article__field create-article__field--title">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="create-article__field">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              rows="3"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
            />
          </div>

          <div className="create-article__field create-article__field--content">
            <label htmlFor="content">Article body</label>
            <textarea
              id="content"
              rows="18"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </div>

          <section className="create-article__settings" aria-label="Publication details">
            <h2>Publication details</h2>

            <div className="create-article__settings-fields">
              <div className="create-article__field">
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
              </div>

              <div className="create-article__field">
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
              </div>

              <div className="create-article__field">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
              </div>
            </div>

            <button
              className="create-article__submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish article"}
            </button>
          </section>
        </section>
      </form>

      {error && <p className="create-article__error" role="alert">{error}</p>}
    </main>
  );
}