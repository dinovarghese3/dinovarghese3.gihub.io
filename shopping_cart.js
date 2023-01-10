document.addEventListener("DOMContentLoaded", async () => {
    increaseCartCount();
    expandCart();
    let product_data;
    await fetch("https://fakestoreapi.com/products/")
        .then((res) => res.json())
        .then((json) => {
            product_data = json;
        });
    let render_data = "";
    product_data.forEach((element) => {
        render_data += `<div class="card product-card rounded" data-id='${element.id}'>
    <img src="${element.image}" class="card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-title"><b>${element.title}</b></h5>
      <p class="card-text">
        <b>category</b> : <span class="card-category">${element.category}</br>
        <b>price</b> :$<span class="card-price">${element.price}</span>
      </p>
      <a href="#" class="btn btn-primary add_to_cart" >Add to Cart</a>
    </div>
  </div>`;
    });
    //   document.querySelector('.add_to_cart').addEventListener('click',addToCart)
    document.getElementById("product-container").innerHTML = render_data;
    let add_to_cart = document.getElementsByClassName("add_to_cart");
    for (let button of add_to_cart) {
        button.addEventListener("click", addToCart);
    }
    let removeCart = document.getElementsByClassName("removeFromCart");
    for (let removebutton of removeCart) {
        removebutton.addEventListener("click", removeFromCart);
    }
    document.getElementById('history-orders').hidden=true;
    //   document.getElementById('cart-button').addEventListener('click',expandCart);
});
let total_product_qty = 0;
function addToCart(e) {
    // This function is used to add the products to cart.
    // The product will be saved to session and that we can show
    e.preventDefault()
    let title = e.target.parentElement.querySelector(".card-title").innerText;
    let price = e.target.parentElement.querySelector(".card-price").innerText;
    let image = e.target.parentNode.parentNode.querySelector(".card-img-top").src;
    let product_id = e.target.parentNode.parentNode.dataset.id;
    var cartItem = {
        title: title,
        price: price,
        quantity: 1,
        product_id: product_id,
        image: image
    };
    var cartItemJSON = JSON.stringify(cartItem);

    var cartArray = new Array();
    // If javascript shopping cart session is not empty
    if (sessionStorage.getItem('online-shopping-cart')) {
        cartArray = JSON.parse(sessionStorage.getItem('online-shopping-cart'));
    }
    cartArray.push(cartItemJSON);
    var cartJSON = JSON.stringify(cartArray);
    sessionStorage.setItem('online-shopping-cart', cartJSON);
    
    expandCart();
    // increaseCartCount();
}

function increaseCartCount() {
    if(total_product_qty > 0){
        document.getElementById(
            "cart-button"
        ).innerHTML = `<span class="ml-1 float-end" id="cart-count">${total_product_qty}</span>`;
    } else {
        document.getElementById("cart-button").innerHTML = "";
    }
}
async function removeFromCart(e){
    e.preventDefault();
    e.stopPropagation();
    console.log("Remove item from cart",e.target.parentElement.parentElement)
    let remove_product_id = e.target.parentElement.parentElement.dataset.id;
    // console.log("product id",remove_product_id);
    
    e.target.parentElement.parentElement.remove();
    var shoppingCart = JSON.parse(
        sessionStorage.getItem("online-shopping-cart")
    );
    
    shoppingCart.forEach((item,index)=> {
        console.log("ittt",remove_product_id);
        if (JSON.parse(item).product_id == remove_product_id){
            console.log("current index",index);
            shoppingCart.pop(index);
        }
        
        });
        console.log("After removing",shoppingCart);
    var cartJSON = JSON.stringify(shoppingCart);
    await sessionStorage.setItem('online-shopping-cart', cartJSON);
    expandCart();
    increaseCartCount();

}
function expandCart() {
    let sub_total = 0;
    
    let value = JSON.parse(sessionStorage.getItem("online-shopping-cart"))
    if (value && value.length) {
        console.log("undu ");
        var shoppingCart = JSON.parse(
            sessionStorage.getItem("online-shopping-cart")
        );
        document.getElementById('clear-cart').hidden=false;
        document.getElementById('check-out-cart').hidden=false;
        // document.getElementById('history-orders').hidden=false;
        // document.getElementById('order-empty').hidden=true;
        let cart_table = `<table class="table" id="cart-table"><thead><th></th><th></th><th>Product</th><th>Quantity</th><th>price</th></thead><tbody>`;
        let uniqObjs;
        const dupeObjs = [];
        uniqObjs= new Set(shoppingCart.map(obj => JSON.parse(obj).product_id));
        total_product_qty = uniqObjs.size;
        increaseCartCount();
        uniqObjs.forEach((item,index)=> {
            let result = shoppingCart.filter((obj)=>{
                return JSON.parse(obj).product_id == item
            });
            cart_table += `<tr data-id='${JSON.parse(result[0]).product_id}'>
            <th scope="row">${index}</th>
            <td><img src='${JSON.parse(result[0]).image}' class="modal-image"/></td>
            <td>${JSON.parse(result[0]).title}</td>
            <td>${result.length}</td>
            <td>$${JSON.parse(result[0]).price}</td>
            <td><button class="btn btn-primary removeFromCart"><i class="fa fa-trash "></i></button></td>
          </tr>`
          sub_total += (parseFloat(JSON.parse(result[0]).price) * result.length) ;
        })
        cart_table += `<tr><td colspan='4'></td>
        <td><b>Subtotal:</b></td><td id='sub-total'>$${sub_total.toFixed(2)}</td>
        </tr></tbody></table>`
        document.getElementById('cart-content').innerHTML = cart_table;
        document.getElementById('cart-empty').hidden=true;
    } else {
        document.getElementById('clear-cart').hidden=true;
        document.getElementById('check-out-cart').hidden=true;
        // document.getElementById('history-orders').hidden=true;
        // document.getElementById('order-empty').hidden=false;
        total_product_qty =0;
        document.getElementById('cart-empty').hidden=false;
        document.getElementById('cart-content').innerHTML = "";
    }
}
function OrderProcess(){
    console.log("Processs");
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let subtotal = document.getElementById('sub-total').innerText;
    document.getElementById('history-orders').hidden=false;
    document.getElementById('history-content').innerHTML += `<tr><td>${Date.now()}</td><td>${today.toUTCString()}</td><td>${subtotal}</td></tr>`;
    document.getElementById('shope-empty').hidden=true;
    // document.getElementById('order-empty').hidden=true;
    clearCart();
}

async function clearCart() {
    // We Need to Clear the cart here
    await sessionStorage.setItem('online-shopping-cart', "[]");
    await document.getElementById('btn-close').click();
    expandCart();
    increaseCartCount();

}