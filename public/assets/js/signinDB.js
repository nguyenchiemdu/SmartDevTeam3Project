const form = document.getElementById('login')
form.addEventListener('submit', login)

async function login(event) {
    event.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    const result = await fetch('users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())

    if(result.status === 'ok'){
        console.log('Got the token: ', result.data);
        localStorage.setItem('token', result.data)
        alert('Success')
        window.location.href = "/"

    } else {
        alert(result.error)
    }
}