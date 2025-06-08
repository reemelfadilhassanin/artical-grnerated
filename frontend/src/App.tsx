import { useState } from 'react';
import './App.css';

type Article = {
  headline: string;
  intro: string;
  body: string;
  conclusion: string;
};

function App() {
  const [topic, setTopic] = useState('');
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateArticle = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to generate an article.');
      return;
    }

    setLoading(true);
    setError(null);
    setArticle(null);

    try {
      const res = await fetch('http://localhost:5000/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate the article. Please try again.');
      }

      const data = await res.json();
      setArticle(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="header-container">
        <span className="logo" role="img" aria-label="Magic Wand">
          ✨
        </span>
        <h1 className="header">AI Article Generator</h1>
      </div>

      <input
        type="text"
        placeholder="e.g., The Future of Renewable Energy"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && generateArticle()}
        className="input-field"
        disabled={loading}
      />

      <button
        onClick={generateArticle}
        disabled={loading || !topic}
        className={`generate-btn ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Generating...' : 'Generate Article'}
      </button>

      {error && <p className="error">{error}</p>}

      {article && (
        <div className="article">
          <h2 className="article-headline">{article.headline}</h2>

          {/* تم دمج الفقرات هنا لعرضها كنص واحد متصل */}
          <p>{article.intro}</p>
          <p>{article.body}</p>
          <p>{article.conclusion}</p>
        </div>
      )}
    </div>
  );
}

export default App;
