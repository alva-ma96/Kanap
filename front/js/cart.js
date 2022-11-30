// 1° récupérer les données du LS dans une variable
let productLS = JSON.parse(localStorage.getItem("myLocalStorage"));

// 2° création du panier qu'on va remplir au fur et à mesure
let fullBasket = []

if (productLS !== null) { // si le LS contient des articles =>  afficher les données
    
    for (const product of productLS) {
    
    // 3° récupérer les données de l'Api
    fetch(`http://localhost:3000/api/products/${product.id}`)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    
    .then(function(data) {
    
        fullBasket.push({ // on push les données des produits dans le tableau
            id: data._id,
            name: data.name,
            price: data.price,
            color: product.color,
            quantity: product.quantity,
            image: data.imageUrl,
            alt: data.altTxt
        })
    
        displayProductsBasket(data._id, data.name, data.price,product.color, product.quantity, data.imageUrl, data.altTxt)
    
    })
    
    .catch(function(err) {
      console.log(err)
    });
    }

} else{ // si non, si le LS ne contient pas d'article => afficher "aucun produit"
    document.getElementById("cart__items").innerHTML += `Aucun produit dans le panier`
}


// 4° créer fonction pour afficher les produits du LS dans le panier
function displayProductsBasket(id, name, price, color, quantity, image, alt) {
        
        document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${id}" data-color="${color}">
        <div class="cart__item__img">
          <img src="${image}" alt="${alt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${name}</h2>
            <p>${color}</p>
            <p>${price}€</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`

}

