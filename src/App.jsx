import { useState } from 'react'
import MenuBar from './components/MenuBar'
import DreamChat from './components/DreamChat'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <MenuBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <DreamChat isDarkMode={isDarkMode} />
    </div>
  )
}

export default App
