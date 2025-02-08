import { TypeAnimation } from 'react-type-animation';

const Terminal = () => {
  const terminalSequence = [
    'devspace init my-project', 1000,
    'Creating workspace...', 1000,
    'Setting up CUDA environment...', 1000,
    'Ready to code! 🚀', 1000,
  ];

  return (
    <div className="mockup-terminal bg-gray-900 text-gray-100 shadow-2xl rounded-lg overflow-hidden w-full border border-gray-700/50">
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-sm text-gray-400">terminal</div>
      </div>
      <div className="p-6 font-mono">
        <TypeAnimation
          sequence={terminalSequence}
          wrapper="div"
          cursor={true}
          repeat={Infinity}
          style={{ fontSize: '1rem' }}
          className="leading-loose"
        />
      </div>
    </div>
  );
};

export default Terminal;