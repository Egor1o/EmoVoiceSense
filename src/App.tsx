
import './App.css'
import MainScreen from "./Screens/MainScreen.tsx";
import { PythonProvider } from 'react-py'

function App() {

  return (
    <>
      <PythonProvider>
          <MainScreen />
      </PythonProvider>
    </>
  )
}

export default App
