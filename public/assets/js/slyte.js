
// slider - slick
$('.responsive').slick({
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
        {
            breakpoint: 1424,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                infinite: true
            }
        },
        {
            breakpoint: 1124,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true
            }
        },
        {
            breakpoint: 874,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});
$('.responsive1').slick({
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});

// phân trang

$('.pagination-inner a').on('click', function() {
    $(this).siblings().removeClass('pagination-active');
    $(this).addClass('pagination-active');
})
// menu
// const menuBar = document.querySelector(".menu-bar")
// menuBar.addEventListener("click", function () {
//     menuBar.classList.toggle("active")
//     document.querySelector("#menu").classList.toggle("active")
//     document.querySelector(".header-right").classList.toggle("active")
// })
// // sign-in
// const signIn = document.querySelector(".sign-in")
// signIn.addEventListener("click", function () {
//     signIn.classList.toggle("active")
// })

//course menu
// const courseTitle = document.querySelector(".course-title");
// courseTitle.addEventListener("click", function (x) {
//     if (x.target.classList.contains("course-button")) {
//         const Target = x.target.getAttribute("data-title");
//         // console.log(Target)
//         courseTitle.querySelector(".active").classList.remove("active");
//         x.target.classList.add("active");
//         const courseItem = document.querySelector(".courses");
//         courseItem.querySelector(".course-main.active").classList.remove("active");
//         courseItem.querySelector(Target).classList.add("active");
//     }

// })

// const setUserName = () => {
//     const changeName = document.querySelector('li a.sign-in h6')
//     const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
//     const username = currentUser.username;

//     const logout = {
//         username: null,
//         password: null
//     }

//     if (currentUser.username == null && currentUser.password == null) {
//         changeName.innerText = 'Sign in'
//     }
//     else {
//         changeName.innerText = 'Xin chào ' + username
//     }
//     changeName.onclick = () => {
//         window.localStorage.setItem('currentUser', JSON.stringify(logout))
//         // changeName.innerText = 'Sign innnn'
//     }
// }
// setUserName()
