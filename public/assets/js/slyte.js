
//panigation
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });
});


// Filter Course by Categories
// Start filter course
// Fetch API method Post and
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

var valueSlug,slug;
const courseCategory = "/api/category";
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
    courses = courses.filter((item) => {
      return item.isValidated === 1;
    });

    var htmls = courses.map(function (course) {
        return `

            <a id="${course._id}" href="/courses/${course.slug}" class="slider">
                <img src="${course.image}" alt="">
                <h3>${course.name}</h3>
                <h6>$${course.price}</h6>
            </a>

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

if (courseTitle !=null) courseTitle.addEventListener("click", async function (x) {
    if (x.target.classList.contains("course-button")) {
        const Target = x.target.getAttribute("data-title");
        valueSlug = await Target.slice(1);
        slug = await getSlug(valueSlug);
        courseTitle.querySelector(".active").classList.remove("active");
        x.target.classList.add("active");
        const courseItem = document.querySelector(".courses");
        courseItem.querySelector(".course-main.active").classList.remove("active");
        courseItem.querySelector(Target).classList.add("active");
        await postData('/api/category', { slug })
        filterCourse();
    }
})

// End filter Course by Categories

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

// function loadPageSearch(page){
//     $.ajax({
//         url: "/search?page=" + page
//     })
//     .then(search=>{
//         console.log(search);
//         $('#content').html("");
//         courses.forEach(function(search) {
//             // const element = courses[i];
//             var item = $(
//                     `    <div class="search__shopping">

//                     <a href="/courses/${ search.slug }" class="search__list">
//                         <section class="card">
//                             <div class="card-container">
//                                 <div class="card-image">
//                                     <img src="${ personSearch.image } " alt="photo" />
//                                 </div>
//                                 <div class="card-info">
//                                     <h6>
//                                         ${ personSearch.name }
//                                     </h6>
//                                     <p>
//                                         ${personSearch.author }
//                                     </p>
//                                     <p class="card-rating">
//                                         4.5<i class="fas fa-star"></i><i class="fas fa-star"></i><i
//                                             class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
//                                         <span>(1000 rating)</span>
//                                     </p>
//                                     <p style="line-height: 15px;">
//                                         ${ personSearch.shortDescription }
//                                     </p>
//                                 </div>
//                                 <div class="card-price">
//                                     <h5 class="card-text">
//                                         ${ personSearch.price } $
//                                     </h5>

//                                 </div>
//                             </div>
//                         </section>
//                     </a>
//                 </div>`
//             )
//             $('#contentsearch').append(item)
//                 })
//     })
//     .catch(err=>{
//         console.log(err);
//     })

// }

// setUserName()


//Cart
