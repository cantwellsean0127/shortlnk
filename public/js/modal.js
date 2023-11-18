const createEditModal = document.querySelector("#create-and-edit-modal")
const deleteModal = document.querySelector("#delete-modal")

// Closes the modal
const closeCreateEditModal = () => {
    createEditModal.style.setProperty("display", "none")
    createEditModal.querySelector("form").reset()
    createEditModal.removeEventListener("submit", createURLHandler)
    createEditModal.removeEventListener("submit", editURLHandler)
}

// Shows the create modal
const showCreateModal = () => {
    createEditModal.addEventListener("submit", createURLHandler)
    createEditModal.style.setProperty("display", "block")
}

// Create URL handler
const createURLHandler = async (event) => {
    event.preventDefault()
    const form = event.target

    const name = form.querySelector("#form-name").value
    const target_url = form.querySelector("#form-target-url").value

    const api_response = await createURL(name, target_url)
    if (api_response.ok) {
        fetchAllCards()
        closeCreateEditModal()
    } else {
        const api_data = await api_response.json()
        alert(api_data.message)
    }
}

// Shows the edit modal
const showEditModal = (event) => {

    const editIcon = event.target
    const card = editIcon.parentNode

    createEditModal.querySelector("#form-id").value = card.id.split("-")[1]
    createEditModal.querySelector("#form-name").value = card.querySelector(".name").textContent
    createEditModal.querySelector("#form-target-url").value = card.querySelector(".target-url").textContent

    createEditModal.addEventListener("submit", editURLHandler)

    createEditModal.style.setProperty("display", "block")
}

// Edit URL handler
const editURLHandler = async (event) => {

    event.preventDefault()
    const form = event.target

    const id = form.querySelector("#form-id").value
    const name = form.querySelector("#form-name").value
    const target_url = form.querySelector("#form-target-url").value

    const api_response = await updateURL(id, name, target_url)
    if (api_response.ok) {
        fetchAllCards()
        closeCreateEditModal()
    } else {
        const api_data = await api_response.json()
        alert(api_data.message)
    }
}

// Delete URL handler
let deleteURLHandler = () => { }

// Shows the delete modal
const showDeleteModal = (event) => {

    const deleteIcon = event.target
    const card = deleteIcon.parentNode
    const id = card.id.split("-")[1]

    deleteModal.style.setProperty("display", "block")

    deleteURLHandler = async () => {
        const api_response = await deleteURL(id)
        if (api_response.ok) {
            fetchAllCards()
            closeDeleteModal()
        } else {
            const api_data = await api_response.json()
            alert(api_data.message)
        }
    }

    deleteModal.querySelector(".deleteButton").addEventListener("click", deleteURLHandler)
}

const closeDeleteModal = () => {
    deleteModal.style.setProperty("display", "none")
    deleteModal.querySelector(".deleteButton").removeEventListener("click", deleteURLHandler)
}