//récupération de l'id des produits dans l'URL
let searchInURL = new URLSearchParams(window.location.search);
let productId = searchInURL.get('id');


// on va chercher la valeur pour la couleur et quantité
let valueColor = document.getElementById("colors")
let valueQuantity = document.getElementById("quantity")


//création div pour écrire le message d'erreur en rouge
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

  displayDataArticle(data) //appeler fonction pr afficher données du produit 
  
})

.catch(function(err) {
  console.log(err)
});

//fonction qui affiche les données de l'article sélectionné sur la page produit
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


// event sur le bouton "ajouter au panier"
let cartButton = document.getElementById("addToCart")

// fonction pour vérifier les couleurs et quantités choisies ET insérer dans le localStorage
function checkColorAndQuantity () {

  cartButton.addEventListener("click", () => {

    valueColor = document.getElementById("colors")
    valueQuantity = document.getElementById("quantity")
    redMessageColor.innerText = ""
    redMessageQuantity.innerText = ""

    if (valueColor.value == ""){
      redMessageColor.innerText = "Veuillez choisir une couleur"
    }
  
    if (valueQuantity.value < 1 || valueQuantity.value > 99) {
      redMessageQuantity.innerText = "Veuillez choisir une quantité entre 1 et 99"
    }

    if (valueQuantity.value > 0 && valueQuantity.value < 100 && valueColor.value != "") { // Condition pour voir que tout est en ordre et ne pas ajouter au LS une quantité 0 par exemple
    
      addToCart();

      document.querySelector(".item__content__addButton").innerHTML += `<div class="item__content__validMessage">
      <p>Votre article a bien été rajouté au panier</p>
      </div>`
    }
  })
}

checkColorAndQuantity ()


function addToCart () {

  // récupérer LS pour voir son état et on le stocke dans une variable pour pouvoir le modifier après
  let myLocalStorage = JSON.parse(localStorage.getItem('myLocalStorage')) //JSON.parse pour convertir les données dans le LS du format JSON en un objet JS

  let newProduct = {
    'id' : productId,
    'color' : valueColor.value,
    'quantity' : valueQuantity.value
  }
  // SI le LS est vide ou null ==> on ajoute le produit
    if (myLocalStorage === [] || myLocalStorage === null) {

      myLocalStorage = [] // initialiser un tableau vide pr pouvoir pousser chaque nvx produit pour avoir un tableau d'objets pratique si nn on pousse seulement un objet et il sera écrasé à chaque fois qu'on en rajoute un autre

      myLocalStorage.push(newProduct) // on push le nvx produit dans notre tableau

      localStorage.setItem('myLocalStorage', JSON.stringify(myLocalStorage)); // on push notre tableau temporaire dans le LS du navigateur avec les objets qu'on avait poussé   

      // Grâce à if et else if, on va pouvoir vérifier une seule des 2 conditions. Soit le LS est vide, soit il ne l'est pas. Contrairement à si on avait fait 2 if séparés, on aurait d'office regardé dans les 2 conditions.
    } else if (myLocalStorage.length > 0) {
      // SI le LS n'est pas vide ==> vérifier que le produit n'est pas déjà présent 

      let indexProduct = myLocalStorage.findIndex((elt) => 
        elt.id === productId && elt.color === valueColor.value)

          if (indexProduct > -1) { //si index trouvé :
            // on met à jour la quantité
            myLocalStorage[indexProduct].quantity = parseInt(myLocalStorage[indexProduct].quantity) + parseInt(newProduct.quantity);

            // On met le LS à jour
            localStorage.setItem('myLocalStorage', JSON.stringify(myLocalStorage));

          }else{ //si index pas trouvé : on push le nvx produit
            myLocalStorage.push(newProduct)
            localStorage.setItem('myLocalStorage', JSON.stringify(myLocalStorage));
          }
          
       }

 
 }

