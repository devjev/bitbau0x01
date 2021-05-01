/**
 * Map arbitrary value to a wave.
 * Calculated according to the following formula:
 * y = scale/2 + scale/2 * cos((2 pi (x - offset)) / wavelength)
 * @param {number} value
 * @param {number} scale
 * @param {number} wavelength
 * @param {number} offset
 */
export function waveMap(value: number, scale: number, wavelength: number, offset: number): number {
  return (scale / 2) + (scale / 2) * Math.cos(2 * Math.PI * (value - offset) / wavelength)
}
