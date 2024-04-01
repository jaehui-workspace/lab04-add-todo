let store = []

const createStore = async (todos) => {
    if (!todos || !Array.isArray(todos)) {
        throw new Error('Invalid todos data')
    }

    store = todos

    if (store.length) {
        return true
    }
};

const getStore = () => {
    return store
}

const removeFromStore = (uid) => {
    store = store.filter((item) => item.uid !== uid)
    return store
}

const updateStore = (todo) => {
    const index = store.findIndex((item) => item.uid === todo.uid)
    store = [...store.slice(0, index), todo, ...store.slice(index + 1)]
    return store
}

export {getStore, createStore, removeFromStore, updateStore}