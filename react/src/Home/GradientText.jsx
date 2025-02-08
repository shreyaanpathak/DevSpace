const GradientText = ({ children }) => {
  return (
    <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-transparent bg-clip-text bg-300% animate-gradient">
      {children}
    </span>
  );
};

export default GradientText;