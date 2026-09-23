const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const fs = require("fs");
const path = require("path");

let firebaseAuth = null;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

const candidatePaths = serviceAccountPath
  ? [serviceAccountPath, path.resolve(__dirname, "..", serviceAccountPath)]
  : [];

const resolvedServiceAccount = candidatePaths.find((p) => fs.existsSync(p));

if (resolvedServiceAccount) {
  try {
    const serviceAccount = require(path.resolve(resolvedServiceAccount));

    const app = initializeApp({
      credential: cert(serviceAccount),
    });

    firebaseAuth = getAuth(app);
    console.log("✅ Firebase Admin SDK initialized");
  } catch (error) {
    console.error("⚠️  Failed to initialize Firebase Admin SDK:", error.message);
  }
} else {
  console.warn(
    "⚠️  Firebase Admin SDK not configured (FIREBASE_SERVICE_ACCOUNT_PATH missing or file not found). Google sign-in via Firebase will return 503."
  );
}

module.exports = firebaseAuth;