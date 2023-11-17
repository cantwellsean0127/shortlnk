const createURL = async (name, target_url) => {
    const requestOptions = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, target_url })
    }
    const response = await fetch("/api/urls", requestOptions)
    const data = await response.json()
    return data
}

const readURLs = async () => {
    const response = await fetch("/api/urls")
    const data = await response.json()
    return data
}

const updateURL = async (id, name, target_url) => {
    const requestOptions = {
        method: "patch",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, target_url })
    }
    const response = await fetch("/api/urls", requestOptions)
    const data = await response.json()
    return data
}

const deleteURL = async (id) => {
    const requestOptions = {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    }
    const response = await fetch("/api/urls", requestOptions)
    const data = await response.json()
    return data
}