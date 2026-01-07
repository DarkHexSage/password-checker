# 🔑 NIST Password Security Checker

<div align="center">

> **Full-stack password validation tool** — Implement NIST SP 800-63B-3 guidelines to build stronger authentication systems

[![Python](https://img.shields.io/badge/Python-3.11%2B-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0%2B-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18%2B-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NIST](https://img.shields.io/badge/NIST-SP%20800--63B--3-003366?style=for-the-badge&logo=security&logoColor=white)](https://pages.nist.gov/800-63-3/sp800-63b.html)
[![License](https://img.shields.io/badge/License-Educational-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](#)

<br>

**[Quick Start](#-quick-start)** • **[Features](#-features)** • **[API Reference](#-api-endpoints)** • **[Validation Details](#-validation-details)** • **[NIST Guidelines](#-nist-compliance)** • **[Testing](#-test-passwords)** **• **[Demo](#-demo)****

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **Real-time Validation** | Instant feedback as you type passwords |
| 📋 **NIST SP 800-63B-3 Compliance** | Implements modern NIST guidelines |
| 🔤 **Character Analysis** | Detects uppercase, lowercase, numbers, symbols |
| 🎯 **Pattern Detection** | Identifies keyboard sequences, common passwords |
| 🔢 **Sequential Detection** | Finds abc, 123, and similar patterns |
| 📊 **Entropy Calculation** | Measures information strength in bits |
| 💡 **Smart Recommendations** | Detailed improvement suggestions |
| 🎨 **Beautiful React UI** | Modern glass design with live feedback |
| 🐳 **Docker Ready** | One-command setup with docker-compose |
| 🔒 **No Storage** | Passwords are never stored or logged |

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended) ⭐

```bash
# Build and run both services
docker-compose up --build

# Open your browser to http://localhost:3001
```

**What happens:**
```
✅ Backend validates on http://localhost:5001
✅ Frontend runs on http://localhost:3001
✅ Live WebSocket for instant feedback
✅ CORS enabled for secure communication
```

### Option 2: Local Development

**Backend Setup:**
```bash
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5001
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3001
```

---

## 📚 NIST SP 800-63B Guidelines

This tool validates against the **modern NIST SP 800-63B-3** password guidelines:

| Guideline | Details |
|-----------|---------|
| 🔢 **Minimum Length** | 8 characters |
| 📏 **Recommended Length** | 12+ characters |
| 🎯 **Preferred Length** | 16+ characters for critical systems |
| 🔤 **Character Variety** | Mix of character types recommended |
| 🚫 **Blacklist Checking** | Common passwords avoided |
| 📈 **Entropy Focus** | Information strength emphasized |
| ⏰ **No Expiration** | Modern approach without forced changes |
| 🤝 **User-Friendly** | Encourages longer, memorable passwords |

> **Key Insight:** NIST moved away from complexity rules (uppercase, numbers, symbols) toward length + entropy. Longer passwords are better than forced complexity!

---

## 🔐 Validation Breakdown

### Length Check ✅

<details>
<summary><strong>How length is scored</strong></summary>

```
8 characters    → Minimum requirement met
12+ characters  → Preferred (Good)
16+ characters  → Excellent (Very Strong)
20+ characters  → Maximum security benefit
128+ characters → Maximum allowed
```

**Examples:**
- `Pass123!` (8 chars) → ✅ Minimum
- `MyP@ssw0rd2024!` (15 chars) → ✅✅ Preferred
- `CorrectHorseBatteryStaple!` (26 chars) → ✅✅✅ Excellent

</details>

### Character Variety 🔤

<details>
<summary><strong>Supported character types</strong></summary>

```yaml
Uppercase Letters: A-Z           (26 options)
Lowercase Letters: a-z           (26 options)
Numbers:          0-9            (10 options)
Special Chars:    !@#$%^&*()...  (32+ options)
```

**Scoring:**
- 1 character type → Weak variety
- 2 character types → Moderate variety
- 3 character types → Good variety
- 4 character types → Excellent variety

**Examples:**
- `password` → Single type (lowercase only)
- `password123` → Two types (lowercase + numbers)
- `Password123` → Three types (upper + lower + numbers)
- `Password123!` → Four types (all supported)

</details>

### Pattern Detection 🎯

<details>
<summary><strong>Patterns that are detected and penalized</strong></summary>

**Keyboard Sequences (Detected & Scored):**
```
qwerty, asdf, zxcv, qweasd, 123456, 789456, etc
```

**Common Passwords (Dictionary Check):**
```
password, admin, letmein, welcome, monkey, dragon, 
password123, admin123, qwerty123, etc
```

**Date-Like Patterns:**
```
2024, 1995, 01/01, 12/25, etc
```

**Repeated Characters:**
```
aaa, 111, !!!, aaabbb, etc
```

**Sequential Patterns:**
```
abc, xyz, 123, 456, abcd, 1234, etc
```

**Penalty:** Each detected pattern reduces score by 10-15 points

</details>

### Entropy Calculation 📊

<details>
<summary><strong>How entropy is measured</strong></summary>

**Formula:**
```
Entropy = log₂(C^L)
Where: C = character set size
       L = password length
```

**Example Calculations:**
```
"pass" (lowercase only)
  → C=26, L=4 → Entropy = 18.9 bits

"P@ssw0rd!" (all types)
  → C=94, L=9 → Entropy = 59.5 bits

"MySecurePassword123!" (all types)
  → C=94, L=20 → Entropy = 131.7 bits
```

**Interpretation:**
- 0-28 bits → Very Weak
- 28-60 bits → Weak
- 60-80 bits → Moderate
- 80-120 bits → Strong
- 120+ bits → Very Strong

</details>

---

## 📊 Compliance Score System

Your password receives a **compliance score from 0-100** based on multiple factors:

| Score Range | Rating | Assessment |
|------------|--------|------------|
| **90-100** | ✅ VERY STRONG | Excellent security • NIST exceeds all requirements |
| **70-89** | ✅ STRONG | Good security • NIST fully compliant |
| **50-69** | ⚠️ MODERATE | Acceptable • Could be improved |
| **30-49** | ❌ WEAK | Not recommended • Improve required |
| **0-29** | ❌ VERY WEAK | Do not use • Major flaws detected |

**Score Factors (Weighted):**
- Length match: 30 points
- Character variety: 25 points
- Entropy: 25 points
- Pattern detection: 20 points

---

## 🧪 Test Passwords

Try these example passwords to see different validation results:

<details>
<summary><strong>Expand to see test cases</strong></summary>

**VERY STRONG (90-100) ✅**
```
MySecureP@ss123!       → 15 chars, all types, no patterns
CorrectHorseBattery    → 22 chars, excellent entropy
P@ssw0rd_2024_Secure   → 20 chars, special chars, strong
```

**STRONG (70-89) ✅**
```
MyPassword123          → 12 chars, decent variety
SecurePass2024         → 14 chars, mixed case + numbers
Welcome@Home123        → 13 chars, good pattern mix
```

**MODERATE (50-69) ⚠️**
```
Password1234           → 12 chars, but simple pattern
Admin12345             → 10 chars, missing symbols
Qwerty!@#              → Mixed chars but weak length
```

**WEAK (30-49) ❌**
```
password123            → Dictionary word detected
qwerty123              → Keyboard sequence detected
Abc12345               → Too simple structure
```

**VERY WEAK (0-29) ❌**
```
password               → Common password
admin                  → Too short + common
123456                 → Only numbers
```

</details>

---

## 🔌 API Endpoints

### Check Password Endpoint

```http
POST /api/check-password
Content-Type: application/json
```

**Request:**
```json
{
  "password": "MyP@ssw0rd2024!"
}
```

**Response (201 Created):**
```json
{
  "password_length": 15,
  "is_compliant": true,
  "compliance_score": 92,
  "strength": "VERY STRONG",
  "entropy": {
    "entropy_bits": 98.7,
    "entropy_strength": "STRONG",
    "character_set_size": 94
  },
  "checks": {
    "length": {
      "passed": true,
      "minimum": 8,
      "current": 15,
      "recommended": 12,
      "score_contribution": 30
    },
    "character_variety": {
      "has_uppercase": true,
      "has_lowercase": true,
      "has_numbers": true,
      "has_symbols": true,
      "variety_score": "excellent",
      "score_contribution": 25
    },
    "common_patterns": {
      "is_common": false,
      "found_patterns": [],
      "score_contribution": 0
    },
    "sequential": {
      "has_sequential": false,
      "found_sequences": [],
      "score_contribution": 0
    },
    "repeated_chars": {
      "has_repeated": false,
      "repetitions": [],
      "score_contribution": 0
    }
  },
  "recommendations": [
    "Password strength is excellent!",
    "Consider using 16+ characters for critical accounts"
  ],
  "nist_compliant": true,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Password validation failed",
  "details": {
    "length_issue": "Password must be at least 8 characters",
    "variety_issue": "Add uppercase letters and symbols"
  }
}
```

### Endpoint Features

| Feature | Details |
|---------|---------|
| 📍 **URL** | `/api/check-password` |
| 🔧 **Method** | POST |
| 📤 **Request Type** | JSON |
| 📥 **Response Type** | JSON |
| ⏱️ **Response Time** | < 100ms |
| 🔒 **Security** | No password storage, CORS protected |
| 📊 **Caching** | Response data only, never passwords |

---

## 🏗️ Project Architecture

```
nist-password-checker/
│
├── Backend (Flask)
│   ├── app.py                          # Main Flask application
│   ├── requirements.txt                # Python dependencies
│   ├── Dockerfile                      # Backend container image
│   │
│   └── validators/
│       ├── length_validator.py         # Length checking
│       ├── entropy_calculator.py       # Entropy computation
│       ├── pattern_detector.py         # Pattern detection
│       └── nist_compliance.py          # NIST rules engine
│
├── Frontend (React)
│   ├── Dockerfile                      # Frontend container image
│   │
│   ├── public/
│   │   └── index.html                  # HTML entry point
│   │
│   └── src/
│       ├── App.js                      # Main React component
│       ├── App.css                     # Styling & animations
│       ├── components/
│       │   ├── PasswordInput.js        # Input field
│       │   ├── StrengthBar.js          # Visual strength bar
│       │   ├── ScoreBreakdown.js       # Score details
│       │   └── Recommendations.js      # Improvement suggestions
│       ├── utils/
│       │   ├── api.js                  # API communication
│       │   └── formatter.js            # Data formatting
│       └── index.js                    # React DOM entry
│
├── docker-compose.yml                  # Service orchestration
├── .env.example                        # Environment template
└── README.md                           # Documentation

```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---|
| **Client-Side Validation** | Instant feedback without server calls |
| **Server-Side Validation** | Secure processing on backend |
| **No Password Storage** | Passwords never saved to disk |
| **CORS Protection** | Only trusted origins allowed |
| **Input Sanitization** | All inputs validated before processing |
| **HTTPS Ready** | TLS/SSL configuration included |
| **Rate Limiting** | Optional DoS protection |
| **Environment Variables** | Sensitive config externalized |

---

## 🛠️ Requirements

| Tool | Version | Purpose |
|------|---------|---------|
| 🐳 Docker | Latest | Containerization |
| 🐳 Docker Compose | Latest | Service orchestration |
| 🟢 Node.js | 18+ | Frontend build tool |
| 🐍 Python | 3.11+ | Backend runtime |
| 📦 npm | Latest | Package manager |
| 🐍 pip | Latest | Python package manager |

---

## 📦 Installation & Usage

### Start with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f flask-backend
docker-compose logs -f react-frontend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Remove volumes too (clean slate)
docker-compose down -v
```

### Reset Everything
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Local Development

**Backend:**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment
export FLASK_ENV=development

# Run server
python app.py
# Accessible at http://localhost:5001
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# Accessible at http://localhost:3001

# Build for production
npm run build
```

---

## 🎯 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| 🎨 **Dashboard** | http://localhost:3001 | Password validation UI |
| 🔌 **Backend API** | http://localhost:5001/api | REST endpoints |
| 📊 **Health Check** | http://localhost:5001/health | Backend status |
| 📚 **API Docs** | http://localhost:5001/docs | Swagger documentation |

---

## 💡 Real-World Examples

### Example 1: Strong Password Validation
<details>
<summary><strong>See the request and response</strong></summary>

**Request:**
```bash
curl -X POST http://localhost:5001/api/check-password \
  -H "Content-Type: application/json" \
  -d '{"password":"MySecureP@ss2024!"}'
```

**Response:**
```json
{
  "password_length": 17,
  "compliance_score": 95,
  "strength": "VERY STRONG",
  "nist_compliant": true,
  "entropy": {
    "entropy_bits": 112.3,
    "entropy_strength": "VERY STRONG"
  },
  "recommendations": [
    "Excellent password strength!",
    "This password meets all NIST guidelines"
  ]
}
```
</details>

### Example 2: Weak Password Detection
<details>
<summary><strong>See the request and response</strong></summary>

**Request:**
```bash
curl -X POST http://localhost:5001/api/check-password \
  -H "Content-Type: application/json" \
  -d '{"password":"password123"}'
```

**Response:**
```json
{
  "password_length": 11,
  "compliance_score": 28,
  "strength": "VERY WEAK",
  "nist_compliant": false,
  "checks": {
    "common_patterns": {
      "is_common": true,
      "found_patterns": ["password (common word)", "123 (sequential)"]
    }
  },
  "recommendations": [
    "Use a unique password not found in dictionaries",
    "Avoid sequential numbers like 123",
    "Add special characters (!@#$%)",
    "Increase length to at least 12 characters"
  ]
}
```
</details>

### Example 3: Pattern Detection
<details>
<summary><strong>See the request and response</strong></summary>

**Request:**
```bash
curl -X POST http://localhost:5001/api/check-password \
  -H "Content-Type: application/json" \
  -d '{"password":"qwerty123"}'
```

**Response:**
```json
{
  "password_length": 9,
  "compliance_score": 22,
  "strength": "VERY WEAK",
  "nist_compliant": false,
  "checks": {
    "common_patterns": {
      "found_patterns": [
        "qwerty (keyboard sequence)",
        "123 (sequential numbers)"
      ]
    }
  },
  "recommendations": [
    "Avoid keyboard sequences (qwerty, asdf, etc)",
    "Don't use number sequences (123, 456, etc)",
    "Choose a completely random passphrase",
    "Consider using a passphrase: 3-4 random words"
  ]
}
```
</details>

---

## 📈 Score Calculation Example

Let's break down how `MyP@ssw0rd2024!` gets scored:

```yaml
Password: MyP@ssw0rd2024!
Length: 15 characters

Score Breakdown:
├── Length Check (30 points)
│   └── 15 chars > 12 (preferred) → ✅ +30 points
│
├── Character Variety (25 points)
│   ├── Uppercase: M, P, p → ✅
│   ├── Lowercase: y, s, w, r, d → ✅
│   ├── Numbers: 0, 2, 4 → ✅
│   └── Symbols: @, ! → ✅
│   └── All 4 types present → ✅ +25 points
│
├── Entropy (25 points)
│   ├── Character set: 94
│   ├── Entropy: log₂(94^15) = 98.7 bits
│   └── Excellent entropy → ✅ +25 points
│
├── Pattern Detection (20 points)
│   ├── Common passwords: ✅ Not found
│   ├── Keyboard sequences: ✅ Not found
│   ├── Sequential chars: ✅ Not found
│   └── No patterns → ✅ +20 points
│
└── TOTAL SCORE: 100 points → Rating: VERY STRONG ✅
```

---

## 📚 NIST Compliance Details

### What NIST Says

The **NIST SP 800-63B-3** document emphasizes:

✅ **DO THIS:**
```
• Enforce minimum 8-character length
• Support longer passwords (20+ characters)
• Allow all printable ASCII characters including spaces
• Check against known compromised passwords
• Focus on entropy and unpredictability
• Use salted hashing (bcrypt, scrypt, PBKDF2)
```

❌ **DON'T DO THIS:**
```
• Force password composition rules
• Require special character rotation
• Expire passwords regularly
• Use hints or security questions
• Implement account lockouts
• Transmit passwords insecurely
```

### Implementation in This Tool

This validator implements the **recommended** NIST approach:

| NIST Guideline | How We Implement It |
|---|---|
| Minimum 8 characters | Enforce length >= 8 |
| Encourage length | Recommend 12+ | Prefer 16+ |
| Entropy focus | Calculate Shannon entropy |
| Dictionary checking | Common password blacklist |
| No forced complexity | Accept any characters |
| User-friendly | Provide helpful feedback |

---

## 🖼️ Screenshots

The application includes a beautiful React UI:

- **Password Input Field** - Real-time validation feedback
- **Strength Indicator** - Visual bar showing compliance level
- **Score Breakdown** - Detailed analysis of each check
- **Recommendations** - Actionable improvement suggestions
- **Mobile Responsive** - Works on all devices

---

## ❓ FAQ

**Q: Are my passwords stored?**  
A: No. Passwords are never stored, logged, or transmitted to external services. Validation happens in-memory and results are discarded.

**Q: Does this work offline?**  
A: The container runs locally, so yes. No internet connection required after Docker image is built.

**Q: Can I modify the validation rules?**  
A: Absolutely! Both the backend and frontend are fully customizable. Modify `validators/nist_compliance.py` for different rules.

**Q: Why use entropy instead of complexity?**  
A: NIST moved away from forcing special characters because a long password (e.g., "correct horse battery staple") is often more secure than a forced-complex short one.

**Q: Is this production-ready?**  
A: The validation logic is solid and follows NIST guidelines. For production, add HTTPS, rate limiting, and logging.

**Q: How do I test it?**  
A: Use the test passwords in the examples section, or the interactive UI at http://localhost:3001

**Q: Can I integrate this into my app?**  
A: Yes! The Flask backend provides a clean JSON API that any frontend can consume.

---

## 🔐 NIST Guidelines Resources

Learn more about password security:

- 📖 [NIST SP 800-63B-3 Full Document](https://pages.nist.gov/800-63-3/sp800-63b.html)
- 🔐 [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- 🎯 [Entropy in Passwords](https://en.wikipedia.org/wiki/Password_strength#Entropy_as_a_measure_of_password_strength)
- 🛡️ [Troy Hunt: Passwords Evolved](https://www.troyhunt.com/password-myths-and-misconceptions/)

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| 🔤 Character Types Supported | 4 (uppercase, lowercase, numbers, symbols) |
| 📏 Length Range | 8-128 characters |
| 🎯 Pattern Rules | 15+ common patterns detected |
| 📊 Validation Checks | 6 comprehensive checks |
| ⚡ Response Time | < 100ms average |
| 🐳 Docker Services | 2 (backend + frontend) |
| 📚 Test Cases | 20+ examples |

---

## 🤝 Demo

[password-checker.webm](https://github.com/user-attachments/assets/5aa1c562-c37b-4106-ae4e-87a97a43e59c)

[DEMO](https://adragportfolio.info.gf/password-checker)


---

<div align="center">

### Made with ❤️ for Security Engineers

**Built for:** Full-stack security engineering portfolio  
**Last Updated:** January 2025  
**Version:** 2.0.0

<br>

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/)
[![Security](https://img.shields.io/badge/Security-First-red?style=for-the-badge&logo=security)](https://pages.nist.gov/800-63-3/)
[![Learning](https://img.shields.io/badge/Learning-Focused-blue?style=for-the-badge&logo=brain)](https://www.nist.gov/)

</div>

---

<details>
<summary><strong>📄 License & Attribution</strong></summary>

Educational project for learning password security and NIST guidelines. NIST SP 800-63 content used under public domain. No passwords are stored, transmitted, or used beyond validation scope.

</details>
