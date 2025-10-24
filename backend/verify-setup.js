#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if all required environment variables are properly configured
 */

require('dotenv').config();

const checks = {
  mongodb: {
    name: '🗄️  MongoDB Connection',
    test: () => {
      const uri = process.env.MONGO_URI;
      if (!uri || uri.includes('localhost') || uri.includes('XXXXXXX')) {
        return { pass: false, message: 'MongoDB URI not configured. Follow Step 1 in SETUP_GUIDE.md' };
      }
      if (!uri.includes('mongodb+srv://') && !uri.includes('mongodb://')) {
        return { pass: false, message: 'Invalid MongoDB URI format' };
      }
      return { pass: true, message: 'MongoDB URI configured ✓' };
    }
  },
  flutterwave: {
    name: '💳 Flutterwave API Keys',
    test: () => {
      const pubKey = process.env.FLW_PUBLIC_KEY;
      const secKey = process.env.FLW_SECRET_KEY;
      const encKey = process.env.FLW_ENCRYPTION_KEY;
      
      if (!pubKey || !secKey || !encKey) {
        return { pass: false, message: 'Missing Flutterwave keys' };
      }
      
      if (pubKey.includes('XXXX') || secKey.includes('XXXX') || encKey.includes('XXXX')) {
        return { pass: false, message: 'Flutterwave keys not configured. Follow Step 2 in SETUP_GUIDE.md' };
      }
      
      if (!pubKey.startsWith('FLWPUBK_TEST-')) {
        return { pass: false, message: 'Use TEST keys for development (not live keys)' };
      }
      
      return { pass: true, message: 'Flutterwave test keys configured ✓' };
    }
  },
  jwt: {
    name: '🔐 JWT Secret',
    test: () => {
      const secret = process.env.JWT_SECRET;
      if (!secret || secret.includes('change-this') || secret.length < 32) {
        return { pass: false, message: 'JWT secret not properly configured' };
      }
      return { pass: true, message: 'JWT secret configured ✓' };
    }
  },
  email: {
    name: '📧 Email API (Optional)',
    test: () => {
      const apiKey = process.env.EMAIL_API_KEY;
      if (!apiKey || apiKey.includes('123456789') || apiKey.includes('XXXX')) {
        return { pass: 'warning', message: 'Email API not configured (optional - app will work without it)' };
      }
      if (!apiKey.startsWith('re_')) {
        return { pass: 'warning', message: 'Invalid Resend API key format' };
      }
      return { pass: true, message: 'Resend API key configured ✓' };
    }
  },
  urls: {
    name: '🌐 Application URLs',
    test: () => {
      const frontend = process.env.FRONTEND_URL;
      const success = process.env.SUCCESS_URL;
      const fail = process.env.FAIL_URL;
      
      if (!frontend || !success || !fail) {
        return { pass: false, message: 'Missing URL configuration' };
      }
      
      return { pass: true, message: 'URLs configured ✓' };
    }
  }
};

console.log('\n🔍 Vanilla Recovery Hub - Setup Verification\n');
console.log('='.repeat(60));

let allPassed = true;
let hasWarnings = false;

for (const [key, check] of Object.entries(checks)) {
  const result = check.test();
  
  if (result.pass === true) {
    console.log(`\n✅ ${check.name}`);
    console.log(`   ${result.message}`);
  } else if (result.pass === 'warning') {
    console.log(`\n⚠️  ${check.name}`);
    console.log(`   ${result.message}`);
    hasWarnings = true;
  } else {
    console.log(`\n❌ ${check.name}`);
    console.log(`   ${result.message}`);
    allPassed = false;
  }
}

console.log('\n' + '='.repeat(60));

if (allPassed && !hasWarnings) {
  console.log('\n🎉 All checks passed! Your backend is ready to run.\n');
  console.log('Start the server with:');
  console.log('  cd backend && npm run dev\n');
  process.exit(0);
} else if (allPassed && hasWarnings) {
  console.log('\n✅ Core configuration complete! You can start the server.\n');
  console.log('⚠️  Some optional features need configuration (see warnings above).\n');
  console.log('Start the server with:');
  console.log('  cd backend && npm run dev\n');
  process.exit(0);
} else {
  console.log('\n❌ Configuration incomplete. Please fix the issues above.\n');
  console.log('📖 See SETUP_GUIDE.md for detailed instructions.\n');
  process.exit(1);
}
