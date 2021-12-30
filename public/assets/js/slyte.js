
// const courseApi = "http://localhost:3000/courses/"

// function start() {
//     getCourses(renderCourses)
// }

// start();

// //Functions
// function getCourses(callback) {
//     fetch(courseApi)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(callback);
// }

// function renderCourses(courses) {
//     const listCourses =
//         document.querySelectorAll('.course-main-slider')
//     // console.log("courses",courses);
//     for (let i = 0; i < listCourses.length; i++) {
//         let listCourse = listCourses[i]
//         const getData = courses.map(function (course) {
//             return `
//                 <a id="${course.id}" href="#" class="slider">
//                     <img src="${course.img}" alt="">
//                     <h3>${course.sliderH3}</h3>
//                     <h4>${course.sliderH4}</h4>
//                     <h6>A$${course.sliderH6}</h6>
//                 </a> 
//         `;
//         });
//         listCourse.innerHTML = getData.join(' ')

//     }

//     const courseItems = document.querySelectorAll('.slider')
//     // console.log(courseItems);
//     const courseId = []
//     courseItems.forEach(item1 => {
//         item1.onclick = () => {
//             courseId.push(Number(item1.id))
//             console.log(courseId);
//             const findCourseById = courses.filter(items => {
//                 return courseId.some(id => items.id == id)
//             })
//             console.log(findCourseById);
//             const getCourses = findCourseById.reduce((a, b) => {
//                 return b.sliderH6 + a
//             }, 0)
//             console.log(getCourses);

            
//             // Cart
//             let listCourses = ``
//             let total = ``
//             const listCoursesCart = document.querySelector('#coursescart')
//             findCourseById.forEach(course => {
//                 listCourses += `
//                 <div class="course-main-cart">
//                     <img src="${course.img}" alt="">
//                     <h3 class="cartH3">${course.sliderH3}</h3>
//                     <h4 class="cartH4">${course.sliderH4}</h4>
//                     <h6 class="cartH6">A$${course.sliderH6}</h6>
//                 </div>
//                 `;
//             })
//             // Total courses you select
//             total += `
//                 <h2 class="total">
//                     <span>Tổng cộng: </span> $${getCourses}
//                 </h2>
//                     `
//             listCoursesCart.innerHTML = listCourses + total
//         }
//     })

//     // console.log(getData);
//     // console.log(listCourses);

//     // slider - slick
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
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
// }


// const skillsApi = "http://localhost:3000/skills/"
// function start1() {
//     getSkills(renderSkills)
// }

// start1();

// //Functions
// function getSkills(callback) {
//     fetch(skillsApi)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(callback);
// }

// function renderSkills(skills) {
//     const listSkills =
//         document.querySelector('.row.responsive1')
//     // console.log(listCourses);
//     const getData = skills.map(function (skill) {
//         return `<div class="slide-skill">
//                     <div class="top">
//                         <img src=${skill.img} alt="">
//                         <h6>${skill.name}</h6>
//                         <span>${skill.twitter}</span>
//                     </div>
//                     <div class="mid">
//                         <p>${skill.comment}</p>
//                     </div>
//                     <div class="bottom">
//                         <i class='bx bx-message-rounded'></i>
//                         <i class='bx bx-heart'></i>
//                     </div>
//                 </div>`;

//     });
//     listSkills.innerHTML = getData.join(' ')
//     // slider - slick
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
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

//     // console.log(getData);
//     // console.log(listSkills);
// }



// menu
const menuBar = document.querySelector(".menu-bar")
menuBar.addEventListener("click", function () {
    menuBar.classList.toggle("active")
    document.querySelector("#menu").classList.toggle("active")
    document.querySelector(".header-right").classList.toggle("active")
})
// sign-in
const signIn = document.querySelector(".sign-in")
signIn.addEventListener("click", function () {
    signIn.classList.toggle("active")
})



//course menu
const courseTitle = document.querySelector(".course-title");
courseTitle.addEventListener("click", function (x) {
    if (x.target.classList.contains("course-button")) {
        const Target = x.target.getAttribute("data-title");
        // console.log(Target)
        courseTitle.querySelector(".active").classList.remove("active");
        x.target.classList.add("active");
        const courseItem = document.querySelector(".courses");
        courseItem.querySelector(".course-main.active").classList.remove("active");
        courseItem.querySelector(Target).classList.add("active");
    }

})

const setUserName = () => {
    const changeName = document.querySelector('li a.sign-in h6')
    const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
    const username = currentUser.username;

    const logout = {
        username: null,
        password: null
    }

    if (currentUser.username == null && currentUser.password == null) {
        changeName.innerText = 'Sign in'
    }
    else {
        changeName.innerText = 'Xin chào ' + username
    }
    changeName.onclick = () => {
        window.localStorage.setItem('currentUser', JSON.stringify(logout))
        // changeName.innerText = 'Sign innnn'
    }
}
setUserName()


