// phân trang

$('.pagination-inner a').on('click', function() {
    $(this).siblings().removeClass('pagination-active');
    $(this).addClass('pagination-active');
})

// Fetch API method Post and
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}


// Filter Course by Categories
var valueSlug,slug;
const courseCategory = "http://localhost:8080/category";
const renderCourse = document.querySelectorAll(".renderCourse");
// Fetch api method get to get courses which filter by category
const getCourses = async (data) => {
    await fetch(courseCategory)
    .then(res => res.json())
    .then(data);
}
// Get slug from button on click to know which category want to filter course
const getSlug = (value) =>{
    return value;
}
// Render course data
const renderCourses = (courses) => {
    var htmls = courses.map(function (course) {
        return `
        <div class="swiper-slide">
            <a id="${course._id}" href="/courses/${course.slug}" class="slider">
                <img src="${course.image}" alt="">
                <h3>${course.name}</h3>
                <h6>A$${course.price}</h6>
            </a>
        </div>
        `;
    });
    Array.prototype.map.call(renderCourse, function(render){render.innerHTML = htmls.join('')});

}
const filterCourse = async () => {
    getCourses((courses) => {
      renderCourses(courses);
    });
}
    
const courseTitle = document.querySelector(".course-title");
const form = document.getElementById('btn-categories')

courseTitle.addEventListener("click", async function (x) {
    if (x.target.classList.contains("course-button")) {
        const Target = x.target.getAttribute("data-title");
        console.log(Target.slice(1));
        valueSlug = await Target.slice(1); 
        slug = await getSlug(valueSlug);
        courseTitle.querySelector(".active").classList.remove("active");
        x.target.classList.add("active");
        const courseItem = document.querySelector(".courses");
        courseItem.querySelector(".course-main.active").classList.remove("active");
        courseItem.querySelector(Target).classList.add("active");
        await postData('http://localhost:8080/category', { slug })
        filterCourse();
    }
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

// course menu

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

