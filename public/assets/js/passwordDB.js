const form = document.getElementById('reg-form')
form.addEventListener('submit', registerUser)

async function registerUser(event) {
    event.preventDefault()
    const password = document.getElementById('password').value

    const result = await fetch('users/api/password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newpassword: password,
            token: localStorage.getItem('token')
        })
    }).then((res) => res.json())
    
    if(result.status === 'ok'){
        alert('Success')    
    } else {
        alert(result.error)
    }
}