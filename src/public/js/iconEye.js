//**************************************************//************************************************/
const iconEye = document.querySelector(".icon-eye");

iconEye.addEventListener("click", () => {
    const inputPassword = this.document.getElementsByTagName("input");
    
    const icon = document.querySelector("i");
    
    if(inputPassword.password.type === 'password'){
        inputPassword.password.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        inputPassword.password.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
})