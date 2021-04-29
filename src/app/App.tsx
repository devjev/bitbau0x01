import React from 'react'
import logo from '../assets/logo.svg'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p style={{ backgroundColor: 'rgba(255, 0, 0, 1)' }}>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank"
           rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
