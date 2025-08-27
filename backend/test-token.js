const admin = require("./config/firebase");

async function generateTestToken() {
  try {
    const uid = "IntUgThFntdzfCk1WWZnUht7iIa2";

    // Create a custom token for your user
    const customToken = await admin.auth().createCustomToken(uid);

    console.log("🎯 Test Token Generated Successfully!");
    console.log("=====================================");
    console.log(`User UID: ${uid}`);
    console.log(`Custom Token: ${customToken}`);
    console.log("\n📋 Use this token in your curl commands:");
    console.log(`curl -H "Authorization: Bearer ${customToken}" ...`);

    // Also verify the user exists
    try {
      const userRecord = await admin.auth().getUser(uid);
      console.log("\n✅ User verified in Firebase:");
      console.log(`   Email: ${userRecord.email || "N/A"}`);
      console.log(`   Display Name: ${userRecord.displayName || "N/A"}`);
      console.log(`   Created: ${userRecord.metadata.creationTime}`);
    } catch (userError) {
      console.log(
        "\n⚠️  User not found in Firebase (this is normal for custom tokens)"
      );
    }
  } catch (error) {
    console.error("❌ Failed to generate token:", error.message);
    if (error.code === "app/invalid-credential") {
      console.error("   Check your Firebase configuration in .env file");
    }
  }
}

generateTestToken();
