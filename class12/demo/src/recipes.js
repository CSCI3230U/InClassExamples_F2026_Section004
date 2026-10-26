// Mock data: an array in the repo, like M2 asks for (no API yet).
export const recipes = [
  { id: "r1", name: "Pancakes", minutes: 20, tags: ["breakfast", "sweet"] },
  { id: "r2", name: "Tomato soup", minutes: 35, tags: ["lunch", "vegetarian"] },
  { id: "r3", name: "Pad thai", minutes: 30, tags: ["dinner"] },
  { id: "r4", name: "<img src=x onerror=alert('XSS')>", minutes: 1, tags: ["test"] },
];
