// Returns a newly created modal
const createModal = () => {

    // Creates a new div element with the modal class
    const modal = document.createElement("div")
    modal.classList.add("modal")

    // Creates a new div element for the modal's content
    const modalContent = document.createElement("div")
    modalContent.classList.add("modal-content")
    modal.appendChild(modalContent)

    // Creates an easy access variable for the modal's content
    modal.content = modalContent

    // Adds an event listener so that when the user clicks outside the content, the modal is removed
    modal.addEventListener("click", (event) => {
        let modal = event.target
        while (!modal.classList.contains("modal")) {
            modal = modal.parentNode
        }
        if (!modal.content.contains(event.target)) {
            document.body.removeChild(modal)
        }
    })

    // Returns the newly created modal
    return modal
}