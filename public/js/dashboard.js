const dashboard = document.querySelector("#dashboard-container")

const showDashboard = () => {
    dashboard.style.setProperty("display", "block")
    fetchAllCards()
}