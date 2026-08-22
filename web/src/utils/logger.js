export const logger = {
  info: (message, meta = {}) => {
    console.info(`[INFO] ${message}`, meta);
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${message}`, meta);
  }
};
