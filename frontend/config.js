/* file: frontend/config.js */
"use strict";

window.GOOGLE_CLIENT_ID = "348148364673-pmqok6ms5okg261u7vn7v5c3g5nmm4vh.apps.googleusercontent.com";

/**
 * Global runtime config (loaded by index.html if you want).
 * NOTE: Keep URLs CLEAN (no markdown, no brackets).
 */
window.VOICESAFE_SAFE_CONFIG = Object.freeze({
  URLS: {
    PROD: {
      BACKEND: "https://voicesafe.onrender.com",
      AI: "https://voicesafe-ai-mmnf.onrender.com"
    },
    LOCAL: {
      BACKEND: "http://127.0.0.1:10000",
      AI: "http://127.0.0.1:8000"
    }
  },


  STRIPE: {
    CHECKOUT_URL: "https://buy.stripe.com/aFa3cn42A8Iq1cC8m2gA800",
    BILLING_PORTAL_URL: ""
  },

  POLICY: {
    FREE_LIMIT: 3,
    MAX_UPLOAD_MB: 25,
    TIMEOUT_MS: 120000,
    HEALTH_TIMEOUT_MS: 12000,
    UI_MIN_SPINNER_MS: 700,
    RETRY_ON_NETWORK: 1
  }
});
