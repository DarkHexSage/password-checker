import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:32777';

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
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#fbbf24'; // Amber
    if (score >= 40) return '#f97316'; // Orange
    if (score >= 20) return '#ef4444'; // Red
    return '#dc2626'; // Dark Red
  };

  const getScoreWidth = (score) => {
    return `${Math.min(score, 100)}%`;
  };

  const getCheckStatus = (passed) => {
    return passed ? '✓' : '✗';
  };

  const getCheckColor = (passed) => {
    return passed ? '#10b981' : '#ef4444';
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.checker}>
        <div style={styles.header}>
          <h1 style={styles.title}>NIST Password Security Checker</h1>
          <p style={styles.subtitle}>Check password strength against <span style={styles.nistHighlight}>NIST SP 800-63B</span> guidelines</p>
        </div>

        <div style={styles.inputSection}>
          <div style={styles.passwordInputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check..."
              style={styles.passwordInput}
            />
            <button
              style={styles.toggleVisibility}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide' : 'Show'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {password && (
            <div style={styles.inputInfo}>
              <span>Length: <strong style={{ color: '#a8c5f7' }}>{password.length}</strong> characters</span>
              {password.length >= 12 && <span style={{ ...styles.badge, ...styles.badgeGreen }}>✓ Meets preferred length</span>}
              {password.length >= 8 && password.length < 12 && <span style={{ ...styles.badge, ...styles.badgeYellow }}>⚠ Minimum met</span>}
              {password.length < 8 && <span style={{ ...styles.badge, ...styles.badgeRed }}>✗ Too short</span>}
            </div>
          )}
        </div>

        {result && (
          <div style={styles.results}>
            {/* Compliance Score */}
            <div style={styles.scoreSection}>
              <div style={styles.scoreHeader}>
                <h2 style={styles.sectionTitle}>Compliance Score</h2>
                <div style={{ ...styles.scoreNumber, color: getScoreColor(result.compliance_score) }}>
                  {result.compliance_score}%
                </div>
              </div>
              <div style={styles.scoreBar}>
                <div
                  style={{
                    ...styles.scoreFill,
                    width: getScoreWidth(result.compliance_score),
                    backgroundColor: getScoreColor(result.compliance_score)
                  }}
                ></div>
              </div>
              <div style={{ ...styles.strengthLabel, color: getScoreColor(result.compliance_score) }}>
                {result.strength}
              </div>
              <div style={styles.complianceStatus}>
                {result.nist_compliant ? (
                  <span style={styles.compliant}>
                    ✓ NIST SP 800-63B Compliant
                  </span>
                ) : (
                  <span style={styles.nonCompliant}>
                    ✗ Does not meet NIST guidelines
                  </span>
                )}
              </div>
            </div>

            {/* Checks */}
            <div style={styles.checksSection}>
              <h3 style={styles.sectionTitle}>Security Checks</h3>

              {/* Length */}
              <div style={styles.checkItem}>
                <div style={styles.checkHeader}>
                  <span style={{ ...styles.checkStatus, color: getCheckColor(result.checks.length.compliant) }}>
                    {getCheckStatus(result.checks.length.compliant)}
                  </span>
                  <span style={styles.checkLabel}>Password Length</span>
                </div>
                <div style={styles.checkDetails}>
                  {result.checks.length.length} characters (minimum: {result.checks.length.minimum_required}, preferred: {result.checks.length.preferred})
                </div>
              </div>

              {/* Character Variety */}
              <div style={styles.checkItem}>
                <div style={styles.checkHeader}>
                  <span style={{ ...styles.checkStatus, color: getCheckColor(result.checks.character_variety.compliant) }}>
                    {getCheckStatus(result.checks.character_variety.compliant)}
                  </span>
                  <span style={styles.checkLabel}>Character Variety</span>
                </div>
                <div style={styles.varietyBadges}>
                  <span style={{ ...styles.varietyBadge, ...(result.checks.character_variety.has_uppercase ? styles.varietyBadgeActive : styles.varietyBadgeInactive) }}>
                    A-Z
                  </span>
                  <span style={{ ...styles.varietyBadge, ...(result.checks.character_variety.has_lowercase ? styles.varietyBadgeActive : styles.varietyBadgeInactive) }}>
                    a-z
                  </span>
                  <span style={{ ...styles.varietyBadge, ...(result.checks.character_variety.has_numbers ? styles.varietyBadgeActive : styles.varietyBadgeInactive) }}>
                    0-9
                  </span>
                  <span style={{ ...styles.varietyBadge, ...(result.checks.character_variety.has_special_chars ? styles.varietyBadgeActive : styles.varietyBadgeInactive) }}>
                    !@#$
                  </span>
                </div>
              </div>

              {/* Common Patterns */}
              <div style={styles.checkItem}>
                <div style={styles.checkHeader}>
                  <span style={{ ...styles.checkStatus, color: getCheckColor(!result.checks.common_patterns.has_patterns) }}>
                    {getCheckStatus(!result.checks.common_patterns.has_patterns)}
                  </span>
                  <span style={styles.checkLabel}>Common Patterns</span>
                </div>
                <div style={styles.checkDetails}>
                  {!result.checks.common_patterns.has_patterns ? (
                    'No common weak patterns detected'
                  ) : (
                    <>Found: {result.checks.common_patterns.found_patterns.join(', ')}</>
                  )}
                </div>
              </div>

              {/* Sequential Characters */}
              <div style={styles.checkItem}>
                <div style={styles.checkHeader}>
                  <span style={{ ...styles.checkStatus, color: getCheckColor(!result.checks.sequential.has_sequences) }}>
                    {getCheckStatus(!result.checks.sequential.has_sequences)}
                  </span>
                  <span style={styles.checkLabel}>Sequential Characters</span>
                </div>
                <div style={styles.checkDetails}>
                  {!result.checks.sequential.has_sequences ? (
                    'No sequential patterns (abc, 123, etc)'
                  ) : (
                    <>Found: {result.checks.sequential.found_sequences.join(', ')}</>
                  )}
                </div>
              </div>

              {/* Repeated Characters */}
              <div style={styles.checkItem}>
                <div style={styles.checkHeader}>
                  <span style={{ ...styles.checkStatus, color: getCheckColor(result.checks.repeated_chars.acceptable) }}>
                    {getCheckStatus(result.checks.repeated_chars.acceptable)}
                  </span>
                  <span style={styles.checkLabel}>Repeated Characters</span>
                </div>
                <div style={styles.checkDetails}>
                  Max consecutive: {result.checks.repeated_chars.max_consecutive_repeat}, Ratio: {(result.checks.repeated_chars.repeat_ratio * 100).toFixed(0)}%
                </div>
              </div>

              {/* Entropy */}
              <div style={styles.checkItem}>
                <div style={styles.checkHeader}>
                  <span style={styles.checkLabel}>Entropy (Information Strength)</span>
                </div>
                <div style={styles.checkDetails}>
                  {result.checks.entropy.entropy_bits} bits ({result.checks.entropy.status})
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div style={styles.recommendationsSection}>
                <h3 style={styles.sectionTitle}>Recommendations</h3>
                <ul style={styles.recommendationsList}>
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} style={styles.recommendationItem}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* NIST Info */}
            <div style={styles.nistInfo}>
              <p style={styles.nistText}>
                <span style={styles.nistHighlight}>NIST SP 800-63B</span>: Guidelines for password-based authentication. This checker validates your password against these modern cybersecurity standards.
              </p>
            </div>
          </div>
        )}

        {!password && (
          <div style={styles.emptyState}>
            <p style={styles.emptyStateText}>Enter a password above to check its strength and NIST compliance</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url("https://img.freepik.com/free-photo/password-with-binary-code-hand-holding-magnifying-glass_23-2148578089.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    fontFamily: '"Inter", "Roboto", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    fontWeight: '400',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(10, 40, 80, 0.65))',
    zIndex: 0,
  },

  checker: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: '800px',
    background: 'rgba(20, 30, 60, 0.25)',
    borderRadius: '20px',
    padding: '50px 40px',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(59, 130, 246, 0.2)',
    fontFamily: '"Inter", "Roboto", "-apple-system", "BlinkMacSystemFont", "Segoe UI", sans-serif',
    fontWeight: '400',
  },

  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },

  title: {
    margin: '0 0 12px 0',
    fontSize: '42px',
    fontWeight: '300',
    letterSpacing: '0.5px',
    color: '#ffffff',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },

  subtitle: {
    margin: 0,
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '400',
    letterSpacing: '0.3px',
  },

  inputSection: {
    marginBottom: '30px',
  },

  passwordInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },

  passwordInput: {
    width: '100%',
    padding: '14px 45px 14px 16px',
    border: '2px solid rgba(59, 130, 246, 0.4)',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: 'inherit',
    background: 'rgba(20, 30, 60, 0.35)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#ffffff',
    outline: 'none',
    transition: 'all 0.3s ease',
  },

  toggleVisibility: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '8px',
    opacity: 0.8,
  },

  inputInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    letterSpacing: '0.2px',
  },

  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },

  badgeGreen: {
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
  },

  badgeYellow: {
    background: 'rgba(251, 191, 36, 0.2)',
    color: '#fbbf24',
  },

  badgeRed: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },

  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },

  scoreSection: {
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },

  scoreHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },

  scoreNumber: {
    fontSize: '42px',
    fontWeight: '300',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },

  scoreBar: {
    width: '100%',
    height: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '15px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  },

  scoreFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  },

  strengthLabel: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '12px',
    letterSpacing: '0.3px',
  },

  complianceStatus: {
    textAlign: 'center',
  },

  compliant: {
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-block',
    letterSpacing: '0.2px',
  },

  nonCompliant: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-block',
    letterSpacing: '0.2px',
  },

  checksSection: {
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },

  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: '0.3px',
  },

  checkItem: {
    marginBottom: '18px',
    paddingBottom: '18px',
    borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
  },

  checkItem_last: {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },

  checkHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },

  checkStatus: {
    fontSize: '18px',
    fontWeight: '500',
  },

  checkLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: '0.2px',
  },

  checkDetails: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: '30px',
    fontWeight: '400',
    letterSpacing: '0.2px',
  },

  varietyBadges: {
    display: 'flex',
    gap: '10px',
    marginLeft: '30px',
    flexWrap: 'wrap',
  },

  varietyBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid',
    transition: 'all 0.3s ease',
  },

  varietyBadgeActive: {
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },

  varietyBadgeInactive: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },

  recommendationsSection: {
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },

  recommendationsList: {
    margin: '0',
    paddingLeft: '20px',
    listStyle: 'none',
  },

  recommendationItem: {
    marginBottom: '10px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    paddingLeft: '20px',
    fontWeight: '400',
    letterSpacing: '0.2px',
  },

  nistInfo: {
    background: 'rgba(59, 130, 246, 0.1)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },

  nistText: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.6',
    letterSpacing: '0.2px',
  },

  nistHighlight: {
    fontWeight: '700',
    letterSpacing: '0.3px',
    background: 'rgba(59, 130, 246, 0.25)',
    padding: '3px 8px',
    borderRadius: '4px',
    color: '#3b82f6',
  },

  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },

  emptyStateText: {
    margin: 0,
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    letterSpacing: '0.2px',
  },
};

export default App;
