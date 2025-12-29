import { useEffect, useState } from 'react';

interface EnvInfo {
  pr: string;
  commit: string;
  branch: string;
  version: string;
  previewUrl: string;
}

function App() {
  const [info, setInfo] = useState<EnvInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/info')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setInfo)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <header>
        <h1>PR Environment Demo</h1>
        <p className="subtitle">Ephemeral Kubernetes Environment</p>
      </header>

      <main>
        {loading && <div className="loading">Loading...</div>}

        {error && <div className="error">Error: {error}</div>}

        {info && (
          <div className="info-grid">
            <div className="info-card">
              <span className="label">PR Number</span>
              <span className="value">#{info.pr}</span>
            </div>
            <div className="info-card">
              <span className="label">Commit SHA</span>
              <span className="value mono">{info.commit}</span>
            </div>
            <div className="info-card">
              <span className="label">Branch</span>
              <span className="value mono">{info.branch}</span>
            </div>
            <div className="info-card">
              <span className="label">Version</span>
              <span className="value">{info.version}</span>
            </div>
          </div>
        )}

        <div className="status">
          <span className="status-dot"></span>
          Environment Active
        </div>
      </main>

      <footer>
        <p>k8s-ephemeral-environments</p>
      </footer>
    </div>
  );
}

export default App;
