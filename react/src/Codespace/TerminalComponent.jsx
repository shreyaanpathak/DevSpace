import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { FaTerminal, FaPlay, FaStop } from "react-icons/fa";

const TerminalComponent = () => {
    const { theme } = useTheme();
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const [isRunning, setIsRunning] = useState(false);
    const [commands, setCommands] = useState([
        { type: 'command', content: 'python main.py' },
        { type: 'output', content: 'Using device: cuda' },
        { type: 'output', content: 'Loading CUDA kernels...' },
        { type: 'success', content: 'Computation completed successfully!' }
    ]);

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'monospace'
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.loadAddon(new WebLinksAddon());

        if (terminalRef.current) {
            term.open(terminalRef.current);
            setTimeout(() => {
                fitAddon.fit();
            }, 100);
            xtermRef.current = term;

            commands.forEach(cmd => {
                if (cmd.type === 'command') {
                    term.write(`$ ${cmd.content}\r\n`);
                } else if (cmd.type === 'success') {
                    term.write(`\x1b[32m${cmd.content}\x1b[0m\r\n`);
                } else {
                    term.write(`${cmd.content}\r\n`);
                }
            });

            term.write('\r\n$ ');

            term.onKey(({ key, domEvent }) => {
                const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

                if (domEvent.keyCode === 13) {
                    const line = term.buffer.active.getLine(term.buffer.active.cursorY);
                    const command = line.translateToString().trim().replace('$ ', '');
                    handleCommand(command, term);
                } else if (domEvent.keyCode === 8) {
                    if (term.buffer.active.cursorX > 2) {
                        term.write('\b \b');
                    }
                } else if (printable) {
                    term.write(key);
                }
            });

            const handleResize = () => {
                fitAddon.fit();
            };
            window.addEventListener('resize', handleResize);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                term.dispose();
            };
        }
    }, []);

    useEffect(() => {
        if (xtermRef.current) {
            xtermRef.current.options.theme = {
                background: theme.monacoBackground,
                foreground: theme.monacoForeground,
                cursor: theme.monacoForeground,
                selection: theme.monacoForeground + '40',
                black: '#000000',
                red: '#E06C75',
                green: '#98C379',
                yellow: '#E5C07B',
                blue: '#61AFEF',
                magenta: '#C678DD',
                cyan: '#56B6C2',
                white: '#ABB2BF',
            };
        }
    }, [theme]);

    const handleCommand = (command, term) => {
        term.write('\r\n');

        switch (command.toLowerCase()) {
            case 'clear':
                term.clear();
                break;
            case 'help':
                term.writeln('Available commands:');
                term.writeln('  clear     - Clear the terminal');
                term.writeln('  help      - Show this help message');
                term.writeln('  python    - Run Python commands');
                term.writeln('  ls        - List files');
                term.writeln('  pwd       - Print working directory');
                break;
            case 'python main.py':
                setIsRunning(true);
                term.writeln('Using device: cuda');
                term.writeln('Loading CUDA kernels...');
                setTimeout(() => {
                    term.write('\x1b[32mComputation completed successfully!\x1b[0m\r\n');
                    setIsRunning(false);
                }, 2000);
                break;
            case 'ls':
                term.writeln('main.py');
                term.writeln('README.md');
                term.writeln('requirements.txt');
                break;
            case 'pwd':
                term.writeln('/workspace/project');
                break;
            case '':
                break;
            default:
                term.writeln(`Command not found: ${command}`);
        }

        term.write('$ ');
    };

    const handlePlay = () => {
        if (xtermRef.current && !isRunning) {
            setIsRunning(true);
            handleCommand('python main.py', xtermRef.current);
        }
    };

    const handleStop = () => {
        if (isRunning) {
            setIsRunning(false);
            if (xtermRef.current) {
                xtermRef.current.writeln('\x1b[31mExecution stopped by user\x1b[0m');
                xtermRef.current.write('$ ');
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full overflow-hidden flex-shrink-0 w-full"
        >
            <motion.div 
                className="flex items-center justify-between px-4 py-3 border-b border-white/5 backdrop-blur-md"
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            >
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ 
                            rotate: [0, 5, 0, -5, 0],
                            transition: { repeat: Infinity, duration: 5 }
                        }}
                    >
                        <FaTerminal className="text-gray-400" />
                    </motion.div>
                    <span className={`${theme.text}`}>Terminal</span>
                </div>
                <div className="flex gap-2">
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 hover:bg-white/10 rounded-[7px]"
                        onClick={handlePlay}
                        disabled={isRunning}
                    >
                        <FaPlay className={isRunning ? "text-gray-400" : "text-green-400"} />
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 hover:bg-white/10 rounded-[7px]"
                        onClick={handleStop}
                        disabled={!isRunning}
                    >
                        <FaStop className={!isRunning ? "text-gray-400" : "text-red-400"} />
                    </motion.button>
                </div>
            </motion.div>
            
            <div 
                ref={terminalRef} 
                className={`flex-1 ${theme.terminalBg} overflow-hidden`}
                style={{ 
                    padding: '12px',
                    position: 'relative',
                    minHeight: 0,
                    width: '100%',
                    maxWidth: '100%',
                    height: '100%'
                }}
            />
        </motion.div>
    );
};

export default TerminalComponent;