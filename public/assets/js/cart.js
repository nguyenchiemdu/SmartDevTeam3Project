const cart = JSON.parse(localStorage.getItem('cart'))

async function getLocalCart() {
    const result = await fetch('coursesid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cart
        })
    }).then((res) => res.json())
    var listCart = ``;
    var countCart = 0;
    var countSumPrice = 0;
    result.forEach(item => {
        let cardHTML = `<section class="card">
                        <div class="card-container">
                            <div class="card-image">
                                <img src="${item.image}" alt="photo">
                            </div>
                            <div class="card-info">
                                <h6>${item.name}</h6>
                                <p>${item.author}</p>
                                <p class="card-rating">
                                    4.5<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                    <span>(1000 rating)</span>
                                </p>
                                <p>14 heures au total - Beginner</p>
                            </div>
                            <div class="card-button">
                                <button class="btn btn-link btn-remove" id="${item._id}">Remove</button>
                                <button class="btn btn-link">Save for Later</button>
                                <button class="btn btn-link">Move to Wishlist</button>
                            </div>
                            <div class="card-price">
                                <h5 class="card-text">$${item.price}<i class="fas fa-tag mx-2"></i></h5>
                                <h6><del>$${item.price}</del></h6>
                            </div>
                        </div>
                    </section>`
        listCart += cardHTML;
        countCart++;
        countSumPrice += parseFloat(item.price);
    });
    var listCartWrapper = `
                        <p class="my-3">${countCart} Courses in Cart</p>
                        ${listCart}
                        `;

    document.querySelector('.cart__list').innerHTML = listCartWrapper;
    document.querySelectorAll('.btn-remove').forEach(button => button.addEventListener('click', (e) => {
        var cart = JSON.parse(localStorage.getItem('cart'));
        // if (cart == null) cart = [];
        cart = new Set(cart)
        cart.delete(e.target.id);
        cart = Array.from(cart)
        localStorage.setItem('cart', JSON.stringify(cart))
        window.location.href = "/cart"
    }));
    document.querySelectorAll('.total_price').forEach(element => element.innerHTML = "$" + countSumPrice)
    // console.log(result);
}
function addEventRemoveOnServer() {
    document.querySelectorAll('.btn-remove').forEach(button => button.addEventListener('click', async (e) => {
        console.log(e.target.id);
        const result = await fetch('cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                course_id: e.target.id
            })
        }).then(res => res.json());
        // console.log(result);
        window.location.href = "/cart";
    }));
}


async function renderUserCart() {
    const result = await fetch('usercart', {
        method: 'GET',
    }).then((res) => res.json());
    if (result.status == 'failed') getLocalCart()
    else addEventRemoveOnServer()

}
renderUserCart();


