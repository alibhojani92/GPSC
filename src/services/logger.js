export function logInfo(message, meta = {}) {
  console.log(JSON.stringify({
    level: "INFO",
    message,
    meta,
    time: new Date().toISOString()
  }));
}

export function logError(message, meta = {}) {
  console.error(JSON.stringify({
    level: "ERROR",
    message,
    meta,
    time: new Date().toISOString()
  }));
}
