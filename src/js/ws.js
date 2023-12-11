let socket = null;

function connectWebSocket() {
    socket = new WebSocket("ws://192.168.1.10/ws");

    socket.onopen = () => {
        console.log("Conectado ao servidor WebSocket");
        statusConectar();
        //enviarNumero()
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const tipo = data?.tipo
        if (tipo) {
            if (tipo === 1) {
                atualizaStatusCar(data.status)
            }
        }
    };

    // Evento disparado quando ocorre um erro na conexão
    socket.onerror = (event) => {
        console.error('Erro na conexão:', event);
        statusDesconectar()
    };

    // Evento disparado quando a conexão é fechada
    socket.onclose = (event) => {
        statusDesconectar()

        if (event.wasClean) {
            console.log('Conexão fechada com sucesso:', event.reason);
        } else {
            console.error('Conexão fechada inesperadamente:', event.reason);
        }
    };
}

function statusWS() {
    // Verificar o status da conexão WebSocket
    if (!socket) {
        return false
    }
    if (ws.readyState === WebSocket.CONNECTING) {
        return false
    } else if (ws.readyState === WebSocket.OPEN) {
        return true
    } else if (ws.readyState === WebSocket.CLOSING) {
        return false
    } else if (ws.readyState === WebSocket.CLOSED) {
        return false
    }
}