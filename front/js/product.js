//récupération de l'id des produits dans l'URL
let searchInURL = new URLSearchParams(window.location.search);
let productId = searchInURL.get('id');

let valueColor = document.getElementById("colors")
let valueQuantity = document.getElementById("quantity")


//création div en cas d'erreur
let createDivColor = document.querySelector(".item__content__settings__color").innerHTML += `<div class="error" id="redMessageColor"></div>`
let redMessageColor = document.getElementById("redMessageColor")
redMessageColor.style.color = "red"

let createDivQuantity = document.querySelector(".item__content__settings__quantity").innerHTML += `<div class="error" id="redMessageQuantity"></div>`
let redMessageQuantity = document.getElementById("redMessageQuantity")
redMessageQuantity.style.color = "red"


// requête fetch pour récupérer les données de chaque produit grâce à l'id
fetch(`http://localhost:3000/api/products/${productId}`)
.then(function(res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function(data) {

  displayDataArticle(data) //j'appelle ma fonction
  
})


.catch(function(err) {
  console.log(err)
});

//fonction qui affiche les données de chaque article sur la page produit
function displayDataArticle(data) {
  document.getElementById('title').innerHTML += `${data.name}`
  document.querySelector(".item__img").innerHTML += `<img src="${data.imageUrl}" alt="${data.altTxt}"></img>`
  document.getElementById("price").innerHTML += `${data.price}`
  document.getElementById("description").innerHTML += `${data.description}`

      //boucle => créer autant de <option> qu'il y a de couleurs
  for (const color in data.colors) {
    document.getElementById("colors").innerHTML += `<option value="${data.colors[color]}">${data.colors[color]}</option>`
  }

}

// event sur le bouton ajouter au panier
let cartButton = document.getElementById("addToCart")

function checkColorAndQuantity () {

  cartButton.addEventListener("click", () => {

    valueColor = document.getElementById("colors") // Pourquoi on ne peut pas enlever ces lignes d'ici ??
    valueQuantity = document.getElementById("quantity")
    redMessageColor.innerText = ""
    redMessageQuantity.innerText = ""

    if (valueColor.value == ""){
      redMessageColor.innerText = "Veuillez choisir une couleur"
    }
  
    if (valueQuantity.value < 1 || valueQuantity.value > 99) {
      redMessageQuantity.innerText = "Veuillez choisir une quantité entre 1 et 99"
    }

    if (valueQuantity.value > 0 && valueQuantity.value < 100 && valueColor.value != "") {
      addToCart()
    }     // Condition pour voir que tout est en ordre et ne pas ajouter au LS une quantité 0 par exemple
    
    
  })
}

checkColorAndQuantity ()


// initialiser le local storage avec un tableau vide


function addToCart () {

  // récupérer LS pour voir son état et on le stocke dans une variable pour pouvoir le modifier après
  let myLocalStorage = JSON.parse(localStorage.getItem('myLocalStorage'))

console.log(myLocalStorage);

  let newProduct = {
    'id' : productId,
    'color' : valueColor.value,
    'quantity' : valueQuantity.value
  }

  // SI le LS est vide ==> on ajoute le produit
    if (myLocalStorage === [] || myLocalStorage === null) {

      myLocalStorage = [] // initialiser un tableau vide pr pouvoir pousser chaque nvx produit pour avoir un tableau d'objets pratique si nn on pousse seulement un objet et il sera écrasé à chaque fois qu'on en rajoute un autre
      myLocalStorage.push(newProduct)
      localStorage.setItem('myLocalStorage', JSON.stringify(myLocalStorage)); // on push dans le LS notre tableau temporaire avec les objets qu'on poussé   
      console.log(localStorage + " le LS était vide");
      //JSON.parse pour convertir les données dans le LS du format JSON en un objet JS

    } else if (myLocalStorage.length > 0) {
      console.log("LS pas vide");
      // SI le LS n'est pas vide ==> vérifier que le produit n'est pas déjà présent
      
      let result = myLocalStorage.findIndex((elt) =>
          elt.id === productId )
          console.log(result);
          console.log(myLocalStorage[result].quantity);
    }



}