
// Simulate a network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let dummyUser = null;

export const signin = async (credentials) => {
  await delay(500); // simulate network delay
  // For testing, if the credentials match "test", return a dummy user.
  if (credentials.username === "test" && credentials.password === "test") {
    dummyUser = { id: "1", username: "test", email: "test@example.com" };
    return dummyUser;
  }
  throw new Error("Invalid credentials");
};

// Simulated sign up function
export const signup = async (userData) => {
  await delay(500);
  // For now, simply set the dummyUser and return it.
  dummyUser = { id: "1", ...userData };
  return dummyUser;
};

// Simulated check session function
export const checkSession = async () => {
  await delay(500);
  return dummyUser;
};

export const processPayment = async (paymentDetails) => {
  await delay(1000); // Simulate payment processing
  
  if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length !== 16) {
    throw new Error("Invalid card number");
  }
  
  if (!paymentDetails.expiryDate || !paymentDetails.expiryDate.includes('/')) {
    throw new Error("Invalid expiry date");
  }
  
  if (!paymentDetails.cvv || paymentDetails.cvv.length !== 3) {
    throw new Error("Invalid CVV");
  }
  
  return {
    success: true,
    transactionId: Math.random().toString(36).substring(2, 15)
  };
};
