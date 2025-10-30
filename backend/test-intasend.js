const axios = require('axios');

// Test IntaSend API authentication
async function testIntaSendAPI() {
  // These are the keys from Railway
  const PUBLISHABLE_KEY = process.env.INTASEND_PUBLISHABLE_KEY || '';
  const SECRET_KEY = process.env.INTASEND_SECRET_KEY || '';

  console.log('\n🔑 Testing IntaSend API Keys...\n');
  console.log('Publishable Key:', PUBLISHABLE_KEY ? `${PUBLISHABLE_KEY.substring(0, 20)}...` : 'NOT SET');
  console.log('Secret Key:', SECRET_KEY ? `${SECRET_KEY.substring(0, 20)}...` : 'NOT SET');
  console.log('\n');

  if (!PUBLISHABLE_KEY || !SECRET_KEY) {
    console.error('❌ API keys not found in environment variables!');
    console.log('\nSet them with:');
    console.log('export INTASEND_PUBLISHABLE_KEY=your_key');
    console.log('export INTASEND_SECRET_KEY=your_key');
    return;
  }

  try {
    // Test 1: Create a test payment collection
    console.log('📝 Test 1: Creating payment collection...');
    
    const response = await axios.post(
      'https://payment.intasend.com/api/v1/payment/collection/',
      {
        public_key: PUBLISHABLE_KEY,
        amount: 10, // Small test amount
        currency: 'KES',
        email: 'test@example.com',
        phone_number: '254712345678',
        first_name: 'Test',
        last_name: 'User',
        api_ref: `TEST-${Date.now()}`,
        redirect_url: 'https://example.com/success',
        method: 'M-PESA'
      },
      {
        headers: {
          'Authorization': `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ SUCCESS! Payment collection created!');
    console.log('\nResponse:');
    console.log('- Payment URL:', response.data.url);
    console.log('- Checkout ID:', response.data.id);
    console.log('- State:', response.data.state);
    console.log('\n✨ Your IntaSend API keys are working correctly!\n');

  } catch (error) {
    console.error('❌ FAILED! Error details:\n');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.log('\n🔍 Authentication Failed! Possible reasons:');
        console.log('1. Wrong API keys');
        console.log('2. Keys are from TEST environment but trying to use LIVE');
        console.log('3. Keys are from LIVE environment but trying to use TEST');
        console.log('4. Keys were copied incorrectly (extra spaces, etc.)');
        console.log('\n💡 Solution: Double-check your keys in IntaSend dashboard');
        console.log('   - Go to: https://payment.intasend.com/account/api-keys/');
        console.log('   - Make sure you\'re in the correct environment (LIVE vs TEST)');
        console.log('   - Copy the keys again carefully');
      }
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('\n');
  }
}

// Run the test
testIntaSendAPI();
