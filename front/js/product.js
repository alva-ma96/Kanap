//récupération de l'id des produits dans l'URL
let searchInURL = new URLSearchParams(window.location.search);
let productId = searchInURL.get('id');

// requête fetch pour récupérer les données de chaque produit grâce à l'id
fetch(`http://localhost:3000/api/products/${productId}`)
.then(function(res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function(data) {

  console.log(data);
  displayArticle(data) //j'appelle ma fonction

})


.catch(function(err) {
  console.log(err)
});

//création d'une fonction qui affiche les données des chaque article sur la page produit
function displayArticle(data) {
  document.getElementById('title').innerHTML += `${data.name}`
  document.querySelector(".item__img").innerHTML += `<img src="${data.imageUrl}" alt="${data.altTxt}"></img>`
  document.getElementById("price").innerHTML += `${data.price}`
  document.getElementById("description").innerHTML += `${data.description}`

  //boucle => créer autant de <option> qu'il y a de couleurs
  for (const color in data.colors) {
    document.getElementById("colors").innerHTML += `<option value="${data.colors[color]}">${data.colors[color]}</option>`
  }

}