/* ===========================================================================
   api.ts: a fetch that pretends the network is slow.
   Local files load in a few milliseconds, too fast to see anything wait.
   slowFetch waits `ms` milliseconds first, then does a normal fetch.
   CSCI 3230U · Lecture 05b activity - solution
   =========================================================================== */

// WARM-UP: a parameter needs an annotation. TypeScript can't guess it.
// The return type is inferred: hover over `sleep` to see Promise<unknown>.
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// `ms = 1000` needs no annotation: the default value gives it the type number.
export async function slowFetch(url: string, ms = 1000) {
  await sleep(ms);
  return fetch(url);
}
