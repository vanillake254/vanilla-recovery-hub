const axios = require('axios');

async function checkIntaSend() {
  const SECRET = 'ISSecretKey_live_0952367a-624f-4c14-ae81-c7ea8d2488b9';
  const PUBLIC = 'ISPubKey_live_c28694e0-6521-470f-83de-e559af6c9840';

  try {
    await axios.post('https://payment.intasend.com/api/v1/payment/collection/', {
      public_key: PUBLIC,
      amount: 10,
      currency: 'KES',
      email: 'test@test.com',
      phone_number: '254712345678',
      first_name: 'Test',
      last_name: 'User',
      api_ref: `TEST-${Date.now()}`,
      method: 'M-PESA'
    }, {
      headers: { 'Authorization': `Bearer ${SECRET}` }
    });
    
    console.log('✅ VERIFIED! Your account is LIVE and ready!');
    console.log('🎉 You can now accept real payments!');
  } catch (err) {
    console.log('❌ NOT VERIFIED YET');
    console.log('\nCheck status at: https://payment.intasend.com/account/compliance/');
    console.log('Contact support: +254 798 364 706');
  }
}

checkIntaSend();
