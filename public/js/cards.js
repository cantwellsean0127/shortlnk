const cards_container = document.querySelector("#cards-container")

// This function retrieves all cards, but keeps them hidden
const fetchAllCards = async () => {
    cards_container.innerHTML = ""
    const api_response = await apiRequest("/api/urls", "GET")
    const api_data = await api_response.json()
    if (api_response.ok) {
        for (const card_data of api_data) {
            createCard(card_data)
        }
    } else {
        alert(api_data.message)
    }
}

// This function creats a card and adds it to the dashboard
const createCard = (card_data) => {

    // Creates the card itself
    const card = document.createElement("div")
    card.id = "card-" + card_data.id
    card.classList.add("card")
    cards_container.appendChild(card)

    // Creates the edit icon
    const editIcon = document.createElement("img")
    editIcon.src = "/images/edit-icon-24px.png"
    editIcon.addEventListener("click", showEditModal)
    card.appendChild(editIcon)

    // Creates the delete icon
    const deleteIcon = document.createElement("img")
    deleteIcon.addEventListener("click", showDeleteModal)
    deleteIcon.src = "/images/delete-icon-24px.png"
    card.appendChild(deleteIcon)

    // Creates the name heading
    const name = document.createElement("h2")
    name.classList.add("name")
    name.textContent = card_data.name
    card.appendChild(name)

    // Creates the shortened url paragraph
    const shortened_url = document.createElement("p")
    shortened_url.classList.add("shortened-url")
    let location = window.location.href
    if (location[location.length - 1] === "/") location = location.slice(0, location.length - 1)
    shortened_url.textContent = location + card_data.shortened_url
    card.appendChild(shortened_url)

    // Creates the target url paragraph
    const target_url = document.createElement("p")
    target_url.classList.add("target-url")
    target_url.textContent = card_data.target_url
    card.appendChild(target_url)
}

// Shows the card container
const showCardsContainer = () => {
    cards_container.style.setProperty("display", "block")
}