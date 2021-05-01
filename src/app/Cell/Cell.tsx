import * as React from 'react'
import { useState, useEffect } from 'react'
import { HslaColor } from '../../lib/colors'
import './cell.css'

export interface CellColor {
  foreground: HslaColor
  background: HslaColor
}

/**
 *
 */
export interface CellBroadcast {
  rows: number[]
  cols: number[]
}

/**
 *
 */
export interface CellProps {
  activationBroadcast?: CellBroadcast
  decayBroadcast?: CellBroadcast
  cellRowId: number
  cellColId: number
  width: number
  height: number
  x: number
  y: number
  colorMap: (value: number) => CellColor
}

/**
 *
 * @param props
 * @constructor
 */
export function Cell<T extends CellProps>(props: T) {
  const [state, setState] = useState({
    value: 0,
    foreground: new HslaColor(0, 1, 1, 0),
    background: new HslaColor(0, 1, 1, 0)
  })

  // Cell Activation Effect
  useEffect(() => {
    if (props.activationBroadcast &&
      props.activationBroadcast.cols.includes(props.cellColId) &&
      props.activationBroadcast.rows.includes(props.cellRowId)) {
      const incremented = state.value + 1
      const newValue = incremented > 0xff ? 0 : incremented
      const cellColor = props.colorMap(newValue)
      setState({ ...state, value: newValue, foreground: cellColor.foreground, background: cellColor.background })
    }
  }, [props.activationBroadcast, props.cellRowId, props.cellColId])

  // Cell Decay Effect
  useEffect(() => {
    if (props.decayBroadcast &&
      props.decayBroadcast.cols.includes(props.cellColId) &&
      props.decayBroadcast.rows.includes(props.cellRowId)) {
      const decremented = state.value - 1
      const newValue = decremented < 0 ? 0 : decremented
      setState({ ...state, value: newValue })
    }
  }, [props.decayBroadcast])

  return (
    <div className="cell" style={{
      width: `${props.width}px`,
      height: `${props.height}px`,
      position: 'absolute',
      top: `${props.y}px`,
      left: `${props.x}px`,
      color: state.foreground.toColorString(),
      backgroundColor: state.background.toColorString()
    }}>
      <div>{state.value.toString(16)}</div>
    </div>
  )
}
