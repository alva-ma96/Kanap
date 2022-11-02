//récupération de l'id des produits dans l'URL
let searchInURL = new URLSearchParams(window.location.search);
let productId = searchInURL.get('id')
console.log(productId);

// requête fetch pour récupérer les données de chaque produit grâce à l'id
fetch(`http://localhost:3000/api/products/${productId}`)
.then(function(res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function(data) {

console.log(data);

})

.catch(function(err) {
  console.log(err)
});



