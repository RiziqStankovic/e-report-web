// Test script untuk proxy API
const axios = require('axios');

async function testProxy() {
  try {
    console.log('🧪 Testing API Proxy...');
    
    // Test proxy endpoint
    const response = await axios.get('http://localhost:3000/api/proxy/health');
    console.log('✅ Proxy test successful:', response.data);
    
    // Test auth endpoint
    const authResponse = await axios.post('http://localhost:3000/api/proxy/auth/login', {
      username: 'test',
      password: 'test'
    });
    console.log('✅ Auth proxy test successful:', authResponse.data);
    
  } catch (error) {
    console.error('❌ Proxy test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testProxy();
