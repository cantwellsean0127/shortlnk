// Returns a newly created form
const createForm = (fields, submitAction) => {

    // Creates the form element
    const form = document.createElement("form")

    // Creates an object of the form's inputs' values (this will be used during submit)
    form.input_values = {}

    // Goes through each field
    for (const field of fields) {

        // Creates the input container
        const inputContainer = document.createElement("div")
        inputContainer.classList.add("input-container")
        form.appendChild(inputContainer)

        // Creates the label
        const label = document.createElement("label")
        label.textContent = field.label
        label.setAttribute("for", field.id)
        inputContainer.appendChild(label)

        // Creates the input
        const input = document.createElement("input")
        input.setAttribute("type", field.type)
        input.setAttribute("placeholder", field.placeholder)
        input.setAttribute("id", field.id)
        input.value = field.value
        form.input_values[input.id] = input.value
        inputContainer.appendChild(input)

        // Whenever the input is changed, update the form's inputs object
        input.addEventListener("change", (event) => {
            const input = event.target
            const inputContainer = input.parentNode
            const form = inputContainer.parentNode
            form.input_values[input.id] = input.value
        })
    }

    // Creates the submit button
    const submit = document.createElement("button")
    submit.setAttribute("type", "button")
    submit.textContent = "Submit"
    submit.submitAction = submitAction
    submit.addEventListener("click", async (event) => {
        const submit = event.target
        const form = submit.parentNode
        const formInputKeys = Object.keys(form.input_values)
        for (let index = 0; index < formInputKeys.length; index++) {
            if (form.input_values[formInputKeys[index]] === "") {
                const inputContainer = form.querySelectorAll(".input-container")[index]
                const input = inputContainer.querySelector("input")
                form.input_values[formInputKeys[index]] = input.placeholder
            }
        }
        await submit.submitAction(...Object.values(form.input_values))
        const modal = document.body.querySelector(".modal")
        document.body.removeChild(modal)
        createCards()
    })
    form.appendChild(submit)

    // Returns the newly created form
    return form
}