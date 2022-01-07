// localStorage.setItem('cart',JSON.stringify(['123123412']))
// console.log(JSON.parse(localStorage.getItem('cart')))
// localStorage.setItem('cart',JSON.stringify(JSON.parse(localStorage.getItem('cart')).push("5555")))



async function registerUser() {
    const cart = JSON.parse(localStorage.getItem('cart'))
    const result = await fetch('cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cart
        })
    }).then((res) => res.json())

    var listCart = ``;
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
                                <h5 class="card-text">$9.99<i class="fas fa-tag mx-2"></i></h5>
                                <h6><del>$84.99</del></h6>
                            </div>
                        </div>
                    </section>`
        listCart += cardHTML;
    });
    var listCartWrapper = `
                        <p class="my-3">3 Courses in Cart</p>
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
    }))
    console.log(result);
}

registerUser();


