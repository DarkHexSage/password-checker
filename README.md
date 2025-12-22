# 🔑 NIST Password Security Checker

A full-stack application to validate passwords against NIST SP 800-63B-3 guidelines.

**Stack:** Flask + React + Docker

## Features

- Real-time password strength validation
- NIST SP 800-63B-3 compliance checking
- Character variety analysis (uppercase, lowercase, numbers, symbols)
- Common pattern detection (keyboard sequences, common passwords)
- Sequential character detection (abc, 123, etc)
- Entropy calculation (information strength)
- Detailed recommendations for improvement
- Beautiful React UI with live validation
- Docker containerization with docker-compose

## NIST SP 800-63B Guidelines

This tool validates against modern NIST password guidelines:
- **Minimum length:** 8 characters
- **Preferred length:** 12+ characters
- **Character variety:** Mix of character types recommended
- **No common patterns:** Avoids weak passwords
- **Check entropy:** Information strength calculation

## Quick Start

### Option 1: Run with Docker Compose (Recommended)

```bash
# Build and run both services
docker-compose up --build

# Open browser to http://localhost:3001
```

### Option 2: Run Locally

**Backend:**
```bash
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5001
```

**Frontend:**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3001
```

## API Endpoints

### Check Password
```bash
POST /api/check-password
Content-Type: application/json

{
  "password": "MyP@ssw0rd2024!"
}
```

Response:
```json
{
  "password_length": 15,
  "is_compliant": true,
  "compliance_score": 92,
  "strength": "VERY STRONG",
  "checks": {
    "length": {...},
    "character_variety": {...},
    "common_patterns": {...},
    "sequential": {...},
    "repeated_chars": {...},
    "entropy": {...}
  },
  "recommendations": [...],
  "nist_compliant": true,
  "timestamp": "2024-01-15T10:30:00"
}
```

## Test Passwords

Try these to see different results:
- Strong: `MySecureP@ss123!`
- Weak: `password123`
- Too short: `Pass1!`
- Common pattern: `qwerty123`

## Score Breakdown

- **90-100:** VERY STRONG - Excellent security
- **70-89:** STRONG - Good security
- **50-69:** MODERATE - Could be improved
- **30-49:** WEAK - Not recommended
- **0-29:** VERY WEAK - Do not use

## Requirements

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local backend)

## Architecture

```
password-checker/
├── app.py                # Flask backend with NIST validation
├── requirements.txt      # Python dependencies
├── Dockerfile            # Backend image
├── docker-compose.yml    # Orchestration
└── frontend/
    ├── src/
    │   ├── App.js       # Main React component with live validation
    │   ├── App.css      # Styling
    │   └── index.js
    ├── public/
    │   └── index.html
    ├── package.json     # Node dependencies
    └── Dockerfile       # Frontend image
```

## Security Features

- Client-side validation feedback (instant)
- Server-side validation (secure)
- No password storage
- CORS enabled for frontend communication
- Input validation and sanitization

## Validation Details

### Length Check
- Minimum: 8 characters
- Preferred: 12+ characters
- Maximum: 128 characters

### Character Variety
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special characters (!@#$%^&*)

### Pattern Detection
- Keyboard sequences (qwerty, asdf, etc)
- Common passwords (password, admin, etc)
- Date-like patterns
- Repeated characters

### Entropy
- Shannon entropy calculation
- Character set size analysis
- Information strength in bits

## NIST Compliance

This tool implements NIST SP 800-63B-3 Guidelines:
- Moved away from composition rules to length + variety
- Emphasis on entropy and unpredictability
- Dictionary checking for common words
- No regular expiration requirements
- Encourages longer, memorable passwords

## Screenshots

<img width="893" height="934" alt="image" src="https://github.com/user-attachments/assets/cb3cb8bb-804a-4978-9211-17166821e751" />
<img width="853" height="939" alt="image" src="https://github.com/user-attachments/assets/d98751c0-aaf5-4688-ac5b-f2e5909009f0" />
<img width="715" height="936" alt="image" src="https://github.com/user-attachments/assets/7c74421c-7cc0-4f2f-ae94-07de5df8089d" />


---

**Built for:** Full-stack security engineering portfolio
