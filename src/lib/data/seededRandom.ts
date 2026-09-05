// Deterministic pseudo-random seed from a string, so the same input
// always produces the same "random" output instead of jittering on
// every render — shared by every part of the app that fabricates
// stable illustrative variation (other-retailer offers, price
// history, etc.) around a product's real data.
export function seedFromString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}
