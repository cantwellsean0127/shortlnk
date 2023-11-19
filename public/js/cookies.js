const getCookieValue = (cookie_name) => {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        let cookieParts = cookie.split("=")
        if (cookieParts[0] === cookie_name) {
            return cookieParts[1]
        }
    }
    return undefined
}
