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

    // Gets the location for the current browser
    let location = window.location.href
    if (location[location.length - 1] === "/") location = location.slice(0, location.length - 1)

    // Creates the shortened url link
    const shortened_url = document.createElement("a")
    shortened_url.classList.add("shortened-url")
    const full_shortend_url = location + card_data.shortened_url
    shortened_url.textContent = full_shortend_url
    shortened_url.href = full_shortend_url
    shortened_url.target = "_blank"
    card.appendChild(shortened_url)

    // Creates the copy icon for copying the link to the user's clipboard
    const shortened_url_copy = document.createElement("img")
    shortened_url_copy.src = "/images/copy-icon-16px.png"
    shortened_url_copy.alt = "Copy to clipboard icon"
    shortened_url_copy.classList.add("copy-icon")
    shortened_url_copy.addEventListener("click", () => navigator.clipboard.writeText(location + card_data.shortened_url))
    card.appendChild(shortened_url_copy)

    // Adds a break between the two links
    card.appendChild(document.createElement("br"))

    // Creates the target url link
    const target_url = document.createElement("a")
    target_url.classList.add("target-url")
    const full_target_url = card_data.target_url
    target_url.textContent = full_target_url
    target_url.href = full_target_url
    target_url.target = "_blank"
    card.appendChild(target_url)

    // Creates the copy icon for copying the link to the user's clipboard
    const target_url_copy = document.createElement("img")
    target_url_copy.src = "/images/copy-icon-16px.png"
    target_url_copy.alt = "Copy to clipboard icon"
    target_url_copy.classList.add("copy-icon")
    target_url_copy.addEventListener("click", () => navigator.clipboard.writeText(card_data.shortened_url))
    card.appendChild(target_url_copy)
}

// Shows the card container
const showCardsContainer = () => {
    cards_container.style.setProperty("display", "block")
}