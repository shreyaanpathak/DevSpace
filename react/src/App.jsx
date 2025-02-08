import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './Home/ThemeContext'
import Home from './Home'

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
        </Routes>    
      </HashRouter>
    </ThemeProvider>
  );
}

export default App
