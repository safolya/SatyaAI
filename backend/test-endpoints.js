const admin = require("./config/firebase");

async function testAllEndpoints() {
  try {
    const uid = "IntUgThFntdzfCk1WWZnUht7iIa2";

    console.log("🧪 Testing All Protected Endpoints...\n");

    // Generate custom token
    const customToken = await admin.auth().createCustomToken(uid);
    console.log(`✅ Generated token for UID: ${uid}`);

    const baseUrl = "http://localhost:3000";
    const headers = {
      Authorization: `Bearer ${customToken}`,
      "Content-Type": "application/json",
    };

    // Test 1: Get Profile
    console.log("\n1. Testing GET /api/auth/profile...");
    try {
      const response = await fetch(`${baseUrl}/api/auth/profile`, { headers });
      const data = await response.json();
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 2: Update Profile
    console.log("\n2. Testing PUT /api/auth/profile...");
    try {
      const response = await fetch(`${baseUrl}/api/auth/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ displayName: "Test User Updated" }),
      });
      const data = await response.json();
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 3: Analyze Content
    console.log("\n3. Testing POST /api/analyze/text...");
    try {
      const response = await fetch(`${baseUrl}/api/analyze/text`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          question:
            "This is a test content to analyze for misinformation detection. The Earth is flat and vaccines cause autism.",
        }),
      });
      const data = await response.json();
      console.log(`   Status: ${response.status}`);
      if (data.report) {
        console.log(`   Credibility Score: ${data.report.credibilityScore}`);
        console.log(`   Summary: ${data.report.summary}`);
      } else {
        console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    // Test 4: Get History
    console.log("\n4. Testing GET /api/analyze/history...");
    try {
      const response = await fetch(`${baseUrl}/api/analyze/history`, {
        headers,
      });
      const data = await response.json();
      console.log(`   Status: ${response.status}`);
      console.log(
        `   Reports count: ${data.reports ? data.reports.length : 0}`
      );
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    console.log("\n🎉 Endpoint testing completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Check if fetch is available (Node 18+)
if (typeof fetch === "undefined") {
  console.log("⚠️  Fetch not available. Install node-fetch or use Node 18+");
  console.log("   npm install node-fetch");
  console.log("\n   Or run individual curl commands from the README");
} else {
  testAllEndpoints();
}
