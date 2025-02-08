import { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";

const FakeTerminal = () => {
  const { theme } = useTheme();
  const [displayedText, setDisplayedText] = useState("");

  // Lines to type and then delete
  const fullText = [
    "Initializing DevSpace...",
    "Checking GPU acceleration...",
    "Loading AI-powered development tools...",
    "Ready to build the future!",
  ];

  const typingSpeed = 50;     // ms per character when typing
  const deletingSpeed = 30;   // ms per character when deleting
  const linePause = 1000;     // ms pause after a line is fully typed

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let isDeleting = false; 
    let timer;

    const typeAndDelete = () => {
      const currentLine = fullText[lineIndex];
      const updatedText = currentLine.slice(0, charIndex);

      setDisplayedText(updatedText);

      if (!isDeleting) {
        // Typing forward
        if (charIndex < currentLine.length) {
          charIndex++;
          timer = setTimeout(typeAndDelete, typingSpeed);
        } else {
          // Once fully typed, pause before deleting
          timer = setTimeout(() => {
            isDeleting = true;
            typeAndDelete();
          }, linePause);
        }
      } else {
        // Deleting backward
        if (charIndex > 0) {
          charIndex--;
          timer = setTimeout(typeAndDelete, deletingSpeed);
        } else {
          // Move on to the next line
          lineIndex++;
          isDeleting = false;

          // If we've typed all lines, start over
          if (lineIndex >= fullText.length) {
            lineIndex = 0;
          }
          timer = setTimeout(typeAndDelete, typingSpeed);
        }
      }
    };

    typeAndDelete();

    // Cleanup in case the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        ${theme.terminalBg}
        ${theme.text}
        font-mono
        p-4
        rounded-lg
        shadow-lg
        max-w-2xl
        mx-auto
        text-sm
        leading-relaxed
        border
        border-white/20
        backdrop-blur-md
      `}
    >
      <pre>{displayedText}</pre>
    </div>
  );
};

export default FakeTerminal;
