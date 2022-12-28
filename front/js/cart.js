/////////////////// AFFICHER PRODUITS DANS LE PANIER : ////////////////////////

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



// 5° Afficher les produits depuis le DOM
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




// Ici on résoud toutes les promesses
Promise.all(allPromises).then(() => {

  fullBasket.forEach(element => displayProductsBasket(element));

  deleteSelectedProduct(); //supprime un produit

  calculateTotalBasket(); //affiche le prix et quantité total dans le panier

  modifyQuantity(); //permet de modifier la quantité d'article ds le panier

  errorMessageForm(); //ensemble des fonctions de messages d'erreur dans le formulaire

})




////////////////////// SUPPRIMER UN ARTICLE ////////////////////////

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
      productLS = productLS.filter(element => element.id != matchIdAndColorInLS.id || element.color != matchIdAndColorInLS.color);

      // Il faut faire la même chose pour le fullBasket si non il n'est pas à jour
      fullBasket = fullBasket.filter(element => element.id != matchIdAndColorInLS.id || element.color != matchIdAndColorInLS.color);

      // Il faut également mettre à jour le local storage du navigateur
      localStorage.setItem("myLocalStorage", JSON.stringify(productLS));

      // Enlever le produit du DOM
      e.target.closest('article').remove();

      location.reload();
    })

  })

}




/////////////////////// CALCUL TOTAL //////////////////////////
function calculateTotalBasket () {

  let totalPrice = 0;
  let totalQuantity = 0;

  // récupérer les prix et quantités dans le panier
  for (element of fullBasket) {

    // Additionner/Multiplier les résultats
    totalPrice += parseInt(element.price) * parseInt(element.quantity);
    totalQuantity += parseInt(element.quantity);

  }

  // Insérer dans le DOM
  document.getElementById("totalPrice").innerHTML = totalPrice;
  document.getElementById("totalQuantity").innerHTML = totalQuantity;

}




///////////////////// MODIFIER QUANTITÉ ////////////////////////

function modifyQuantity () {

  let modifyInput = document.querySelectorAll('.itemQuantity');

  modifyInput.forEach((quantity) => {

    quantity.addEventListener("change", (e) => {
    
      //Rechercher l'id le plus proche de là où on clique
      let closestId = e.target.closest('article').getAttribute("data-id");

      //Rechercher la couleur la plus proche de là où on clique
      let closestColor = e.target.closest('article').getAttribute("data-color");

      // Rechercher le premier élément du tableau qui correspond à la condition ( => même id & même couleur)
      let currProduct = productLS.findIndex(element => element.id == closestId && element.color == closestColor); 

      // La quantité du produit ciblé(currProduct) est égal à la valeur que l'utilisateur vient d'écrire(e.target.value)
      productLS[currProduct].quantity = e.target.value;

      // Aussi mettre à jour fullBasket et LS du navigateur
      fullBasket[currProduct].quantity = e.target.value;
      localStorage.setItem("myLocalStorage", JSON.stringify(productLS));

      // Recalculer le total du panier
      calculateTotalBasket();
      
    })

  })

}




//////////////////////// FORMULAIRE ////////////////////////

// 1° Contrôler que le formulaire est bien rempli

// Sélectionner les valeurs que l'utilisateur rempli et Comparer ces valeurs aux regex et envoyer un msg d'erreur si elles ne correspondent pas
function checkFirstName() {

  let firstName = document.getElementById("firstName").value

  if (/^[A-Z][A-Za-z\é\è\ê\ï\-]+$/.test(firstName)) {
    document.getElementById("firstNameErrorMsg").innerHTML = ""
    return true;
  }else{
    document.getElementById("firstNameErrorMsg").innerHTML = "Veuillez entrer un prénom valide"
    return false;
  }
  
}

function checkLastName() {

  let lastName = document.getElementById("lastName").value

  if (/^[A-Z][A-Za-z\é\è\ê\ï\-]+$/.test(lastName)) {
    document.getElementById("lastNameErrorMsg").innerHTML = ""
    return true;
  }else{
    document.getElementById("lastNameErrorMsg").innerHTML = "Veuillez entrer un nom valide"
    return false;
  }

}

function checkAddress() {

  let address = document.getElementById("address").value

  if (/^[A-Za-z0-9\s]{5,50}$/.test(address) && address !== " ") {
    document.getElementById("addressErrorMsg").innerHTML = ""
    console.log(address);
    return true;
  }else{
    document.getElementById("addressErrorMsg").innerHTML = "Veuillez entrer une adresse valide"
    return false;
  }

}

function checkCity() {

  let city = document.getElementById("city").value

  if (/^[#.0-9a-zA-Z\S+,-]+$/.test(city)) {
    document.getElementById("cityErrorMsg").innerHTML = ""
    return true;
  }else{
    document.getElementById("cityErrorMsg").innerHTML = "Veuillez entrer une ville valide"
    return false;
  }

}

function checkEmail() {

  let email = document.getElementById("email").value

  if (/^[a-zA-Z0-9_. -]+@[a-zA-Z.-]+[.]{1}[a-z]{2,10}$/.test(email)) {
    document.getElementById("emailErrorMsg").innerHTML = ""
    return true;
  }else{
    document.getElementById("emailErrorMsg").innerHTML = "Veuillez entrer une adresse mail valide"
    return false;
  }

}

//Rassembler toutes les fonctions en une seule
function errorMessageForm() {

  document.getElementById("order").addEventListener("click", (e) => {
    
    e.preventDefault();
    checkFirstName();
    checkLastName();
    checkAddress();
    checkCity();
    checkEmail();
    
    // Si toutes les fonctions renvoient true => envoyer
    if (checkFirstName() && checkLastName() && checkAddress() && checkCity() && checkEmail()) {

      //envoyer la commande
      if (productLS.length !== 0) {

        sendOrder();

      }else if (productLS.length === 0){

        alert("Votre panier est vide, impossible de commander");

      }

    }

  })
  
}




// 2° Constituer un objet contact et un tableau de produits    
function sendOrder () {

  let contact = {
  firstName: document.getElementById("firstName").value,
  lastName: document.getElementById("lastName").value,
  address: document.getElementById("address").value,
  city: document.getElementById("city").value,
  email: document.getElementById("email").value
  }

  let products = []

    for (const product of fullBasket) {
      products.push(product.id)
    }

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: { 
    'Accept': 'application/json', 
    'Content-Type': 'application/json' 
    },
      body: JSON.stringify({contact, products}) // ce qu'on va envoyer au serveur
    })
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(data) {
      console.log(data.orderId); // nous retourne l'objet contact, le tableau produit et l'id de la commande
      window.location.href = `confirmation.html?orderId=${data.orderId}`;
    })
    
    .catch(function(err) {
      console.log(err)
    });

}
