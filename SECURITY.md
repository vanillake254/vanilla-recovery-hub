# Security Guide - Vanilla Recovery Hub

## Critical Security Rules

### 1. NEVER Ask for Passwords ⚠️

This is our #1 security policy:
- Never request user passwords via chat, email, or phone
- Never log user passwords
- Never store passwords in plain text
- Always guide users to reset passwords themselves

**Chatbot Response:**
The chatbot is trained to refuse password requests:
```
"We will NEVER ask for your password. It's against our policy and unsafe."
```

### 2. Payment Security

**Webhook Verification (CRITICAL):**
```javascript
// ALWAYS verify webhook signature
const signature = req.headers['verif-hash'];
if (signature !== process.env.FLW_SECRET_KEY) {
  return res.status(401).json({ error: 'Invalid signature' });
}

// ALWAYS verify transaction with Flutterwave API
const verification = await paymentService.verifyPayment(transactionId);
if (verification.data.status !== 'successful') {
  return; // Don't trust redirect alone!
}
```

**Never Trust:**
- Payment redirect alone
- Frontend-provided payment status
- Unverified webhook data

**Always:**
- Verify webhook signature
- Call Flutterwave verify API
- Log all payment attempts
- Double-check before sending services

### 3. Authentication & Authorization

**JWT Tokens:**
- Use strong secret (32+ characters)
- Set expiration (7 days max)
- Rotate secrets periodically
- Store in httpOnly cookies (production)

**Admin Access:**
```javascript
// Middleware checks both authentication AND role
router.use(authenticateToken, requireAdmin);
```

**Password Requirements (Production):**
- Minimum 8 characters
- Must include: uppercase, lowercase, number
- Hash with bcrypt (rounds: 12)
- Implement rate limiting on login

### 4. Data Privacy (GDPR Compliant)

**Personal Data We Collect:**
- Name, email, phone (minimal, necessary)
- Recovery request details
- Chat logs (for support)
- Payment status (not card details)

**We NEVER:**
- Share data with third parties
- Sell user information
- Store credit card details (Flutterwave handles this)
- Log sensitive information

**User Rights:**
- Request data deletion
- Access their data
- Opt-out of emails

**Implementation:**
```javascript
// Sanitize logs - never log passwords or tokens
logger.info('User login', { email: user.email }); // ✓
logger.info('User login', { email, password }); // ✗ NEVER
```

### 5. Input Validation & Sanitization

**All user inputs MUST be validated:**

```javascript
// Example: Phone validation
body('phone')
  .matches(/^(\+254|254|0)[17]\d{8}$/)
  .withMessage('Valid Kenyan phone required');

// Email validation
body('email').isEmail().normalizeEmail();

// Sanitize HTML in descriptions
const sanitizedDescription = description.trim().substring(0, 2000);
```

**Prevent Injection:**
- Use Mongoose parameterized queries (prevents NoSQL injection)
- Validate all enum values
- Trim and escape user inputs
- Limit string lengths

### 6. Rate Limiting

**Implemented Limits:**
- General API: 100 requests / 15 min
- Payment: 10 requests / hour
- Chat: 20 messages / minute
- Login: 5 attempts / 15 min (TODO: implement)

**Example:**
```javascript
const paymentRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many payment attempts'
});
```

### 7. CORS & HTTPS

**CORS Configuration:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL, // Only your domain
  credentials: true
}));
```

**Production MUST use HTTPS:**
- Firebase Hosting: HTTPS by default ✓
- Railway: HTTPS by default ✓
- Custom domain: Enforce SSL redirect

### 8. Environment Variables

**NEVER commit to Git:**
```bash
# .gitignore includes:
.env
.env.local
*.key
```

**Secure Storage:**
- Development: `.env` file (local only)
- Production: Railway/Firebase environment variables
- Use strong secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 9. Error Handling

**Don't Expose Internals:**

```javascript
// Production (good)
res.status(500).json({ error: 'Internal Server Error' });

// Development only (show details)
if (process.env.NODE_ENV === 'development') {
  res.status(500).json({ error: err.message, stack: err.stack });
}
```

**What to Log vs. Return:**
- Log: Full error details, stack traces
- Return to user: Generic error message

### 10. MongoDB Security

**Network Security:**
- Whitelist specific IPs (not 0.0.0.0/0 in production)
- Use SSL/TLS connections
- Enable MongoDB authentication

**Query Security:**
- Use Mongoose (prevents injection)
- Validate ObjectIds
- Implement field-level access control

### 11. Session Management

**Chatbot Sessions:**
- Generate with UUID v4
- Store in localStorage (frontend)
- Don't expose sensitive data in session
- Implement session timeout (abandoned after 24h)

**Admin Sessions:**
- JWT with expiration
- Logout clears token
- Implement token refresh (TODO)

### 12. File Upload Security (if implemented later)

**If you add file uploads:**
- Validate file type and size
- Scan for malware
- Store in cloud (not server)
- Use signed URLs
- Set Content-Type headers correctly

### 13. Monitoring & Alerts

**What to Monitor:**
- Failed login attempts (potential brute force)
- Multiple failed payments (fraud)
- Unusual API usage patterns
- Webhook signature failures
- Database connection issues

**Tools:**
- Winston: Logging
- Sentry: Error tracking (optional)
- Railway: Infrastructure monitoring

### 14. Incident Response Plan

**If a breach occurs:**

1. **Immediate:**
   - Rotate all API keys
   - Reset admin passwords
   - Review logs for unauthorized access

2. **Within 24h:**
   - Notify affected users
   - Document the incident
   - Patch vulnerability

3. **Within 72h:**
   - Report to authorities (if required by law)
   - Conduct security audit
   - Implement additional safeguards

### 15. Regular Security Tasks

**Weekly:**
- Review failed login attempts
- Check for unusual payment patterns
- Monitor error logs

**Monthly:**
- Update dependencies: `npm audit fix`
- Review user access logs
- Test backup restoration

**Quarterly:**
- Security audit
- Penetration testing (external)
- Update security documentation

## Security Checklist (Before Going Live)

- [ ] All API keys in environment variables (not code)
- [ ] MongoDB network access restricted
- [ ] HTTPS enabled everywhere
- [ ] CORS limited to production domain
- [ ] Rate limiting on all endpoints
- [ ] Webhook signatures verified
- [ ] Admin routes protected
- [ ] Passwords hashed (if storing any)
- [ ] No sensitive data in logs
- [ ] Error messages don't expose internals
- [ ] Input validation on all fields
- [ ] JWT secret is strong (32+ chars)
- [ ] Email sending configured properly
- [ ] Backup strategy in place
- [ ] Monitoring/alerting set up

## Vulnerability Disclosure

If you discover a security issue:
1. **DO NOT** open a public issue
2. Email: security@vanillarecoveryhub.com
3. Include: Description, steps to reproduce, impact
4. We'll respond within 48 hours

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

**Remember: Security is not a feature, it's a requirement. Never compromise on user safety.**
