const modal = document.body.querySelector("#modal")
const modalContent = modal.querySelector("#modal-content")
const modalForm = modalContent.querySelector("#modal-form")
const modalSubmit = modalForm.querySelector("#modal-form .input-container button")

modal.style.setProperty("display", "none")

const showCreateURLModal = () => {

    modal.style.setProperty("display", "flex")
    modal.querySelector("#name").setAttribute("placeholder", "My Shortened URL :)")
    modal.querySelector("#target-url").setAttribute("placeholder", "http://www.example.com")

    modal.querySelector("#submit").addEventListener("click", async () => {

        const target_url = modalForm.querySelector("#target-url").value
        const name = modalForm.querySelector("#name").value
        await createURL(name, target_url)

        modal.style.setProperty("display", "none")
        modalForm.reset()
        createCards()

    }, { once: true })

    document.body.addEventListener("click", clickOffURLModal, { capture: true })
}

const showUpdateURLModal = (card) => {

    modal.style.setProperty("display", "flex")
    modal.querySelector("#name").value = card.querySelector(".card-name").textContent
    modal.querySelector("#target-url").value = card.querySelector(".card-target-url").textContent

    const submitButton = modal.querySelector("#submit")
    submitButton.addEventListener("click", async () => {

        const id = card.id
        const target_url = modalForm.querySelector("#target-url").value
        const name = modalForm.querySelector("#name").value
        await updateURL(id, name, target_url)
        modal.style.setProperty("display", "none")
        const form = document.querySelector("#modal-form")
        modalForm.reset()
        createCards()

    }, { once: true })

    document.body.addEventListener("click", clickOffURLModal, { capture: true })
}

const clickOffURLModal = (event) => {
    if (!modalContent.contains(event.target)) {
        modal.style.setProperty("display", "none")
    }
}