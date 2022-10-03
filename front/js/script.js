    fetch("http://localhost:3000/api/products")
    .then(function(res) { //récupérer la réponse
      if (res.ok) { //si la réponse est ok
        return res.json(); //alors on récupère la réponse et est formatée en json
      }
    })
    .then(function(data) { //après on récupère les datas depuis res.json

    afficherDiv()


    console.log(data)//les datas sont dispo jusqu'ici
    })

    .catch(function(err) {
      // Une erreur est survenue
      console.log(err)
    });






/*function afficherDiv(){
   let section = document.getElementById('items')
   console.log(section)

   section.innerHTML += `<a href="./product.html?id=42">
   <article>
     <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
     <h3 class="productName">Kanap name1</h3>
     <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
   </article>
 </a>`
}*/


