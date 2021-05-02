import React from 'react'
import { Cell, CellBroadcast, CellColor } from './Cell'
import { HslaColor } from '../lib/colors'
import { waveMap } from '../lib/maths'
import * as lobos from 'lobos'
import './App.css'
import { dayFractionNow } from '../lib/time'

const ACTIVATION_PERIOD = 750

interface AppProps {}

interface AppState {
  activationBroadcast?: CellBroadcast
  decayBroadcast?: CellBroadcast
  activationTimer?: any
  decayTimer?: any
}

class App extends React.Component<AppProps, AppState> {
  private readonly cellHeight: number
  private readonly cellWidth: number
  private readonly numberOfRows: number
  private readonly numberOfCols: number
  private readonly numberOfPoints: number
  private readonly safetyFactor: number = 1.2
  private readonly cellDenominator: number = 13

  private activationPointIndex: number = 0
  private decayPointIndex: number = 0

  constructor(props: AppProps) {
    super(props)
    this.state = {
      activationBroadcast: undefined,
      decayBroadcast: undefined,
      activationTimer: undefined,
      decayTimer: undefined
    }

    this.cellWidth = window.screen.width / this.cellDenominator
    this.cellHeight = window.screen.width / this.cellDenominator
    this.numberOfRows = Math.ceil(window.screen.height * this.safetyFactor / this.cellHeight)
    this.numberOfCols = Math.ceil(window.screen.width * this.safetyFactor / this.cellWidth)
    this.numberOfPoints = this.numberOfCols * this.numberOfRows
  }

  async sobolPoints(): Promise<number[][]> {
    const sequence = new lobos.Sobol(2)
    return sequence.take(this.numberOfPoints)
  }

  async getActivationPoints(n: number): Promise<number[][]> {
    const points = await this.sobolPoints()
    const result = points.slice(this.activationPointIndex, this.activationPointIndex + n)
    if (this.activationPointIndex + n + 1 > points.length) {
      // I'm lazy
      this.activationPointIndex = 0
    } else {
      this.activationPointIndex += n + 1
    }
    return result
  }

  async getDecayPoints(n: number): Promise<number[][]> {
    const points = await this.sobolPoints()
    const result = points.slice(this.decayPointIndex, this.decayPointIndex + n)
    this.decayPointIndex += n + 1
    return result
  }

  defaultColorMap(value: number): CellColor {
    const t = dayFractionNow()
    const foregroundLightness = waveMap(t, 0.7, 1, 0) + 0.1
    const foregroundSaturation = waveMap(t, 0.3, 1, 0.5) + 0.3;
    const backgroundLightness = waveMap(t, 0.5, 1, 0.5) + 0.1
    const backgroundAlpha = waveMap(t, 0.025, 1, 0.5) + 0.4
    const backgroundSaturation = waveMap(t, 0.2, 1, 0.5) + 0.2
    const hue = waveMap(value, 310, 22.5, 45)
    return {
      foreground: new HslaColor(hue, foregroundSaturation, foregroundLightness, 0.3),
      background: new HslaColor(hue, backgroundSaturation, backgroundLightness, backgroundAlpha)
    }
  }

  render() {
    let cells = []
    for (let r = 0; r < this.numberOfRows; r++) {
      for (let c = 0; c < this.numberOfCols; c++) {
        cells.push(
          <Cell
            key={r * 10000 + c}
            cellRowId={r}
            cellColId={c}
            activationBroadcast={this.state.activationBroadcast}
            decayBroadcast={this.state.decayBroadcast}
            colorMap={this.defaultColorMap}
            y={r * this.cellHeight}
            x={c * this.cellWidth}
            width={this.cellWidth}
            height={this.cellHeight}/>
        )
      }
    }

    return (
      <div className="app">
        <div className="cells-container">
          {cells}
        </div>
        <main id="main-content" className="content" style={{
          position: "absolute",
          top: `${this.cellHeight*1}px`,
          left: `${this.cellWidth*1}px`,
          width: `${this.cellWidth*5}px`,
          height: `${this.cellHeight*5}px`,
        }}>
          <h1 className="title">BITBAU</h1>
          <p>Hi, my name is Jev. I live in Switzerland and create digital systems for banks and
             other financial institutions.</p>

          <h2>Me on the Internet</h2>
          <p><a href="https://github.com/devjev">Github Profile</a></p>
          <p><a href="https://jevgeni.blog/">Blog</a></p>
        </main>
      </div>
    )
  }

  updateBaseColors() {
    // Update background color based on time of the day
    const t = dayFractionNow()
    const lightnessBody = waveMap(t, 0.985, 1, 0.5) + 0.015
    const backgroundColor = new HslaColor(0, 0, lightnessBody, 1)
    document.body.style.backgroundColor = backgroundColor.toColorString()

    // Update content area
    const lightnessContent = waveMap(t, 0.9, 1, 0.5) + 0.1
    const lightnessCopy = waveMap(t, 0.9, 1, 0) + 0.1
    const backgroundColorContent = new HslaColor(0, 0, lightnessContent, 0.6)
    const copyColor = new HslaColor(0, 0, lightnessCopy, 0.77)
    if (document.getElementById("main-content")) {
      // @ts-ignore
      document.getElementById("main-content").style.backgroundColor = backgroundColorContent.toColorString()
      // @ts-ignore
      document.getElementById("main-content").style.color = copyColor.toColorString()
    }
  }

  updateCellColors() {
    this.getActivationPoints(9).then((sobolPoints) => {
      const rows = sobolPoints.map(([_x, y]) => Math.floor(y * this.numberOfRows))
      const cols = sobolPoints.map(([x, _y]) => Math.floor(x * this.numberOfCols))
      this.setState({ ...this.state, activationBroadcast: { rows, cols } })
    })
  }

  componentDidMount() {
    // Initial cycle 5 times to get a nice initial picture
    for (let i = 0; i < 5; i++) {
      this.updateCellColors()
    }
    this.updateBaseColors()

    const activationTimer = setInterval(() => {
      this.updateCellColors()
      this.updateBaseColors()
    }, ACTIVATION_PERIOD)

    this.setState({ ...this.state, activationTimer })
  }

  componentWillUnmount() {
    clearInterval(this.state.activationTimer)
  }
}

export default App
