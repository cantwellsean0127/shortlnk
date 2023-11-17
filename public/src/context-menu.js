const contextMenu = document.body.querySelector("#context-menu")
const contextMenuItems = contextMenu.querySelectorAll(".context-menu-item")
let contextMenuCard = undefined

const hideContextMenu = () => {
    contextMenuCard = undefined
    contextMenu.style.setProperty("display", "none")
}

const showContextMenu = (mouseX, mouseY) => {
    if (contextMenuCard === undefined || contextMenuCard === null) {
        contextMenuItems[1].style.setProperty("display", "none")
        contextMenuItems[2].style.setProperty("display", "none")
    } else {
        contextMenuItems[1].style.setProperty("display", "inherit")
        contextMenuItems[2].style.setProperty("display", "inherit")
    }
    contextMenu.style.setProperty("top", mouseY + "px")
    contextMenu.style.setProperty("left", mouseX + "px")
    contextMenu.style.setProperty("display", "block")
}

const contextMenuRightClickHandler = (event) => {
    event.preventDefault()
    contextMenuCard = lastHoveredCard
    showContextMenu(event.x, event.y)
    document.body.addEventListener("click", (event) => {
        if (!contextMenu.contains(event.target)) {
            hideContextMenu()
        }
    })
}

const contextMenuNewClickHandler = () => {
    hideContextMenu()
    showCreateURLModal()
}

const contextMenuEditClickHandler = () => {
    showUpdateURLModal(contextMenuCard)
    hideContextMenu()
}

const contextMenuDeleteClickHandler = () => {
    deleteURL(contextMenuCard.id)
    hideContextMenu()
    createCards()
}

const addContextMenuEventListeners = () => {

    contextMenuItems[0].addEventListener("click", contextMenuNewClickHandler)
    contextMenuItems[1].addEventListener("click", contextMenuEditClickHandler)
    contextMenuItems[2].addEventListener("click", contextMenuDeleteClickHandler)
    window.addEventListener("contextmenu", contextMenuRightClickHandler)
}

hideContextMenu()
addContextMenuEventListeners()