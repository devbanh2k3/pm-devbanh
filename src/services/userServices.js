import axios from '../axios';
import axiosSDK from '../axiosSDK'

// lấy id order

const getListOrderID = (Token, status, created_after, limit, offset) => {
    return axiosSDK.post('xuli.php', new URLSearchParams({
        token: Token,
        status: status,
        created_after: created_after,
        limit: limit,
        offset: offset,
    }));
}
const setPack = (Token, order_item_ids, shipping_provider) => {
    return axiosSDK.post('pack.php', new URLSearchParams({
        token: Token,
        order_item_ids: order_item_ids,
        shipping_provider: shipping_provider,
    }));
}
const setReadyToShip = (Token, order_item_ids, shipping_provider, tracking_number) => {
    return axiosSDK.post('ready-to-ship.php', new URLSearchParams({
        token: Token,
        order_item_ids: order_item_ids,
        shipping_provider: shipping_provider,
        tracking_number: tracking_number
    }));
}
const getOrderItems = (Token, order_ids) => {
    return axiosSDK.post('get-order-item.php', new URLSearchParams({
        token: Token,

        order_ids: order_ids
    }));
}

const handleLoginApi = (email, firsName) => {
    return axios.post('/api/login', {
        email: email,
        firstName: firsName
    });
}

const ApiLazada = (searchStr, endDate, startDate, dateType, Cookie, proxy) => {
    return axios.post('/api/business/total', {
        searchStr: searchStr,
        endDate: endDate,
        startDate: startDate,
        dateType: dateType,
        Cookie: Cookie,
        proxy: proxy,

    });
}

const getAll = (id) => {
    return axios.post('/api/get-all-user', {
        id: "All"
    })
}

const getListItem = (id) => {
    return axios.post('/api/get/allitem', {
        id: id,
    })
}

const getOverview = (idItem, rateRoi) => {
    return axios.post('/api/overview', {
        idItem: idItem,
        rateRoi: rateRoi
    })
}

const createNewItem = (NameItem, shopId, IdAds, Sku, Cookie) => {
    return axios.post('/api/create/newitem', {
        NameItem: NameItem,
        shopId: shopId,
        IdAds: IdAds,
        Sku: Sku,
        Cookie: '',

    });
}
const deleteItem = (id) => {
    return axios.post('/api/delete/item', {
        id: id,

    });
}
const getListItemSelect = () => {
    return axios.post('/api/get/allitemselect', {
    });
}
export {
    handleLoginApi,
    ApiLazada,
    getAll,
    getListItem,
    getOverview,
    createNewItem,
    deleteItem,
    getListItemSelect,

    getOrderItems,
    getListOrderID,
    setPack,
    setReadyToShip,
}