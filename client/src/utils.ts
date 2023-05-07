export const sleepMs = async (timeMs) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
};
