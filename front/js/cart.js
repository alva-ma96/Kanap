/////////////////// AFFICHER LES PRODUITS DANS LA PAGE PANIER :

  // 1° récupérer les données du LS dans une variable
let productLS = JSON.parse(localStorage.getItem("myLocalStorage"));

  // 2° création du panier qu'on va remplir au fur et à mesure
let fullBasket = []

  // 3° Création d'un tableau de promesses (afin de pouvoir les appeler quand on veut)
let allPromises = []

if (productLS !== null) { // si le LS contient des articles =>  afficher les données
    
    for (const product of productLS) {
    
    // 4° récupérer les données de l'Api
      let promise = fetch(`http://localhost:3000/api/products/${product.id}`)
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
            
      })
      
      .catch(function(err) {
        console.log(err)
      });

      allPromises.push(promise) // on push le fetch dans le tableau de promesses
    }


} else{ // si non, si le LS ne contient pas d'article => afficher "aucun produit"
    document.getElementById("cart__items").innerHTML += `Aucun produit dans le panier`
}

// 5° modifier le DOM
function displayProductsBasket(product) {

  document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
  <div class="cart__item__img">
    <img src="${product.image}" alt="${product.alt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${product.name}</h2>
      <p>${product.color}</p>
      <p>${product.price}€</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>`

}


Promise.all(allPromises).then(() => {

  fullBasket.forEach(element => displayProductsBasket(element));

  deleteSelectedProduct()

  calculateTotalPrice()
  calculateTotalQuantity()
})



////////////////////// SUPPRIMER UN ARTICLE
const deleteSelectedProduct = () => {

  // sélectionner tous les boutons supprimer
  let deleteBtn = document.querySelectorAll(".deleteItem");

  // event bouton supprimer
  deleteBtn.forEach(btn => {
    btn.addEventListener("click", (e) => {

      //Récupérer l'id du produit qu'on veut supprimer
      let closestId = e.target.closest('article').getAttribute("data-id");

      //Récupérer la couleur du produit qu'on veut supprimer
      let closestColor = e.target.closest('article').getAttribute("data-color")

      // Recherche du produit dans le LS en faisant matcher l'id et la couleur qu'on vient de récupérer
      let matchIdAndColorInLS = productLS.find(element => element.id == closestId && element.color == closestColor);

      // Grâce à filter, on va garder/récupérer tous les produits qui ne correspondent pas en id et en couleur (matchIdAndColorInLS)
      productLS = productLS.filter(element => element.id != matchIdAndColorInLS.id);

      // Il faut faire la même chose pour le fullBasket si non il n'est pas à jour
      fullBasket = fullBasket.filter(element => element.id != matchIdAndColorInLS.id);

      // Il faut également mettre à jour le local storage du navigateur
      localStorage.setItem("myLocalStorage", JSON.stringify(productLS));

      // Enlever le produit du DOM
      e.target.closest('article').remove();

      //erreur lorsque le panier est vide : on ne peut pas commander
    })

  })
}


////////////////////// CALCUL TOTAL

// Déclarer une variable pour pouvoir y mettre les prix qui sont dans le panier
let arrayPrice = []
let arrayQuantity = []

function calculateTotalPrice() {

  //récupérer les prix dans le panier
  for (const product of fullBasket) {

    //Mettre les prix dans le tableau
    arrayPrice.push(product.price)
  }

  // Additionner les prix de arrayPrice avec reduce()
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalPrice = arrayPrice.reduce(reducer, 0);

  document.getElementById("totalPrice").innerHTML = totalPrice
}

function calculateTotalQuantity() {

  //récupérer les quantités dans le panier
  for (const product of fullBasket) {

    // Mettre les quantités dans le tableau
    arrayQuantity.push(product.quantity)
  }

    // Additionner les quantités de arrayQuantity avec reduce()
    const reducer = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);
    const totalQuantity = arrayQuantity.reduce(reducer, 0);
  
    document.getElementById("totalQuantity").innerHTML = totalQuantity
  
}


/////////////// Méthode Chloé Calcul Total
// const calculTotal = () => {
//   let total = 0;
//   let quantity = 0;
//   for (element of fullBasket) {
//     total += parseInt(element.price) * parseInt(element.quantity)
//     quantity += parseInt(element.quantity)
//   }

//   console.log(total);
//   document.getElementById("totalPrice").innerHTML = total
//   document.getElementById("totalQuantity").innerHTML = quantity
// }