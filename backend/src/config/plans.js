// backend/src/config/plans.js
export const PLANS = {
  FREE: {
    limit: 5,
    reset: "daily",
  },
  STARTER: {
    limit: 50,
    reset: "monthly",
  },
  PRO: {
    limit: 200,
    reset: "monthly",
  },
};
