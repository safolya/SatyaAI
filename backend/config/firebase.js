const admin = require("firebase-admin");
require("dotenv").config();

function assertEnvVar(name) {
  const value = process.env[name];
  if (!value || typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `Missing required env var: ${name}. Create backend/.env from backend/env.template and fill this field.`
    );
  }
  return value;
}

// Validate required env vars early with helpful errors
const FIREBASE_PROJECT_ID = assertEnvVar("FIREBASE_PROJECT_ID");
const FIREBASE_PRIVATE_KEY_ID = assertEnvVar("FIREBASE_PRIVATE_KEY_ID");
const FIREBASE_PRIVATE_KEY_RAW = assertEnvVar("FIREBASE_PRIVATE_KEY");
const FIREBASE_CLIENT_EMAIL = assertEnvVar("FIREBASE_CLIENT_EMAIL");
const FIREBASE_CLIENT_ID = assertEnvVar("FIREBASE_CLIENT_ID");
const FIREBASE_AUTH_URI = assertEnvVar("FIREBASE_AUTH_URI");
const FIREBASE_TOKEN_URI = assertEnvVar("FIREBASE_TOKEN_URI");
const FIREBASE_AUTH_PROVIDER_X509_CERT_URL = assertEnvVar(
  "FIREBASE_AUTH_PROVIDER_X509_CERT_URL"
);
const FIREBASE_CLIENT_X509_CERT_URL = assertEnvVar(
  "FIREBASE_CLIENT_X509_CERT_URL"
);

// Normalize private key newlines
const FIREBASE_PRIVATE_KEY = FIREBASE_PRIVATE_KEY_RAW.replace(/\\n/g, "\n");

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "service_account",
  project_id: FIREBASE_PROJECT_ID,
  private_key_id: FIREBASE_PRIVATE_KEY_ID,
  private_key: FIREBASE_PRIVATE_KEY,
  client_email: FIREBASE_CLIENT_EMAIL,
  client_id: FIREBASE_CLIENT_ID,
  auth_uri: FIREBASE_AUTH_URI,
  token_uri: FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
};

// Initialize the app if it hasn't been initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (err) {
    // Hide sensitive values while giving actionable info
    const redacted = { ...serviceAccount, private_key: "[REDACTED]" };
    console.error(
      "Failed to initialize Firebase Admin. Check your .env values match the service account JSON.",
      { expectedKeys: Object.keys(redacted) }
    );
    throw err;
  }
}

module.exports = admin;
