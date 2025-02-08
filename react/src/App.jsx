import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Home/ThemeContext';
import Home from './Home';         // Public landing page
import Signin from './Account/Signin';       // Sign In page
import Signup from './Account/Signup';       // Sign Up page
import ProtectedRoute from './Account/ProtectedRoute'; // Checks for authentication

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/Signin" caseSensitive={false} element={<Signin />} />
          <Route path="/Signup" caseSensitive={false} element={<Signup />} />

          {/* Protected Route (e.g., Profile page) */}
          <Route
            path="/Profile"
            element={
              <ProtectedRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
