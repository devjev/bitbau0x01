import React from 'react'
import { Cell, CellBroadcast, CellColor } from './Cell'
import './App.css'

const ACTIVATION_PERIOD = 250
const DECAY_PERIOD = 3000

interface AppProps {}

interface AppState {
  activationBroadcast?: CellBroadcast
  decayBroadcast?: CellBroadcast
  activationTimer?: any
  decayTimer?: any
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
    this.state = {
      activationBroadcast: undefined,
      decayBroadcast: undefined,
      activationTimer: undefined,
      decayTimer: undefined
    }
  }

  cellWidth(): number {
    return Math.ceil(window.screen.width / 72)
  }

  cellHeight(): number {
    return this.cellWidth()
  }

  numberOfRows(): number {
    return Math.ceil(window.screen.height * 1.2 / this.cellHeight())
  }

  numberOfCols(): number {
    return Math.ceil(window.screen.width * 1.2 / this.cellWidth())
  }

  defaultColorMap(value: number): CellColor {
    return {
      foreground: {
        red: value,
        green: value,
        blue: value,
        alpha: value === 0 ? 0.0 : 1.0
      },
      background: {
        red: 255 - value,
        green: 255 - value,
        blue: 255 - value,
        alpha: 0.45
      },
    }
  }

  render() {
    let cells = []
    for (let r = 0; r < this.numberOfRows(); r++) {
      for (let c = 0; c < this.numberOfCols(); c++) {
        cells.push(
          <Cell
            key={r*10000 + c}
            cellRowId={r}
            cellColId={c}
            activationBroadcast={this.state.activationBroadcast}
            decayBroadcast={this.state.decayBroadcast}
            colorMap={this.defaultColorMap}
            y={r * this.cellHeight()}
            x={c * this.cellWidth()}
            width={this.cellWidth()}
            height={this.cellHeight()}/>
        )
      }
    }

    return (
      <div className="app">
        <div className="cells-container">
          {cells}
        </div>
      </div>
    )
  }

  componentDidMount() {
    const activationTimer = setInterval(() => {
      const numberOfCoordinates = 16
      const rows = Array.from({length: numberOfCoordinates}, () => Math.floor(Math.random() * this.numberOfRows()))
      const cols = Array.from({length: numberOfCoordinates}, () => Math.floor(Math.random() * this.numberOfCols()))
      this.setState({ ...this.state, activationBroadcast: { rows, cols } })
    }, ACTIVATION_PERIOD)

    const decayTimer = setInterval(() => {
      const numberOfCoordinates = 16
      const rows = Array.from({length: numberOfCoordinates}, () => Math.floor(Math.random() * this.numberOfRows()))
      const cols = Array.from({length: numberOfCoordinates}, () => Math.floor(Math.random() * this.numberOfCols()))
      this.setState({ ...this.state, decayBroadcast: { rows, cols } })
    }, DECAY_PERIOD)

    this.setState({...this.state, activationTimer, decayTimer});
  }

  componentWillUnmount() {
    clearInterval(this.state.activationTimer)
    clearInterval(this.state.decayTimer)
  }
}

export default App
