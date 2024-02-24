
import './App.css'
import MainScreen from "./Screens/MainScreen.tsx";
import { PythonProvider } from 'react-py'
import {useEffect} from "react";

function App() {
  useEffect(() => {
    navigator.serviceWorker
      .register('/react-py-sw.js')
      .then((registration) =>
        console.log(
          'Service Worker registration successful with scope: ',
          registration.scope
        )
      )
      .catch((err) => console.log('Service Worker registration failed: ', err))
  }, [])
  return (
    <>
      <PythonProvider>
          <MainScreen />
      </PythonProvider>
    </>
  )
}

export default App
