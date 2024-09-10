// import React, { createContext, useContext, useEffect, useState } from 'react';
//
// const WebSocketContext = createContext(null);
//
// export const WebSocketProvider = ({ children }) => {
//     const [socket, setSocket] = useState(null);
//
//     useEffect(() => {
//         const connectWebSocket = () => {
//             const ws = new WebSocket('ws://140.238.54.136:8080/chat/chat');
//             ws.onopen = () => {
//                 console.log('WebSocket connection established');
//             };
//             ws.onerror = (error) => {
//                 console.error('WebSocket Error:', error);
//             };
//             setSocket(ws);
//
//             ws.onclose = () => {
//                 console.log('WebSocket connection closed. Reconnecting...');
//                 setTimeout(connectWebSocket, 1000);
//             };
//         };
//
//         connectWebSocket();
//
//         return () => {
//             if (socket && socket.readyState === WebSocket.OPEN) {
//                 socket.close();
//             }
//         };
//     }, []);
//
//     return (
//         <WebSocketContext.Provider value={socket}>
//             {children}
//         </WebSocketContext.Provider>
//     );
// };
//
// // <<<<<<< HEAD
// export const useWebSocket = () => useContext(WebSocketContext);
//tin
// import React, { createContext, useContext, useEffect, useState } from 'react';
//
// const WebSocketContext = createContext(null);
//
// export const WebSocketProvider = ({ children }) => {
//     const [socket, setSocket] = useState(null);
//
//     useEffect(() => {
//         const connectWebSocket = () => {
//             const ws = new WebSocket('ws://140.238.54.136:8080/chat/chat');
//             ws.onopen = () => {
//                 console.log('WebSocket connection established');
//             };
//             ws.onerror = (error) => {
//                 console.error('WebSocket Error:', error);
//             };
//             setSocket(ws);
//
//             ws.onclose = () => {
//                 console.log('WebSocket connection closed. Reconnecting...');
//                 setTimeout(connectWebSocket, 1000);
//             };
//         };
//
//         connectWebSocket();
//
//         return () => {
//             if (socket && socket.readyState === WebSocket.OPEN) {
//                 socket.close();
//             }
//         };
//     }, []);
//
//     return (
//         <WebSocketContext.Provider value={socket}>
//             {children}
//         </WebSocketContext.Provider>
//     );
// };
//
// export const useWebSocket = () => useContext(WebSocketContext);
//sua
import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        let ws;
        const connectWebSocket = () => {
            ws = new WebSocket('ws://140.238.54.136:8080/chat/chat');
            ws.onopen = () => {
                console.log('WebSocket connection established');
            };
            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
            setSocket(ws);

            ws.onclose = () => {
                console.log('WebSocket connection closed. Reconnecting...');
                setTimeout(connectWebSocket, 1000);
            };
        };

        connectWebSocket();

        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);









