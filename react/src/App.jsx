// App.jsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Home/ThemeContext';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkSession } from './Account/client';
import { setCurrentUser, setLoading } from './Account/accountReducer';

// Page Components
import Home from './Home';
import Signin from './Account/Signin';
import Signup from './Account/Signup';
import Profile from './Account/Profile';
import ProtectedRoute from './Account/ProtectedRoute';
import Codespace from './Codespace';

function App() {
  const dispatch = useDispatch();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const checkExistingSession = async () => {
      dispatch(setLoading(true));
      try {
        const user = await checkSession();
        console.log('Session check response:', user);
        dispatch(setCurrentUser(user));
      } catch (error) {
        console.error('Session check failed:', error);
        dispatch(setCurrentUser(null));
      } finally {
        dispatch(setLoading(false));
        setSessionChecked(true);
      }
    };

    checkExistingSession();
  }, [dispatch]);

  if (!sessionChecked) {
    return null;
  }

  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/devspaces"
            element={
              <ProtectedRoute>
                <Codespace />
              </ProtectedRoute>
            }
          />
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
