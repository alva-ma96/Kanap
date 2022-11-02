    fetch("http://localhost:3000/api/products")
    .then(function(res) { //récupérer la réponse
      if (res.ok) { //si la réponse est ok
        return res.json(); //alors on récupère la réponse formatée en json
      }
    })
    .then(function(data) { //après on récupère les datas depuis res.json

      data.forEach(element => afficherProduitsAccueil(element)); //boucle for..each afin d'afficher tous les éléments du tableau.
      //data est le tableau qui contient toutes les infos des produits. element représente les éléments du tableau et on appelle la fonction qui prend element en paramètre.
      

    console.log(data)//les datas sont dispo jusqu'ici
    })

    .catch(function(err) {
      // Une erreur est survenue
      console.log(err)
    });

function afficherProduitsAccueil(product){
   let section = document.getElementById('items') //recherche de l'élément qui possède l'id items dans le DOM et on le stocke dans la variable section.
   console.log(product)

   //on ajoute du contenu html dans la variable section en sélectionnant les éléments du tableau appropriés.
   section.innerHTML += `<a href="./product.html?id=${product._id}">
   <article>
     <img src="${product.imageUrl}" alt="${product.altTxt}">
     <h3 class="productName">${product.name}</h3>
     <p class="productDescription">${product.description}</p>
   </article>
 </a>`
}
