// A content hash of plain data (a scene package, a final stand, a capture's class layers), free of three.js and the
// DOM (`node --test examples/pgmaps/content-hash.test.ts`): two values hash alike only when they hold the same
// numbers, strings and structure in the same order. The adapter keeps what it built for a package while the next
// package's hash is the same (pgmaps-scene.ts), so nothing is sampled: every number of every array is read.
//
// 128 bits in four 32-bit lanes. A number goes in as the two words of its double (so -0 is not 0, and 1 is not '1');
// typed arrays go in as their bytes. Everything is written with its kind and length first (an array's numbers in runs),
// so two different values never write the same words. Each lane's step is a bijection of the lane for the word it
// takes, and each word goes into two lanes, so two values that differ in one number never hash alike; values that
// differ in more hash alike with a chance of about 2^-64 or less (not a cryptographic hash: nothing here defends
// against a crafted package). Key order counts: the same fields in another order hash differently, which only costs a
// rebuild.

const f64 = new Float64Array(1), u32 = new Uint32Array(f64.buffer);

/** What comes next (a plain object, not an enum: Node runs this file by stripping its types). */
const Tag = { Null: 1, Undefined: 2, True: 3, False: 4, Number: 5, Numbers: 6, String: 7, Array: 8, Object: 9, Typed: 10, Other: 11 } as const;

/** The 128-bit content hash of `value` as 32 hex digits. */
export function contentHash(value: unknown): string {
  let h1 = 0x9e3779b9, h2 = 0x85ebca6b, h3 = 0xc2b2ae35, h4 = 0x27d4eb2f;
  /** Two words in: `a` into lanes 1 and 3, `b` into lanes 2 and 4. */
  const take = (a: number, b: number): void => {
    h1 = Math.imul(h1 ^ a, 0x9e3779b1); h1 ^= h1 >>> 15;
    h2 = Math.imul(h2 ^ b, 0x85ebca77); h2 ^= h2 >>> 13;
    h3 = Math.imul(h3 ^ a, 0xc2b2ae3d); h3 ^= h3 >>> 16;
    h4 = Math.imul(h4 ^ b, 0x27d4eb2f); h4 ^= h4 >>> 14;
  };
  const text = (s: string): void => {
    take(Tag.String, s.length);
    for (let i = 0; i + 1 < s.length; i += 2) take(s.charCodeAt(i), s.charCodeAt(i + 1));
    if (s.length & 1) take(s.charCodeAt(s.length - 1), 0x5bd1e995);
  };
  const bytes = (v: ArrayBufferView): void => {
    take(Tag.Typed, v.byteLength);
    text(Object.prototype.toString.call(v)); // (a Float32Array is not a Uint8Array of the same bytes)
    const whole = v.byteLength >>> 2;
    // (the bytes as 32-bit words where they are, when they start on a word; else a copy that does)
    const words = v.byteOffset % 4 === 0 ? new Uint32Array(v.buffer, v.byteOffset, whole) : new Uint32Array(new Uint8Array(v.buffer, v.byteOffset, whole * 4).slice().buffer);
    // (`take`, two words a turn, on the lanes as locals: a final stand's 43 MB of stems is hashed for every capture)
    let a1 = h1, a2 = h2, a3 = h3, a4 = h4, i = 0;
    for (; i + 1 < whole; i += 2) {
      const a = words[i], b = words[i + 1];
      a1 = Math.imul(a1 ^ a, 0x9e3779b1); a1 ^= a1 >>> 15;
      a2 = Math.imul(a2 ^ b, 0x85ebca77); a2 ^= a2 >>> 13;
      a3 = Math.imul(a3 ^ a, 0xc2b2ae3d); a3 ^= a3 >>> 16;
      a4 = Math.imul(a4 ^ b, 0x27d4eb2f); a4 ^= a4 >>> 14;
    }
    (h1 = a1), (h2 = a2), (h3 = a3), (h4 = a4);
    if (i < whole) take(words[i], 0x5bd1e995);
    const tail = new Uint8Array(v.buffer, v.byteOffset + whole * 4, v.byteLength - whole * 4);
    for (const b of tail) take(b, 0x165667b1);
  };
  const walk = (v: unknown): void => {
    if (typeof v === 'number') {
      take(Tag.Number, 0);
      f64[0] = v;
      take(u32[0], u32[1]);
    } else if (v === null) take(Tag.Null, 0);
    else if (v === undefined) take(Tag.Undefined, 0);
    else if (typeof v === 'string') text(v);
    else if (typeof v === 'boolean') take(v ? Tag.True : Tag.False, 0);
    else if (Array.isArray(v)) {
      const n = v.length;
      take(Tag.Array, n);
      for (let i = 0; i < n; ) {
        if (typeof v[i] !== 'number') {
          walk(v[i++]);
          continue;
        }
        // (numbers, most of a package: a run's length, then each one's two words)
        let end = i + 1;
        while (end < n && typeof v[end] === 'number') end++;
        take(Tag.Numbers, end - i);
        for (; i < end; i++) {
          f64[0] = v[i] as number;
          take(u32[0], u32[1]);
        }
      }
    } else if (ArrayBuffer.isView(v)) bytes(v);
    else if (v instanceof ArrayBuffer) bytes(new Uint8Array(v));
    else if (typeof v === 'object') {
      const keys = Object.keys(v as object);
      take(Tag.Object, keys.length);
      for (const k of keys) {
        text(k);
        walk((v as Record<string, unknown>)[k]);
      }
    } else {
      take(Tag.Other, 0);
      text(String(v));
    }
  };
  walk(value);
  // the lanes folded into each other (each step a bijection of the four), then spread
  const fmix = (h: number): number => {
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35);
    return h ^ (h >>> 16);
  };
  h1 = fmix(h1); h2 = fmix(h2 ^ h1); h3 = fmix(h3 ^ h2); h4 = fmix(h4 ^ h3); h1 = fmix(h1 ^ h4);
  const hex = (h: number): string => (h >>> 0).toString(16).padStart(8, '0');
  return hex(h1) + hex(h2) + hex(h3) + hex(h4);
}

/**
 * A scene package's key: its content hash with `createdAt` left out (PGMaps stamps each package it writes, so two
 * packages of one scene differ there and nowhere else; the adapter reads `createdAt` for the reply and, when the
 * environment carries no instant, for the view's year, and handles both itself).
 */
export function sceneKey(scene: object): string {
  return contentHash({ ...scene, createdAt: undefined });
}
