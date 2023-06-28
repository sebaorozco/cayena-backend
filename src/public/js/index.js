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

socket.on('messageLogs', (data) => {
    showMessages(data);
})

swal();


//**************************************************//************************************************/
/*
const formProducts = document.getElementById('formProducts');
const title = document.getElementById('title');
const description = document.getElementById('description');
const code = document.getElementById('code');
const price = document.getElementById('price');
const stock = document.getElementById('stock');
const category = document.getElementById('category');
const productList = document.getElementById('productList');


function showProducts(data){
    const li = document.createElement('li');
    li.innerHTML = `<p><strong>${data.title}</strong>: ${data.description}, ${data.code} </p>`;
    productList.appendChild(li);
}  

formProducts.addEventListener('submit', (e) => {
    e.preventDefault();
        if(title.value.trim().length > 0){
            socket.emit('newProduct', {
                title: title.value, 
                description: description.value, 
                code: code.value,
                price: price.value,
                stock: stock.value,
                category: category.value
            });
            title.value = "";
            description.value = "";
            code.value = "";
            price.value = "";
            stock.value = "";
            category.value = "";
            title.focus();
       } 
})

socket.on('productsLog', (data) => {
    showProducts(data);
})
*/