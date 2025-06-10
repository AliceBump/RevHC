import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useCurrentUser, setCurrentUser } from './store/userStore'

function App() {
  const [count, setCount] = useState(0)
  const currentUser = useCurrentUser()

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() =>
              setCurrentUser({ id: '1', name: 'Jane Doe', role: 'patient' })
            }
          >
            Set Patient User
          </button>
          <button
            onClick={() =>
              setCurrentUser({ id: '2', name: 'Dr. Smith', role: 'provider' })
            }
            style={{ marginLeft: '0.5rem' }}
          >
            Set Provider User
          </button>
        </div>
      </div>
      {currentUser && (
        <p className="read-the-docs">Current User: {currentUser.name}</p>
      )}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
