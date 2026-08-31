const memoryStore = new Map();
const STORE_TTL_SECONDS = 7 * 24 * 60 * 60;

let redisClient = null;
let redisAvailable = false;

const buildRedisClient = () => {
  try {
    const { createClient } = require("redis");
    const client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    client.on("error", () => {
      redisAvailable = false;
    });

    return client;
  } catch {
    return null;
  }
};

const getRedis = async () => {
  if (!redisClient) {
    redisClient = buildRedisClient();
  }

  if (!redisClient) {
    return null;
  }

  if (!redisAvailable) {
    try {
      await redisClient.connect();
      redisAvailable = true;
    } catch {
      redisAvailable = false;
      return null;
    }
  }

  return redisClient;
};

const storeRefreshToken = async (sessionId, refreshToken) => {
  if (!sessionId || !refreshToken) {
    return null;
  }

  const redis = await getRedis();

  if (redis) {
    await redis.set(sessionId, refreshToken, { EX: STORE_TTL_SECONDS });
    return sessionId;
  }

  memoryStore.set(sessionId, { refreshToken, expiresAt: Date.now() + STORE_TTL_SECONDS * 1000 });
  return sessionId;
};

const getRefreshToken = async (sessionId) => {
  if (!sessionId) {
    return null;
  }

  const redis = await getRedis();

  if (redis) {
    const token = await redis.get(sessionId);
    if (!token) {
      return null;
    }
    return token;
  }

  const entry = memoryStore.get(sessionId);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(sessionId);
    return null;
  }

  return entry.refreshToken;
};

const deleteRefreshToken = async (sessionId) => {
  if (!sessionId) return;

  const redis = await getRedis();

  if (redis) {
    await redis.del(sessionId);
  }

  memoryStore.delete(sessionId);
};

const clearExpiredSessions = async () => {
  const redis = await getRedis();

  if (redis) {
    const keys = await redis.keys("*");
    for (const key of keys) {
      const ttl = await redis.ttl(key);
      if (ttl === -1 || ttl === -2) {
        await redis.del(key);
      }
    }
    return;
  }

  for (const [sessionId, entry] of memoryStore.entries()) {
    if (Date.now() > entry.expiresAt) {
      memoryStore.delete(sessionId);
    }
  }
};

module.exports = {
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  clearExpiredSessions,
};
