// Simple backend test script
const http = require('http');

console.log('🔍 Testing backend connection...');

// Test health endpoint
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Backend responded with status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('📊 Response:', parsed);
      if (parsed.success) {
        console.log('🎉 Backend is working correctly!');
      } else {
        console.log('⚠️ Backend responded but with error');
      }
    } catch (error) {
      console.log('❌ Invalid JSON response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Backend connection failed:', error.message);
  console.log('💡 Make sure to start the backend server first:');
  console.log('   cd server && node index.js');
});

req.setTimeout(5000, () => {
  console.log('⏰ Request timed out - backend may not be running');
  req.destroy();
});

req.end();
