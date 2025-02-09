import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../Home/ThemeContext";
import { useSelector } from "react-redux";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { FaTerminal, FaPlay, FaStop } from "react-icons/fa";

const TerminalComponent = () => {
    const { theme } = useTheme();
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const wsRef = useRef(null);
    const [isRunning, setIsRunning] = useState(false);
    const currentFile = useSelector(state => state.file.currentFile);

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'monospace',
            theme: {
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
            }
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
            term.write('$ ');

            const handleResize = () => {
                fitAddon.fit();
            };
            window.addEventListener('resize', handleResize);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                term.dispose();
            };
        }
    }, [theme]);

    useEffect(() => {
        const connectWebSocket = () => {
            const ws = new WebSocket('ws://172.20.10.2:8000/ws');

            ws.onopen = () => {
                if (xtermRef.current) {
                    xtermRef.current.writeln('\r\n\x1b[32mConnected to execution server\x1b[0m');
                    xtermRef.current.write('\r\n$ ');
                }
            };

            ws.onmessage = (event) => {
                if (xtermRef.current) {
                    try {
                        const data = JSON.parse(event.data);
                        switch (data.type) {
                            case 'output':
                                xtermRef.current.writeln('\r\n' + data.data);
                                break;
                            case 'error':
                                xtermRef.current.writeln('\r\n\x1b[31m' + data.data + '\x1b[0m');
                                break;
                            case 'status':
                                if (data.status === 'complete') {
                                    setIsRunning(false);
                                    xtermRef.current.writeln('\r\n\x1b[32mExecution completed (exit code: ' + data.exit_code + ')\x1b[0m');
                                    xtermRef.current.write('\r\n$ ');
                                }
                                break;
                            default:
                                xtermRef.current.writeln('\r\n' + JSON.stringify(data));
                        }
                    } catch (error) {
                        xtermRef.current.writeln('\r\n' + event.data);
                    }
                }
            };

            ws.onclose = () => {
                if (xtermRef.current) {
                    xtermRef.current.writeln('\r\n\x1b[31mDisconnected from execution server\x1b[0m');
                    xtermRef.current.write('\r\n$ ');
                }
                setTimeout(connectWebSocket, 5000);
            };

            ws.onerror = (error) => {
                if (xtermRef.current) {
                    xtermRef.current.writeln('\r\n\x1b[31mWebSocket error: ' + error.message + '\x1b[0m');
                    xtermRef.current.write('\r\n$ ');
                }
            };

            wsRef.current = ws;
        };

        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const handleExecution = async () => {
        if (!currentFile || !currentFile.content) {
            if (xtermRef.current) {
                xtermRef.current.writeln('\r\n\x1b[31mNo file selected for execution\x1b[0m');
                xtermRef.current.write('\r\n$ ');
            }
            return;
        }

        try {
            setIsRunning(true);
            if (xtermRef.current) {
                xtermRef.current.writeln('\r\nStarting execution...');
            }

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                const fileData = {
                    filename: currentFile.filename,
                    language: currentFile.language || 'python',
                    content: currentFile.content
                };
                wsRef.current.send(JSON.stringify(fileData));
            } else {
                throw new Error('WebSocket connection not available');
            }
        } catch (error) {
            if (xtermRef.current) {
                xtermRef.current.writeln('\r\n\x1b[31mError starting execution: ' + error.message + '\x1b[0m');
                xtermRef.current.write('\r\n$ ');
            }
            setIsRunning(false);
        }
    };

    const handleStop = () => {
        if (isRunning) {
            setIsRunning(false);
            if (xtermRef.current) {
                xtermRef.current.writeln('\r\n\x1b[31mExecution stopped by user\x1b[0m');
                xtermRef.current.write('\r\n$ ');
            }
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'stop' }));
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
                        onClick={handleExecution}
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
