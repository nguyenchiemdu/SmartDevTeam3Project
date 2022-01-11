
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

//panigation
$('#paging').pagination({
    dataSource: [1, 2, 3, 4, 5, 6, 7,8,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
    pageSize:2,
    afterPageOnClick : function(event , pageNumber){
        loadPage(pageNumber);
       
        console.log(pageNumber);
    } ,
    afterNextOnClick : function(event , pageNumber){
        loadPage(pageNumber);
       
        console.log(pageNumber);
    }  ,
    afterPreviousOnClick : function(event , pageNumber){
        loadPage(pageNumber);
      
        console.log(pageNumber);
    }   
})

function loadPage(page){
    $.ajax({
        url: "/courses?page=" + page
    })
    .then(courses=>{
        console.log(courses);
        $('#content').html("");
        courses.forEach(function(courses) { 
            // const element = courses[i]; 
            var item = $(
                    ` <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 course-main-slider ">
                    <a id="${courses.id}" href="/courses/${courses.slug}" class="slider">
                        <img src="${courses.image}" alt="">
                        <h3>
                           ${ courses.name}
                        </h3>
                        <h4>
                        ${ courses.author }
                        </h4>
                        <h6>
                              ${ courses.price} 
                        </h6>
                    </a>
                    </div>
                    }); `
            )
            $('#content').append(item)
                })
    })
    .catch(err=>{
        console.log(err);
    })

}



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


//Cart
console.log('hello, Im here')
