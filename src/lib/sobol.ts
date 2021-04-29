// Generating Sobol Numbers
// See https://people.sc.fsu.edu/~jburkardt/py_src/sobol/sobol.html
//     https://web.maths.unsw.edu.au/~fkuo/sobol/


/**
 * Calculate a Gray code (reflected binary code) for i
 * @param {number} i
 */
export function gray(i: number): number {
  return i ^ Math.floor(i / 2)
}

/**
 * Find the bit order number between G(i-1) and G(i)
 * @param i
 */
export function diffBit(i: number): number {
  return 1 + Math.log2(gray(i - 1) ^ gray(i))
}
