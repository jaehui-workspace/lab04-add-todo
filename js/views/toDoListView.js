import { toDoItemTemplate } from "../templates/toDoItemTemplate";
import { subscribe } from "../models/toDoListModel";
import { deleteToDoController } from '../controllers/deleteToDoController';
import { updateToDoController } from "../controllers/updateToDoController";
import { addToDoController } from "../controllers/addToDoController";

let view;

export function toDoListView() {
    view = document.querySelector('#to-do-list')
    view.addEventListener('click', onHandleClick)
}

subscribe(render)

function render(data) {
    const div = document.createElement('div')
    const toDoList = document.querySelector('#item-container')
    toDoList.replaceChildren()

    data.forEach((item) => {
        div.prepend(toDoItemTemplate(item))
    })

    toDoList.append(div)
}

function onHandleClick(e) {
    switch (e.target.id) {
        case 'delete':
            deleteToDoController(e.target.dataset.uid);
            break;
        case 'edit':
            updateToDoController(e.target.dataset.uid);
            break;
        case 'add':
            addToDoController();
            break;
        default:
            break;
    }
}