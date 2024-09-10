let socket = null;

export const setWebsocket = (socketConnect) => {
    socket = socketConnect
};

export const getWebSocket = () => socket;