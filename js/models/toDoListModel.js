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
    await set(dbRef, newTodo);

    // Fetch the updated todo items from the local store
    const dbResponse = await get(dbRef); // Fetch the newly added todo from the database
    const newTodoData = dbResponse.val(); // Extract the todo data from the database response
    const todos = [{ ...newTodoData, uid: newTodoKey }, ...getStore()]; // Combine the new todo with existing todos

    await createStore(todos); // Pass the updated todos to createStore

    // Notify the observers about the change
    const store = getStore();
    notify(store);
}