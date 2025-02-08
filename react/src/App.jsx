import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './Home/ThemeContext'
import Home from './Home'
import Codespace from './Codespace' // Import the new component

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Codespace" element={<Codespace/>} /> {/* Add new route */}
        </Routes>    
      </HashRouter>
    </ThemeProvider>
  );
}

export default App