const admin = require('./config/firebase');

async function testAuth() {
  try {
    // Create a custom token for testing
    const customToken = await admin.auth().createCustomToken('test-user-id');
    console.log('Custom Token:', customToken);
    
    // You can also verify an existing user
    const userRecord = await admin.auth().getUserByEmail('test@example.com');
    console.log('User found:', userRecord.uid);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();
