from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# NIST SP 800-63B Guidelines
NIST_GUIDELINES = {
    "minimum_length": 8,
    "preferred_length": 12,
    "max_length": 128,
    "common_words_file": None  # Would load dictionary in production
}

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/check-password', methods=['POST'])
def check_password():
    """
    Validate password against NIST SP 800-63B-3 guidelines
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        password = data.get('password')
        
        if password is None:
            return jsonify({"error": "Password is required"}), 400
        
        if not isinstance(password, str):
            return jsonify({"error": "Password must be a string"}), 400
        
        # Run validation
        result = _validate_password(password)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/password-strength', methods=['POST'])
def password_strength():
    """
    Get detailed password strength analysis
    """
    try:
        data = request.get_json()
        password = data.get('password', '')
        
        if not password:
            return jsonify({"error": "Password is required"}), 400
        
        analysis = _analyze_password(password)
        
        return jsonify(analysis), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def _validate_password(password: str) -> dict:
    """
    Validate password against NIST SP 800-63B-3 guidelines
    Returns detailed compliance report
    """
    
    checks = {
        "length": _check_length(password),
        "character_variety": _check_character_variety(password),
        "common_patterns": _check_common_patterns(password),
        "sequential": _check_sequential(password),
        "repeated_chars": _check_repeated_characters(password),
        "entropy": _calculate_entropy(password)
    }
    
    # Determine compliance
    is_compliant = (
        checks["length"]["compliant"] and
        checks["character_variety"]["compliant"] and
        not checks["common_patterns"]["has_patterns"] and
        not checks["sequential"]["has_sequences"] and
        checks["repeated_chars"]["acceptable"]
    )
    
    # Calculate score (0-100)
    score = _calculate_compliance_score(checks)
    
    return {
        "password_length": len(password),
        "is_compliant": is_compliant,
        "compliance_score": score,
        "strength": _get_strength_label(score),
        "checks": checks,
        "recommendations": _get_recommendations(checks),
        "nist_compliant": is_compliant,
        "timestamp": datetime.now().isoformat()
    }

def _check_length(password: str) -> dict:
    """NIST minimum: 8 chars, preferred: 12+"""
    length = len(password)
    
    return {
        "length": length,
        "minimum_required": NIST_GUIDELINES["minimum_length"],
        "preferred": NIST_GUIDELINES["preferred_length"],
        "maximum": NIST_GUIDELINES["max_length"],
        "compliant": length >= NIST_GUIDELINES["minimum_length"],
        "preferred_met": length >= NIST_GUIDELINES["preferred_length"],
        "status": "GOOD" if length >= 12 else "OK" if length >= 8 else "TOO SHORT"
    }

def _check_character_variety(password: str) -> dict:
    """Check for character variety (uppercase, lowercase, numbers, symbols)"""
    has_upper = bool(re.search(r'[A-Z]', password))
    has_lower = bool(re.search(r'[a-z]', password))
    has_digit = bool(re.search(r'\d', password))
    has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]', password))
    
    variety_count = sum([has_upper, has_lower, has_digit, has_special])
    
    return {
        "has_uppercase": has_upper,
        "has_lowercase": has_lower,
        "has_numbers": has_digit,
        "has_special_chars": has_special,
        "variety_score": variety_count,
        "compliant": variety_count >= 2,  # At least 2 types
        "status": "EXCELLENT" if variety_count == 4 else "GOOD" if variety_count == 3 else "OK" if variety_count == 2 else "WEAK"
    }

def _check_common_patterns(password: str) -> dict:
    """Check for common weak patterns"""
    
    common_patterns = {
        "keyboard_sequence": [
            "qwerty", "asdf", "qazwsx", "123456", "654321",
            "111111", "123123", "000000", "12345678"
        ],
        "common_passwords": [
            "password", "password123", "admin", "letmein",
            "welcome", "monkey", "dragon", "master", "sunshine"
        ],
        "dates": r'\b(19|20)\d{2}[01]\d[0-3]\d\b',
        "repeated_pattern": r'(.)\1{2,}',  # aaa, 111, etc
    }
    
    found_patterns = []
    
    password_lower = password.lower()
    
    # Check keyboard sequences
    for seq in common_patterns["keyboard_sequence"]:
        if seq in password_lower:
            found_patterns.append(f"keyboard_sequence: {seq}")
    
    # Check common passwords
    for pwd in common_patterns["common_passwords"]:
        if pwd in password_lower:
            found_patterns.append(f"common_password: {pwd}")
    
    # Check date-like patterns
    if re.search(common_patterns["dates"], password):
        found_patterns.append("date_like_pattern")
    
    # Check repeated characters
    if re.search(common_patterns["repeated_pattern"], password):
        found_patterns.append("repeated_characters")
    
    return {
        "has_patterns": len(found_patterns) > 0,
        "found_patterns": found_patterns,
        "status": "GOOD" if not found_patterns else "WARNING"
    }

def _check_sequential(password: str) -> dict:
    """Check for sequential characters (abc, 123, etc)"""
    sequences = []
    
    for i in range(len(password) - 2):
        substr = password[i:i+3]
        
        # Check if sequential numbers or letters
        chars = [ord(c) for c in substr]
        if chars[1] - chars[0] == 1 and chars[2] - chars[1] == 1:
            sequences.append(substr)
        # Reverse
        if chars[0] - chars[1] == 1 and chars[1] - chars[2] == 1:
            sequences.append(substr)
    
    return {
        "has_sequences": len(sequences) > 0,
        "found_sequences": list(set(sequences)),
        "status": "WARNING" if sequences else "GOOD"
    }

def _check_repeated_characters(password: str) -> dict:
    """Check for excessive repeated characters"""
    total_chars = len(password)
    unique_chars = len(set(password))
    
    max_repeat = 0
    current_char = None
    current_count = 0
    
    for char in password:
        if char == current_char:
            current_count += 1
            max_repeat = max(max_repeat, current_count)
        else:
            current_char = char
            current_count = 1
    
    repeat_ratio = (total_chars - unique_chars) / total_chars if total_chars > 0 else 0
    
    return {
        "unique_chars": unique_chars,
        "total_chars": total_chars,
        "max_consecutive_repeat": max_repeat,
        "repeat_ratio": round(repeat_ratio, 2),
        "acceptable": max_repeat < 4 and repeat_ratio < 0.5,
        "status": "GOOD" if max_repeat < 4 else "WARNING"
    }

def _calculate_entropy(password: str) -> dict:
    """Calculate Shannon entropy"""
    import math
    
    if not password:
        return {"entropy": 0, "bits": 0, "status": "ZERO"}
    
    # Count character types
    char_set_size = len(set(password))
    length = len(password)
    
    # Estimate entropy: log2(char_set_size) * length
    entropy = math.log2(char_set_size) * length if char_set_size > 0 else 0
    
    return {
        "entropy_bits": round(entropy, 2),
        "character_set_size": char_set_size,
        "password_length": length,
        "status": "STRONG" if entropy > 50 else "MODERATE" if entropy > 30 else "WEAK"
    }

def _calculate_compliance_score(checks: dict) -> int:
    """Calculate overall compliance score (0-100)"""
    score = 0
    
    # Length (30 points)
    if checks["length"]["preferred_met"]:
        score += 30
    elif checks["length"]["compliant"]:
        score += 20
    
    # Character variety (30 points)
    variety = checks["character_variety"]["variety_score"]
    score += (variety / 4) * 30
    
    # No common patterns (20 points)
    if not checks["common_patterns"]["has_patterns"]:
        score += 20
    
    # No sequences (10 points)
    if not checks["sequential"]["has_sequences"]:
        score += 10
    
    # Acceptable repetition (10 points)
    if checks["repeated_chars"]["acceptable"]:
        score += 10
    
    return min(100, int(score))

def _get_strength_label(score: int) -> str:
    """Get human-readable strength label"""
    if score >= 80:
        return "VERY STRONG"
    elif score >= 60:
        return "STRONG"
    elif score >= 40:
        return "MODERATE"
    elif score >= 20:
        return "WEAK"
    else:
        return "VERY WEAK"

def _analyze_password(password: str) -> dict:
    """Detailed password analysis"""
    return _validate_password(password)

def _get_recommendations(checks: dict) -> list:
    """Generate recommendations based on checks"""
    recommendations = []
    
    # Length recommendations
    if not checks["length"]["preferred_met"]:
        recommendations.append(f"Increase password length to at least 12 characters (current: {checks['length']['length']})")
    
    # Character variety
    variety = checks["character_variety"]["variety_score"]
    if variety < 2:
        recommendations.append("Add a mix of uppercase, lowercase, numbers, and special characters")
    elif variety < 4:
        recommendations.append("Consider adding more character variety (e.g., special characters)")
    
    # Common patterns
    if checks["common_patterns"]["has_patterns"]:
        patterns = ', '.join(checks["common_patterns"]["found_patterns"])
        recommendations.append(f"Avoid common patterns: {patterns}")
    
    # Sequential characters
    if checks["sequential"]["has_sequences"]:
        recommendations.append("Avoid sequential characters (abc, 123, etc)")
    
    # Repeated characters
    if not checks["repeated_chars"]["acceptable"]:
        recommendations.append(f"Reduce repeated characters (max consecutive: {checks['repeated_chars']['max_consecutive_repeat']})")
    
    # Entropy
    if checks["entropy"]["status"] == "WEAK":
        recommendations.append("Password entropy is too low. Add more character variety and length")
    
    if not recommendations:
        recommendations.append("Password meets NIST SP 800-63B guidelines! ✅")
    
    return recommendations

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
