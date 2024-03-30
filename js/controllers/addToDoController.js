import { addToDo } from "../models/toDoListModel"
import { getToDoData } from "../models/toDoListModel"

let dialog
let closeButton
let exitButton
let form

export function addToDoController() {
    dialog = document.querySelector('#create-to-do')
    exitButton = dialog.querySelector('#exit')
    closeButton = dialog.querySelector('#close')
    form = dialog.querySelector('form')
    configureListeners()
    dialog.showModal()
}

function configureListeners() {
    exitButton.addEventListener('click', onCloseDialog)
    closeButton.addEventListener('click', onCloseDialog)
    form.addEventListener('submit', onAddToDoItem)
}

async function onAddToDoItem(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const category = formData.get('category')
    const status = formData.get('status')
    const todo = formData.get('todo')

    await addToDo(category, status, todo)
    await getToDoData()

    onCloseDialog()
}

function onCloseDialog() {
    dialog.close()
}