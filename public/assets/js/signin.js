console.log('signin.js');

var signInBtn = document.getElementById('form-submit');
var signInForm = document.getElementById('login-form');
async function submit(e) {
    var username = signInForm['username'].value;
    var password = signInForm['password'].value;
    const cart = JSON.parse(localStorage.getItem('cart'))
    const result = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,password,
            cart
        })
    }).then((res) => res.json())
    if (result.status == 'success') window.location.href='/'
        else {
            document.getElementById('notification').innerHTML = result.error;
        }
    
}
signInBtn.addEventListener('click',submit);