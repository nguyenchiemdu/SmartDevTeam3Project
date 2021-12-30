// Event Enter Login
document.getElementById('password').onkeypress = function (e) {
    if (e.keyCode == 13) {
        document.getElementById('form-submit').click();
    }
}

// renderData()
const usersJson = [
    {
        username: 'trinhdoan2602',
        password: 'trinhdoan2602'
    },
    {
        username: 'trinhdoan2k',
        password: 'trinhdoan2k'
    }
]
const handleLogin = () => {
    const usernameInput = document.querySelector('#username')
    const passwordInput = document.querySelector('#password')
    const submitLogin = document.querySelector('.form-submit')

    //Lưu usersJson đến LocalStorage và dùng stingify để chuyển đổi kiểu dữ liệu js qua json
    window.localStorage.setItem('usersLocalStrorage', JSON.stringify(usersJson))
    //compare usersJson and object
    submitLogin.onclick = () => {

        const arrayUsersJson = JSON.parse(window.localStorage.getItem('usersLocalStrorage'));
        const isUser = arrayUsersJson.some(arrayUserJson => {
            return (arrayUserJson.username == usernameInput.value && arrayUserJson.password == passwordInput.value) ? true : false

        })
        // Tối thiểu tám ký tự, ít nhất một chữ cái và một số:
        var specialChars = "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$";
        var checkPass = function (string) {
            for (let i = 0; i < specialChars.length; i++) {
                if (string.indexOf(specialChars[i]) > -1) {
                    return true;
                }
            }
            return false;
        }
        // console.log(checkPass(usernameInput.value) && checkPass(passwordInput.value));
        if (usernameInput.value == "" || usernameInput.value == null) {
            document.querySelector('.login-alert').style.display = 'block'
            document.querySelector('.login-alert').innerText = 'Bạn chưa nhập tài khoản!'
        }
        else if (usernameInput.value.length < 8) {
            document.querySelector('.login-alert').style.display = 'block'
            document.querySelector('.login-alert').innerText = 'Tài khoản của bạn phải hơn 8 ký tự!'
        }
        else if (passwordInput.value == "" || passwordInput.value == null) {
            document.querySelector('.login-alert').style.display = 'block'
            document.querySelector('.login-alert').innerText = 'Bạn chưa nhập mật khẩu!'
        }
        else if (passwordInput.value.length < 8) {
            document.querySelector('.login-alert').style.display = 'block'
            document.querySelector('.login-alert').innerText = 'Mật khẩu của bạn phải hơn 8 ký tự!'
        }
        else if (checkPass(usernameInput.value) && checkPass(passwordInput.value)) {
            if (isUser) {
                const userLogin = {
                    username: usernameInput.value,
                    password: passwordInput.value
                }
                window.localStorage.setItem('currentUser', JSON.stringify(userLogin))
                alert("Đăng nhập thành công")
                window.location.href = "/"
            } else {
                document.querySelector('.login-alert').style.display = 'block'
                document.querySelector('.login-alert').innerText = 'Thông tin đăng nhập không hợp lệ!'
            }
        }
        else {
            document.querySelector('.login-alert').style.display = 'block'
            document.querySelector('.login-alert').innerText = 'Tài khoản hoặc mật khẩu phải tối thiểu tám ký tự, ít nhất một chữ cái và một số và không có ký tự đặc biệt!'

        }
        // if (checkPass(usernameInput.value) && checkPass(passwordInput.value)) {
        //     if (isUser) {
        //         const userLogin = {
        //             username: usernameInput.value,
        //             password: passwordInput.value
        //         }
        //         window.localStorage.setItem('currentUser', JSON.stringify(userLogin))
        //         alert("Đăng nhập thành công")
        //         window.location.href = "index.html"
        //     } else {
        //         document.querySelector('.login-alert').style.display = 'block'
        //         document.querySelector('.login-alert').innerText = 'Thông tin đăng nhập không hợp lệ!'
        //     }
        // }
        // else {
        //     document.querySelector('.login-alert').style.display = 'block'
        //     document.querySelector('.login-alert').innerText = 'Tài khoản hoặc mật khẩu phải tối thiểu tám ký tự, ít nhất một chữ cái và một số và không có ký tự đặc biệt!'

        // }

    }

}
handleLogin()