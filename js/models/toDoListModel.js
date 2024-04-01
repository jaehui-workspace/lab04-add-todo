import {ref, set, get, push, child, remove, update} from 'firebase/database'
import { db } from '../lib/firebase/config/firebaseInit'
import { createStore, removeFromStore, updateStore, getStore } from './store'

let observers = []

export function subscribe(fn) {
    observers.push(fn)
}

export function notify(data) {
    observers.forEach((observer) => observer(data))
}

export async function getToDoData() {
    const dbRef = ref(db, 'todos')
    const response = await get(dbRef)
    let payload = await response.val()
    payload = Object.entries(payload)
    let toDoItems = payload.map((item) => {
        return {...item[1], uid: item[0]}
    })
    if (await createStore(toDoItems)) {
        notify(toDoItems)
    }
}

export function deleteToDo(uid) {
    const dbRef = ref(db, `todos/${uid}`)
    remove(dbRef)
    const store = removeFromStore(uid)
    notify(store)
}

export function updateToDo(updatedToDo) {
    let payload = updatedToDo
    const dbRef = ref(db, `todos/${payload.uid}`)
    update(dbRef, payload)
    const store = updateStore(payload)
    notify(store)
}

export async function addToDo(category, status, todo) {
    const dbRef = push(ref(db, 'todos'));
    const newTodoKey = dbRef.key;
    const newTodo = {
        uid: newTodoKey,
        category: category,
        status: status,
        todo: todo
    };
    await set(dbRef, newTodo)

    const dbResponse = await get(dbRef)
    const newTodoData = dbResponse.val()
    const todos = [{ ...newTodoData, uid: newTodoKey }, ...getStore()]

    await createStore(todos)

    const store = getStore()
    notify(store)
}