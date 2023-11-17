const cardsContainer = document.body.querySelector("#cards-container")

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

const createCard = (url) => {

    const card = document.createElement("div")
    card.id = url.id
    card.classList.add("card")

    const favicon = document.createElement('img')
    favicon.src = `https://www.google.com/s2/favicons?domain=${url.target_url}`
    card.appendChild(favicon)

    const name = document.createElement('h3')
    name.classList.add("card-name")
    name.textContent = url.name
    card.appendChild(name)

    const shortenedUrl = document.createElement('p')
    shortenedUrl.classList.add("card-shortened-url")
    shortenedUrl.textContent = url.shortened_url
    card.appendChild(shortenedUrl)

    const targetUrl = document.createElement('p')
    targetUrl.classList.add("card-target-url")
    targetUrl.textContent = url.target_url
    card.appendChild(targetUrl)

    card.addEventListener("mouseenter", (event) => lastHoveredCard = event.target)
    card.addEventListener("mouseleave", () => lastHoveredCard = null)

    cardsContainer.prepend(card)
}

let lastHoveredCard = null
