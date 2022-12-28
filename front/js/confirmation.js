// Récupération du numéro de commande dans l'url
let searchInURL = new URLSearchParams(window.location.search);
const orderId = searchInURL.get("orderId");

// Afficher le numéro de commande sur la page
document.getElementById("orderId").innerHTML += `${orderId}`;