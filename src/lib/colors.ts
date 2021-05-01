export class HslaColor {
  private readonly _hue: number
  private readonly _saturation: number
  private readonly _lightness: number
  private readonly _alpha: number

  constructor(hue: number, saturation: number, lightness: number, alpha: number) {
    this._hue = hue
    this._saturation = saturation
    this._lightness = lightness
    this._alpha = alpha
  }

  toColorString(): string {
    const h = Math.floor(this._hue)
    const s = Math.floor(this._saturation*100)
    const l = Math.floor(this._lightness*100)
    return `hsla(${h},${s}%,${l}%,${this._alpha})`
  }
}

export type Color = HslaColor | string

