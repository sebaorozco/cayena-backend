const socket = io();

const formMessage = document.getElementById('formMessage');
const mailBox = document.getElementById('mailBox');
const messageBox = document.getElementById('messageBox');
const messageLogs = document.getElementById('messageLogs'); 

function showMessages(data){
    const li = document.createElement('li');
    li.innerHTML = `<p><strong>${data.name}</strong>: ${data.message}, ${data.mail} </p>`;
    messageLogs.appendChild(li);
}  

const swal = async () => {
    try {
        const result = await Swal.fire({
            title: "Buenas, identifícate",
            input: "text",
            text: "Ingresa tu nombre",
            inputValidator: value => {
                return !value && 'Necesitas ingresar tu nombre de Usuario'
            },
            allowOutsideClick: false
        })
        const user = result.value;

        socket.emit('newUser', user);

        socket.on('userConnected', user => {
            Swal.fire({
                text: `Bienvenido ${user} al chat`,
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                icon: 'success'
            })
        })

        formMessage.addEventListener('submit', (e) => {
            e.preventDefault();
                if(mailBox.value.trim().length > 0){
                    socket.emit('message', {name: user, mail: mailBox.value, message: messageBox.value});
                    messageBox.value = "";
                    messageBox.focus();
               } 
        })
    }  catch (error) {
       console.log(error); 
    }    
}

/* messageBox.addEventListener('keyup', (e) => {
    e.preventDefault();
    if(e.key === 'Enter) {
        if(mailBox.value.trim().lenght > 0){
            socket.emit('message', {user, mail: mailBox.value, message: messageBox.value});
            messageBox.value = "";
        } 
    }
}) */

socket.on('messageLogs', (data) => {
    /* let messages = "";
    
    data.forEach(message => {
        messages = messages + `<b>${message.user}:</b> ${message.message} by ${message.mail}</br>`
    });  
    messageLogs.innerHTML = messages; */
    showMessages(data);
})

swal();