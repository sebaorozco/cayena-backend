const socket = io();

socket.on('connect', () => {
    console.log("Conectados al servidor");

    socket.on('inicio', (mensaje) => {
        console.log(mensaje);
    })
});
