import { useState, useEffect } from "react";

const FakeTerminal = () => {
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
    let isDeleting = false; // tracks whether we are currently deleting text

    // Recursive function to handle typing & deleting
    const typeAndDelete = () => {
      const currentLine = fullText[lineIndex];
      let updatedText = currentLine.slice(0, charIndex);

      setDisplayedText(updatedText);

      if (!isDeleting) {
        // Typing forward
        if (charIndex < currentLine.length) {
          charIndex++;
          setTimeout(typeAndDelete, typingSpeed);
        } else {
          // Once the line is fully typed, pause briefly before deleting
          setTimeout(() => {
            isDeleting = true;
            setTimeout(typeAndDelete, deletingSpeed);
          }, linePause);
        }
      } else {
        // Deleting backward
        if (charIndex > 0) {
          charIndex--;
          setTimeout(typeAndDelete, deletingSpeed);
        } else {
          // Line fully deleted
          lineIndex++;
          isDeleting = false;
          if (lineIndex < fullText.length) {
            // Move on to the next line after a brief pause
            setTimeout(typeAndDelete, typingSpeed);
          }
        }
      }
    };

    typeAndDelete();
  }, []);

  return (
    <div
      className="
        bg-white/10
        backdrop-blur-md
        text-green-400
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
      "
    >
      <pre>{displayedText}</pre>
    </div>
  );
};

export default FakeTerminal;
