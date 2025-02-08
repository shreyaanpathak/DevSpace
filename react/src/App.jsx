import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Home/ThemeContext';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkSession } from './Account/client';
import { setCurrentUser } from './Account/accountReducer';

// Page Components
import Home from './Home';
import Signin from './Account/Signin';
import Signup from './Account/Signup';
import Profile from './Account/Profile';
import ProtectedRoute from './Account/ProtectedRoute';
import Codespace from './Codespace';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing session on app load
    const checkExistingSession = async () => {
      try {
        const user = await checkSession();
        if (user) {
          dispatch(setCurrentUser(user));
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkExistingSession();
  }, [dispatch]);

  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" caseSensitive={false} element={<Signin />} />
          <Route path="/signup" caseSensitive={false} element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route caseSensitive={false}
            path="/Devspaces"
            element={
              <ProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 - you can create a NotFound component */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-4xl text-gray-200">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
