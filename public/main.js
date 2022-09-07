const addButton = document.getElementById("addItem")
const descriptionInput = document.getElementById("description")
const destinationInput = document.getElementById("destination")
const locationInput = document.getElementById("location")
const wishList = document.getElementById("myWishlist")
const h2OnList = document.querySelector("h2")
const defaultImage = 'images/defaultVacation.jpeg'

//Edit cards
wishList.addEventListener('click', (e) => {

    if(e.target.id === 'editButton'){
        
        let postBody = {}
        postBody.cardObjectID = e.target.parentNode.parentNode.parentNode.parentNode.id
        
        console.log('destination text', e.target.parentNode.parentNode.childNodes[1].innerText)
        console.log('location text', e.target.parentNode.parentNode.childNodes[3].innerText)
        console.log('description text', e.target.parentNode.parentNode.childNodes[5].innerText)

        let editDestination = prompt("Enter new name")
        editDestination ? postBody.destination = editDestination : postBody.destination = e.target.parentNode.parentNode.childNodes[1].innerText

        let editLocation = prompt('Enter new location')
        editLocation ? postBody.location = editLocation : postBody.location = e.target.parentNode.parentNode.childNodes[3].innerText
        
        let editDescription = prompt('Enter new description')
        editDescription ? postBody.description = editDescription : postBody.description = e.target.parentNode.parentNode.childNodes[5].innerText

        fetch('/wishlist', {
            method: 'put', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(postBody)
        })
        .then(res => {
            if(res.ok) return res.json()
        })
        .then(response => {
            console.log(response)
            location.reload(true)
        })
        .catch(error => {
            console.log(error)
        })
    }
})

//Remove cards
wishList.addEventListener('click', function(e){
    if(e.target.id === 'removeButton'){
        
        fetch('/wishlist', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                cardObjectID: e.target.parentNode.parentNode.parentNode.parentNode.id
            })
        })
        .then(res => {
            if(res.ok) return res.json()
        })
        .then(response => {
            console.log(response)
           window.location.reload(true)
        })
        .catch(error => {
            console.log(error)
        })
    }

})