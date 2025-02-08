import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./accountReducer";
import * as client from "./client";

export default function Session({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const user = await client.checkSession();
      if (user) {
        dispatch(setCurrentUser(user));
      } else {
        dispatch(setCurrentUser(null));
      }
    } catch (err) {
      console.error("Session check failed:", err);
      dispatch(setCurrentUser(null));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return children;
}