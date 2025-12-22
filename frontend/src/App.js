import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  // Real-time validation as user types
  useEffect(() => {
    if (password.length > 0) {
      checkPassword();
    } else {
      setResult(null);
    }
  }, [password]);

  const checkPassword = async () => {
    if (!password) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/check-password`, {
        password: password
      });
      setResult(response.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#00e676';
    if (score >= 60) return '#76ff03';
    if (score >= 40) return '#ffa726';
    if (score >= 20) return '#ff7043';
    return '#f4511e';
  };

  const getScoreWidth = (score) => {
    return `${Math.min(score, 100)}%`;
  };

  const getCheckStatus = (passed) => {
    return passed ? '✓' : '✗';
  };

  const getCheckColor = (passed) => {
    return passed ? '#00e676' : '#f44336';
  };

  return (
    <div className="container">
      <div className="checker">
        <h1>🔑 NIST Password Security Checker</h1>
        <p className="subtitle">Check password strength against NIST SP 800-63B guidelines</p>

        <div className="input-section">
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check..."
              className="password-input"
            />
            <button
              className="toggle-visibility"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide' : 'Show'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {password && (
            <div className="input-info">
              Length: <strong>{password.length}</strong> characters
              {password.length >= 12 && <span className="badge green">✓ Meets preferred length</span>}
              {password.length >= 8 && password.length < 12 && <span className="badge yellow">⚠ Minimum met</span>}
              {password.length < 8 && <span className="badge red">✗ Too short</span>}
            </div>
          )}
        </div>

        {result && (
          <div className="results">
            {/* Compliance Score */}
            <div className="score-section">
              <div className="score-header">
                <h2>Compliance Score</h2>
                <div className="score-number" style={{ color: getScoreColor(result.compliance_score) }}>
                  {result.compliance_score}%
                </div>
              </div>

              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: getScoreWidth(result.compliance_score),
                    backgroundColor: getScoreColor(result.compliance_score)
                  }}
                ></div>
              </div>

              <div className="strength-label" style={{ color: getScoreColor(result.compliance_score) }}>
                {result.strength}
              </div>

              <div className="compliance-status">
                {result.nist_compliant ? (
                  <span className="compliant">
                    ✓ NIST SP 800-63B Compliant
                  </span>
                ) : (
                  <span className="non-compliant">
                    ✗ Does not meet NIST guidelines
                  </span>
                )}
              </div>
            </div>

            {/* Checks */}
            <div className="checks-section">
              <h3>Security Checks</h3>

              {/* Length */}
              <div className="check-item">
                <div className="check-header">
                  <span
                    className="check-status"
                    style={{ color: getCheckColor(result.checks.length.compliant) }}
                  >
                    {getCheckStatus(result.checks.length.compliant)}
                  </span>
                  <span className="check-label">Password Length</span>
                </div>
                <div className="check-details">
                  {result.checks.length.length} characters (minimum: {result.checks.length.minimum_required}, preferred: {result.checks.length.preferred})
                </div>
              </div>

              {/* Character Variety */}
              <div className="check-item">
                <div className="check-header">
                  <span
                    className="check-status"
                    style={{ color: getCheckColor(result.checks.character_variety.compliant) }}
                  >
                    {getCheckStatus(result.checks.character_variety.compliant)}
                  </span>
                  <span className="check-label">Character Variety</span>
                </div>
                <div className="variety-badges">
                  <span className={`variety-badge ${result.checks.character_variety.has_uppercase ? 'active' : ''}`}>
                    A-Z
                  </span>
                  <span className={`variety-badge ${result.checks.character_variety.has_lowercase ? 'active' : ''}`}>
                    a-z
                  </span>
                  <span className={`variety-badge ${result.checks.character_variety.has_numbers ? 'active' : ''}`}>
                    0-9
                  </span>
                  <span className={`variety-badge ${result.checks.character_variety.has_special_chars ? 'active' : ''}`}>
                    !@#$
                  </span>
                </div>
              </div>

              {/* Common Patterns */}
              <div className="check-item">
                <div className="check-header">
                  <span
                    className="check-status"
                    style={{ color: getCheckColor(!result.checks.common_patterns.has_patterns) }}
                  >
                    {getCheckStatus(!result.checks.common_patterns.has_patterns)}
                  </span>
                  <span className="check-label">Common Patterns</span>
                </div>
                <div className="check-details">
                  {!result.checks.common_patterns.has_patterns ? (
                    'No common weak patterns detected'
                  ) : (
                    <>Found: {result.checks.common_patterns.found_patterns.join(', ')}</>
                  )}
                </div>
              </div>

              {/* Sequential Characters */}
              <div className="check-item">
                <div className="check-header">
                  <span
                    className="check-status"
                    style={{ color: getCheckColor(!result.checks.sequential.has_sequences) }}
                  >
                    {getCheckStatus(!result.checks.sequential.has_sequences)}
                  </span>
                  <span className="check-label">Sequential Characters</span>
                </div>
                <div className="check-details">
                  {!result.checks.sequential.has_sequences ? (
                    'No sequential patterns (abc, 123, etc)'
                  ) : (
                    <>Found: {result.checks.sequential.found_sequences.join(', ')}</>
                  )}
                </div>
              </div>

              {/* Repeated Characters */}
              <div className="check-item">
                <div className="check-header">
                  <span
                    className="check-status"
                    style={{ color: getCheckColor(result.checks.repeated_chars.acceptable) }}
                  >
                    {getCheckStatus(result.checks.repeated_chars.acceptable)}
                  </span>
                  <span className="check-label">Repeated Characters</span>
                </div>
                <div className="check-details">
                  Max consecutive: {result.checks.repeated_chars.max_consecutive_repeat}, Ratio: {(result.checks.repeated_chars.repeat_ratio * 100).toFixed(0)}%
                </div>
              </div>

              {/* Entropy */}
              <div className="check-item">
                <div className="check-header">
                  <span className="check-label">Entropy (Information Strength)</span>
                </div>
                <div className="check-details">
                  {result.checks.entropy.entropy_bits} bits ({result.checks.entropy.status})
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="recommendations-section">
                <h3>Recommendations</h3>
                <ul className="recommendations-list">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* NIST Info */}
            <div className="nist-info">
              <p>
                <strong>NIST SP 800-63B-3:</strong> Guidelines for password-based authentication. This checker validates your password against these modern cybersecurity standards.
              </p>
            </div>
          </div>
        )}

        {!password && (
          <div className="empty-state">
            <p>Enter a password above to check its strength and NIST compliance</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
