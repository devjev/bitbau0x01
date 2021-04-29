import * as React from 'react'
import { useState, useEffect } from 'react'
import { Color } from '../../lib/colors'
import './cell.css'

export interface CellColor {
  foreground: Color
  background: Color
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
    value: 0
  })

  // Cell Activation Effect
  useEffect(() => {
    if (props.activationBroadcast &&
      props.activationBroadcast.cols.includes(props.cellColId) &&
      props.activationBroadcast.rows.includes(props.cellRowId)) {
      const incremented = state.value + 1
      const newValue = incremented > 0xff ? 0 : incremented
      setState({ value: newValue })
    }
  }, [props.activationBroadcast, props.cellRowId, props.cellColId])

  // Cell Decay Effect
  useEffect(() => {
    if (props.decayBroadcast &&
      props.decayBroadcast.cols.includes(props.cellColId) &&
      props.decayBroadcast.rows.includes(props.cellRowId)) {
      const decremented = state.value - 1
      const newValue = decremented < 0 ? 0 : decremented
      setState({ value: newValue })
    }
  }, [props.decayBroadcast])

  const color = props.colorMap(state.value)

  return (
    <div className="cell" style={{
      width: `${props.width}px`,
      height: `${props.height}px`,
      position: 'absolute',
      top: `${props.y}px`,
      left: `${props.x}px`,
      color: `rgba(${color.foreground.red}, ${color.foreground.green}, ${color.foreground.blue}, ${color.foreground.alpha})`,
      backgroundColor: `rgba(${color.background.red}, ${color.background.green}, ${color.background.blue}, ${color.background.alpha})`
    }}>
      <div>{state.value.toString(16)}</div>
    </div>
  )
}
