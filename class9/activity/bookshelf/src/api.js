/* ===========================================================================
   api.js: a fetch that pretends the network is slow.
   Local files load in a few milliseconds, too fast to see anything wait.
   slowFetch waits `ms` milliseconds first, then does a normal fetch.
   Today this file becomes api.ts.
   =========================================================================== */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function slowFetch(url, ms = 1000) {
  await sleep(ms);
  return fetch(url);
}
