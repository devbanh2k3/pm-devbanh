import axios from '../axios';


const getListShop = (id) => {
    return axios.post('/api/get/allshop', {
        id: id
    })
}
const createNewShop = (cookie, shopName) => {
    return axios.post('/create-shop', {
        token: cookie,
        shopName: shopName,

    });
}
const editShop = (data) => {
    return axios.post('/edit-shop', {
        id: data.id,
        Token: data.textCookie,
        shopName: data.textNameShop,
    });
}
const deleteShop = (id) => {
    return axios.post('/api/delete/shop', {
        id: id,

    });
}
const deleteItemInShop = (id) => {
    return axios.post('/api/delete/item-in-shop', {
        id: id,

    });
}
export {
    getListShop,
    createNewShop,
    editShop,
    deleteShop,
    deleteItemInShop,
}