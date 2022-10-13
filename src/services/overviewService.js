import axios from '../axios';

const getOverView = (data) => {
    console.log('sevice', data)
    return axios.post('/api/overview', {
        idItem: data.id,
        rateRoi: data.rateRoi,
        cookie: data.cookie,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        proxy: data.proxy,
        dateType: data.dateType,
        idShop: data.idShop,
        proxy: data.proxy
    });
}

const getCookie = (idShop) => {
    return axios.post('/api/get/cookie', {
        id: idShop,

    });
}

const getReportAds = (data) => {
    return axios.post('/api/ads/report', {
        adgroupId: data.adgroupId,
        endDate: data.dateEnd,
        startDate: data.dateStart,
        pageNo: data.pageNo,
        Cookie: data.Cookie,
        proxy: data.proxy
    });
}


const getBusinessEveryday = (data) => {
    return axios.post('/api/get/everyday', {
        Sku: data.Sku,
        startDate: data.startDate,
        endDate: data.endDate,
        cookie: data.cookie,
        proxy: data.proxy
    });
}
const editItem = (id, checkbox) => {
    return axios.post('/api/edit/item', {
        id: id,
        Checkbox: checkbox,

    });
}


export {
    getOverView,
    getCookie,
    getReportAds,
    getBusinessEveryday,
    editItem,
}