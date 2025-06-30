window.addEventListener('DOMContentLoaded', () => {


  //product fetching from JSON file
  fetch(`${window.location.origin}/Mordern-Cream-/js/product-list.json`)
    .then(res => res.json())
    .then(products => {
      const list = document.getElementById('product-list');
      const template = document.getElementById('single-product');

      if (template) {
        products.forEach(product => {
          const clone = template.content.cloneNode(true);

          const img = clone.querySelector('img');
          const title = clone.querySelector('.card-title');
          const price = clone.querySelector('.card-price');

          if (img) img.src = product.image;
          if (img) img.alt = product.name;
          if (title) title.textContent = product.name;
          if (price) price.textContent = product.price;


          const params = new URLSearchParams({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            ingredients:product.ingredients
          });

          clone.querySelector('.card-btn').href = `./product-details.html?${params.toString()}`;

          list.appendChild(clone);
        });
      }
    })
    .catch(err => console.error('Error loading products:', err));

  //passing parameters to product details page

  const params = new URLSearchParams(window.location.search);
  const product = {
    id: params.get('id'),
    name: params.get('name'),
    price: params.get('price'),
    image: params.get('image'),
    description: params.get('description'),
    ingredients:params.get('ingredients')
  };
  const prodName = document.getElementById('prod-name');
  const prodPrice = document.getElementById('prod-price');
  const prodImage = document.getElementById('prod-img');
  const prodImage2 = document.getElementById('prod-img2');
  const prodDesc = document.getElementById('prod-desc');
  const prodCart = document.getElementById('add-to-cart');
  const quanText = document.getElementById('quan-text');
  const quantMinus = document.getElementById('quan-minus');
  const quantPlus = document.getElementById('quan-plus');
  var qty = 1;
  if (quantPlus) {
    quantPlus.addEventListener('click', () => {
      qty++;
      quanText.textContent = qty;
    });
  }

  if (quantMinus) {
    quantMinus.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        quanText.textContent = qty;
      }
    });
  }

  if (prodName) prodName.textContent = product.name;
  if (prodImage) prodImage.src = product.image;
  if (prodImage2) prodImage2.src = product.image;
  if (prodPrice) prodPrice.textContent = product.price;
  if (prodDesc) prodDesc.textContent = product.description;
  if (quanText) quanText.textContent = qty;

  const btn1 = document.getElementById("descBtn1");
  const btn2 = document.getElementById("descBtn2");
  const content = document.getElementById("descCont");
  if(content)content.textContent = product.ingredients;
  if(btn1)btn1.onclick = function () {
    btn1.classList.add("active");
    btn2.classList.remove("active");
    content.textContent = product.ingredients;
  };

  if(btn2)btn2.onclick = function () {
    btn2.classList.add("active");
    btn1.classList.remove("active");
    content.textContent = product.description;
  };

 
  //adding product to local storage

  if (prodCart) {
    prodCart.addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const alreadyInCart = cart.some(item => item.id === product.id);
      if (alreadyInCart) { 
        cart.pop();
        cart.push({ ...product, quantity: qty });
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        cart.push({ ...product, quantity: qty });
        localStorage.setItem('cart', JSON.stringify(cart));
        // alert('Product added to cart!');
      }
    });
  }

  //cart page functioning

  function renderCart() {
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-container');
    const summeryContainer = document.getElementById('cart-summery');
    const mainContainer = document.getElementById('cart-main');
    const cartTemplate = document.getElementById('cart-template');
    const cartSubTotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const summeryTemplate = document.getElementById('summery-template');
    let subTotal = 0;
    let shipping = 0;
    let total = 0;
    if (cart.length === 0) {
      mainContainer.innerHTML = '<div class="text-center"><h2>Your cart is empty.</h2><a href="shop.html"><button class="prod-btn">Shop Now</button></a></div>';
      return;
    }

    cart.forEach((product, index) => {
      const cartClone = cartTemplate.content.cloneNode(true);
  
      cartClone.getElementById('cartTitle').textContent = product.name;
      cartClone.getElementById('cartPrice').textContent = product.price;
      cartClone.getElementById('cartImg').src = product.image;
      cartClone.getElementById('cartQuantity').textContent = product.quantity;
      const subPrice = parseFloat(product.price.replace(/[$,]/g, ''));
      
      cartClone.getElementById('cartSubtotal').textContent = `$${subPrice * product.quantity}`;

      const removeBtn = cartClone.getElementById('cartRemove');
      removeBtn.setAttribute('data-index', index);
      removeBtn.addEventListener('click', () => {
        removeItem(index);
      });
      function removeItem(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        window.location.reload();
      }

      container.appendChild(cartClone);

      subTotal += subPrice * product.quantity;
      total = subTotal + shipping;

    });
    cartSubTotal.textContent= `$${subTotal.toFixed(2)}` ;
    cartTotal.textContent= `$${total.toFixed(2)}`;
  }

  renderCart();


});



