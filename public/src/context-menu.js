const contextMenu = document.body.querySelector("#context-menu")
const contextMenuItems = contextMenu.querySelectorAll(".context-menu-item")

// Hides the context menu
const hideContextMenu = () => {

    // We removed the mouse leave event listener whenever we created the context menu, now we need to add it back
    if (currentlyHoveredCard !== null) {
        currentlyHoveredCard.addEventListener("mouseleave", unsetCurrentlyHovered)
    }

    // Actually hides the context menu
    contextMenu.style.setProperty("display", "none")
}

// Shows the context menu
const showContextMenu = (mouseX, mouseY) => {

    // If we're not hovering above a card, don't show the edit/delete buttons
    if (currentlyHoveredCard === null) {
        contextMenuItems[1].style.setProperty("display", "none")
        contextMenuItems[2].style.setProperty("display", "none")
    } else {
        contextMenuItems[1].style.setProperty("display", "inherit")
        contextMenuItems[2].style.setProperty("display", "inherit")
    }

    // Sets the location of the context menu
    contextMenu.style.setProperty("top", mouseY + "px")
    contextMenu.style.setProperty("left", mouseX + "px")

    // Actually displays the context menu
    contextMenu.style.setProperty("display", "block")
}

const contextMenuRightClickHandler = (event) => {

    // Prevents the default behavior of right clicking
    event.preventDefault()

    // Whenever the context menu is clicked, we want to prevent the currently hovered card becoming null when the mouse leaves the card and enters the context menu
    if (currentlyHoveredCard !== null) {
        currentlyHoveredCard.removeEventListener("mouseleave", unsetCurrentlyHovered)
    }

    // Shows the context menu
    showContextMenu(event.x, event.y)

    // When a user clicks, hide the context menu
    document.body.addEventListener("click", (event) => {
        if (!contextMenu.contains(event.target)) {
            hideContextMenu()
        }
    })
}

// Handler for the new button
const contextMenuNewClickHandler = () => {

    // Creates the form
    const form = createForm([
        {
            label: "Name: ",
            type: "text",
            placeholder: "My Shortened URL :)",
            value: "",
            id: "new-form-name"
        },
        {
            label: "Target URL: ",
            type: "url",
            placeholder: "http://www.example.com",
            value: "",
            id: "new-form-target-url"
        }
    ], createURL)

    // Creates the modal
    const modal = createModal()

    // Adds the form to the modal's content
    modal.content.appendChild(form)

    // Hides the context menu
    hideContextMenu()

    // Adds the modal to the document
    document.body.appendChild(modal)
}

const contextMenuEditClickHandler = () => {

    // Creates the form
    const form = createForm([
        {
            label: "ID: ",
            type: "number",
            value: currentlyHoveredCard.id,
            placeholder: "",
            id: "edit-form-id"
        },
        {
            label: "Name: ",
            type: "text",
            placeholder: "My Shortened URL :)",
            value: currentlyHoveredCard.querySelector(".card-name").textContent,
            id: "edit-form-name"
        },
        {
            label: "Target URL: ",
            type: "url",
            placeholder: "http://www.example.com",
            value: currentlyHoveredCard.querySelector(".card-target-url").textContent,
            id: "edit-form-target-url"
        }
    ], updateURL)

    // Hides the form's first input container.
    // This is required to exist for the submit action, however, we don't want user's editing it
    form.querySelector(".input-container").style.setProperty("display", "none")

    // Creates the modal
    const modal = createModal()

    // Adds the form to the modal's content
    modal.content.appendChild(form)

    // Hides the context menu
    hideContextMenu()

    // Adds the modal to the document
    document.body.appendChild(modal)
}

// Handler for the delete button
const contextMenuDeleteClickHandler = async () => {

    // Deletes the card
    await deleteURL(currentlyHoveredCard.id)

    // Sets the currently hovered card to null since we just deleted it
    currentlyHoveredCard = null

    // Hides the context menu
    hideContextMenu()

    // Updates the cards
    createCards()
}

// Adds the click event listeners
const addContextMenuEventListeners = () => {
    contextMenuItems[0].addEventListener("click", contextMenuNewClickHandler)
    contextMenuItems[1].addEventListener("click", contextMenuEditClickHandler)
    contextMenuItems[2].addEventListener("click", contextMenuDeleteClickHandler)
    window.addEventListener("contextmenu", contextMenuRightClickHandler)
    contextMenu.addEventListener("mouseleave", hideContextMenu)
}

// Hide the context menu by default
hideContextMenu()

// Add the click event listeners
addContextMenuEventListeners()