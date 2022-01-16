// var paging = $('#paging');
// console.log(typeof paging);
// console.log(window.location.href);
// if(paging != null && paging != undefined) paging.pagination({
//     dataSource: [1, 2, 3, 4, 5, 6, 7,8,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
//     pageSize:2,
//     afterPageOnClick : function(event , pageNumber){
//         loadPage(pageNumber);
  
//     } ,
//     afterNextOnClick : function(event , pageNumber){
//         loadPage(pageNumber);
 
//     }  ,
//     afterPreviousOnClick : function(event , pageNumber){
//         loadPage(pageNumber);
//     }   
// })

// function loadPage(page){
//     $.ajax({
//         url: "/courses?page=" + page
//     })
//     .then(courses=>{
//         console.log(courses);
//         $('#content').html("");
//         courses.forEach(function(courses) { 
//             // const element = courses[i]; 
//             var item = $(
//                     ` <div class="col-lg-3 col-md-3 col-sm-6 col-xs-6 course-main-slider ">
//                     <a id="${courses.id}" href="/courses/${courses.slug}" class="slider">
//                         <img src="${courses.image}" alt="">
//                         <h3>
//                            ${ courses.name}
//                         </h3>
//                         <h4>
//                         ${ courses.author }
//                         </h4>
//                         <h6>
//                               ${ courses.price} 
//                         </h6>
//                     </a>
//                     </div>
//                     }); `
//             )
//             $('#content').append(item)
//                 })
//     })
//     .catch(err=>{
//         console.log(err);
//     })

// }
$('.pagination-inner a').on('click', function() {
    $(this).siblings().removeClass('pagination-active');
    $(this).addClass('pagination-active');
})