const cardsContainer = document.body.querySelector("#cards-container")
let currentlyHoveredCard = null

const createCards = async () => {

    // Removes any URL cards currently within the DOM
    const cards = cardsContainer.querySelectorAll(".card")
    for (const card of cards) {
        cardsContainer.removeChild(card)
    }

    // Fetches all the URLs from the database and adds them to the DOM
    const urls = await readURLs()
    for (const url of urls) {
        createCard(url)
    }
}

// Creates a card for the passed url object
const createCard = (url) => {

    // Creates the card's container
    const card = document.createElement("div")
    card.id = url.id
    card.classList.add("card")
    cardsContainer.prepend(card)

    // Creates teh card's image
    const favicon = document.createElement('img')
    favicon.src = `https://www.google.com/s2/favicons?domain=${url.target_url}`
    card.appendChild(favicon)

    // Creates the card's name
    const name = document.createElement('h3')
    name.classList.add("card-name")
    name.textContent = url.name
    card.appendChild(name)

    // Crates the card's shortened url
    const shortenedUrl = document.createElement('p')
    shortenedUrl.classList.add("card-shortened-url")
    shortenedUrl.textContent = url.shortened_url
    card.appendChild(shortenedUrl)

    // Crates the card's target url
    const targetUrl = document.createElement('p')
    targetUrl.classList.add("card-target-url")
    targetUrl.textContent = url.target_url
    card.appendChild(targetUrl)

    // Event listeners for determing if this card is currently being hovered
    card.addEventListener("mouseenter", setCurrentlyHovered)
    card.addEventListener("mouseleave", unsetCurrentlyHovered)
}

const setCurrentlyHovered = (event) => {
    currentlyHoveredCard = event.target
}

const unsetCurrentlyHovered = () => {
    currentlyHoveredCard = null
}