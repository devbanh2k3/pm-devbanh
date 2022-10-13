import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';

import { getListItemSelect, getListItem, getListOrderID, getOrderItems, setPack, setReadyToShip } from '../../services/userServices';
import { getListShop } from '../../services/ShopServices';
import ModelUser from './modelUser';
import { emitter } from '../../utils/emitter';
import { CSVLink } from 'react-csv';
import { notifyError, notifySuccess, notifyWarn } from './notify';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ShowListItem from './modalItemChecker';
const moment = require('moment');

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '-1', date: '',
            value2: '-1', date2: '',
            day7: '',
            day30: '',
            day: '',
            selectDate: '',
            dataOrderID: {},
            dataOrderItems: [],
            dataOrderItemsFilter: [],
            dataOrderItemsFilter2: [],
            boolCheckArray: new Array(100).fill(false),
            countOrder: 0,
            loadOrder: 0,
            activeLink: 0,
            isOpenModalUser: false,

            countPage: 0,
            pagesArray: [],
            statuss: '',
            isLoading: false,
            shipment_provider: '',

            tokenValue: '',

            isOpenModalShowListItem: false,
            arrItemSelect: []
        }
    }
    async componentDidMount() {
        this.setDate();

        //let data = await setPack(this.state.tokenValue, "[367027221139544]", "J&T VN")
        //console.log('tesst', data);
        // this.setState({
        //     boolCheckArray: new Array(1000).fill(false)
        // })


    }
    toggleShopModalListItem = () => {
        this.setState({
            isOpenModalShowListItem: !this.state.isOpenModalShowListItem,
        })

    }
    handleChange = (index) => {
        this.setState(prev => ({
            boolCheckArray: prev.boolCheckArray.map((val, i) => !val && i === index ? true : (val && i === index ? false : val))
        }), () => {
            console.log("đây", this.state.boolCheckArray);
        })
    }
    handleOnClickActive = (id) => {
        this.setState({
            activeLink: id
        });
        console.log('status', this.state.statuss)
        this.handleWaitToPackLimit2(this.state.statuss, id);
    }

    setDate = () => {
        var date = new Date();
        var oneDay = date.setDate(date.getDate() - 1);
        date = new Date();
        var SevenDay = date.setDate(date.getDate() - 7);
        date = new Date();
        var bamuoiDay = date.setDate(date.getDate() - 30);

        const result1 = moment(SevenDay).format("YYYY-MM-DDTHH:mm:ss.SSSZZ")
        const result2 = moment(bamuoiDay).format("YYYY-MM-DDTHH:mm:ss.SSSZZ")
        const result3 = moment(oneDay).format("YYYY-MM-DDTHH:mm:ss.SSSZZ")
        this.setState({
            day7: moment(SevenDay).format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),
            day30: result2,
            day: result3
        }, () => {
            console.log(this.state.day7, this.state.day30, this.state.day)
        })
    }
    getAllItem = async () => {
        let response = await getListItem('All');
        if (response) {
            this.setState({
                arrItems: response.data,
            }, () => {
                //chạy xong thì chạy ở đây
            })
        }
        console.log(this.state.arrItems);
    }


    getallShop = async (id) => {
        let response = await getListShop(id);
        if (response) {
            if (id === 'All') {
                this.setState({
                    arrOptionShop: response.data,
                }, () => {
                    //chạy xong thì chạy ở đây
                    console.log(this.state.arrOptionShop)
                })
            }
            else {
                this.setState({
                    arrOptionShop: response.data,
                }, () => {
                    //chạy xong thì chạy ở đây
                })
            }

        }
        //console.log(response);
    }
    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })

    }
    handleWaitToPack = async (status) => {
        let arrayPush = [];
        let response = await getListItemSelect();
        console.log(response)
        this.setState({
            isLoading: true,
            boolCheckArray: new Array(100).fill(false),
            statuss: status,
            arrItemSelect: response.data,
            dataOrderItems: [],
            dataOrderItemsFilter2: [],
        }, async () => {
            if (response && response.data.length > 0) {

                await Promise.all(
                    this.state.arrItemSelect.map(async (item, index) => {

                        let offset = 0;
                        let limit = 30;
                        let count = 0;
                        var date = new Date();

                        let created_after = date.toISOString();
                        if (this.state.value === '1') {
                            created_after = new Date(this.state.day).toISOString();

                        }
                        if (this.state.value === '2') {
                            created_after = new Date(this.state.day7).toISOString();
                        }
                        if (this.state.value === '3') {
                            created_after = new Date(this.state.day30).toISOString();
                        }
                        let data = await getListOrderID(item.Token, status, created_after, limit, offset)
                        if (data.code === 'IllegalAccessToken') {
                            notifyError('Token shop : ' + item.shopName + ' hết hạn');
                        }

                        if (data && data.data) {

                            count += data.data.count;
                            this.setState({

                                countOrder: data.data.countTotal,
                                loadOrder: count
                            })
                            //lưu vào array
                            if (data.data.orders.length != 0) {
                                data.data.orders.forEach(element => {
                                    arrayPush.push(element.order_id);
                                });
                                let response = await getOrderItems(item.Token, '[' + arrayPush.toString() + ']');
                                console.log('hello', response)

                                this.setState({
                                    dataOrderItems: this.state.dataOrderItems.concat(response.data)
                                    //dataOrderItems: { ...this.state.dataOrderItems, ...response.data },

                                })

                                //kiểm tra đã hết chưa
                                while (data.data.countTotal - count > 0) {
                                    //làm tiếp
                                    arrayPush = [];
                                    offset += limit;
                                    // acc thuận 50000200942sr7t7jmpVmxDY6HzeiReuvDbbDqgNVTjhitmWfY4umQ142f9f39jr
                                    // acc trần 50000000841dMogr8IBwVrsfh7ftjLwgToideaS3lzUjhkwKWog5z1364578cFXC
                                    data = await getListOrderID(item.Token, status, created_after, limit, offset)
                                    data.data.orders.forEach(element => {
                                        arrayPush.push(element.order_id);
                                    });
                                    response = await getOrderItems(item.Token, '[' + arrayPush.toString() + ']');
                                    this.state.dataOrderID = { ...this.state.dataOrderItems, ...response.data }
                                    await this.setState({
                                        countOrder: data.data.countTotal,
                                        // dataOrderItems: { ...this.state.dataOrderItems, ...response.data },
                                        dataOrderItems: this.state.dataOrderItems.concat(response.data)

                                    })
                                    //this.state.dataOrderItems = [...this.state.dataOrderItems, response]
                                    count += data.data.count;
                                    await this.setState({
                                        loadOrder: count,

                                    })
                                }
                            }
                            else {
                                notifyError(data.message);
                            }
                        }

                        console.log("fdsafasd", this.state.dataOrderItems)
                        this.state.dataOrderItems.map((item, index) => {
                            this.state.dataOrderItemsFilter2.push(item.order_items);

                        })
                        this.setState({
                            dataOrderItems: [],
                        })
                        console.log("fdsafasd2222222222", this.state.dataOrderItemsFilter2)
                        // this.setState({
                        //     countOrder: 0,
                        //     loadOrder: 0,
                        //     dataOrderItems: [],
                        //     // dataOrderItemsFilter: [],
                        //     // dataOrderItemsFilter2: []
                        // }, async () => {


                        // })
                    }),


                )
                await this.setState({
                    isLoading: false
                })
            }
        })










    }
    handleWaitToPackLimit2 = async (status, index) => {
        let arrayPush = [];

        let limit = 50;
        let offset = index * limit;
        let count = 0;
        var date = new Date();

        let created_after = date.toISOString();
        if (this.state.value === '1') {
            created_after = new Date(this.state.day).toISOString();

        }
        if (this.state.value === '2') {
            created_after = new Date(this.state.day7).toISOString();
        }
        if (this.state.value === '3') {
            created_after = new Date(this.state.day30).toISOString();
        }
        console.log(created_after);

        this.setState({
            boolCheckArray: new Array(100).fill(false),
            isLoading: true,
            statuss: status,
            countOrder: 0,
            loadOrder: 0,
            dataOrderItems: [],
            dataOrderItemsFilter: [],
            dataOrderItemsFilter2: []
        }, async () => {
            let data = await getListOrderID('50000000841dMogr8IBwVrsfh7ftjLwgToideaS3lzUjhkwKWog5z1364578cFXC', this.state.statuss, created_after, limit, offset)


            if (data && data.data) {
                count += data.data.count;
                this.setState({
                    countOrder: data.data.countTotal,
                    loadOrder: count
                })
                //lưu vào array
                if (data.data.orders.length != 0) {
                    data.data.orders.forEach(element => {
                        arrayPush.push(element.order_id);
                    });
                    let response = await getOrderItems('50000000841dMogr8IBwVrsfh7ftjLwgToideaS3lzUjhkwKWog5z1364578cFXC', '[' + arrayPush.toString() + ']');
                    console.log('hello', response)
                    this.setState({
                        dataOrderItems: response.data,
                        //countOrder: response.data.length,
                    })
                }
                else {
                    notifyError(data.message);
                }
            }
            console.log("fdsafasd", this.state.dataOrderItems)
            this.state.dataOrderItems.map((item, index) => {
                this.state.dataOrderItemsFilter.push(item.order_items);
            })
            this.setState({
                dataOrderItemsFilter: this.state.dataOrderItemsFilter,
                dataOrderItemsFilter2: this.state.dataOrderItemsFilter,
                isLoading: false,
            }, () => {
                console.log('đây là cần lấy ', this.state.dataOrderItemsFilter2);
                notifyWarn('Đã tải xong dữ liệu')
            })

        })




    }

    handleWaitToPackLimit = async (status) => {
        let response = await getListItemSelect();
        console.log(response)
        if (response && response.data.length > 0) {
            this.setState({
                arrItemSelect: response.data,
            }, async () => {
                // this.state.arrItems = this.state.arrItems.filter(person => person.NameItem != 'Tủ gỗ');
                console.log('danh sách sản phẩm select', this.state.arrItemSelect);
            })
        }


        let arrayPush = [];
        let offset = 0;
        let limit = 50;
        let count = 0;
        var date = new Date();

        let created_after = date.toISOString();
        if (this.state.value === '1') {
            created_after = new Date(this.state.day).toISOString();

        }
        if (this.state.value === '2') {
            created_after = new Date(this.state.day7).toISOString();
        }
        if (this.state.value === '3') {
            created_after = new Date(this.state.day30).toISOString();
        }
        console.log(created_after);

        this.setState({
            boolCheckArray: new Array(100).fill(false),
            isLoading: true,
            statuss: status,
            countOrder: 0,
            loadOrder: 0,
            dataOrderItems: [],
            dataOrderItemsFilter: [],
            dataOrderItemsFilter2: [],
            countPage: 0,
            pagesArray: [],
        }, async () => {

            let data = await getListOrderID('50000000841dMogr8IBwVrsfh7ftjLwgToideaS3lzUjhkwKWog5z1364578cFXC', status, created_after, limit, offset)


            if (data && data.data) {
                count += data.data.count;
                this.setState({
                    countPage: Math.ceil(data.data.countTotal / limit),
                    countOrder: data.data.countTotal,
                    loadOrder: count
                }, () => {

                    for (var i = 0; i < this.state.countPage; i++) {
                        let index = i;
                        this.state.pagesArray.push(index)
                    }

                    this.setState({
                        pagesArray: this.state.pagesArray
                    })
                    console.log("tổng", this.state.countOrder);
                })
                //lưu vào array
                if (data.data.orders.length != 0) {
                    data.data.orders.forEach(element => {
                        arrayPush.push(element.order_id);
                    });
                    let response = await getOrderItems('50000000841dMogr8IBwVrsfh7ftjLwgToideaS3lzUjhkwKWog5z1364578cFXC', '[' + arrayPush.toString() + ']');
                    console.log('hello', response)
                    this.setState({
                        dataOrderItems: response.data,
                        //countOrder: response.data.length,
                    })
                }
                else {
                    notifyError(data.message);
                }
            }
            console.log("fdsafasd", this.state.dataOrderItems)
            this.state.dataOrderItems.map((item, index) => {
                this.state.dataOrderItemsFilter.push(item.order_items);

            })
            this.setState({
                //textSearch: event.target.value,

                dataOrderItemsFilter: this.state.dataOrderItemsFilter,
                dataOrderItemsFilter2: this.state.dataOrderItemsFilter,
                isLoading: false,
                // (
                //     ({ name, shop_id }) =>
                //         name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                //         shop_id.toLowerCase().includes(event.target.value.toLowerCase())
                // ),
                // arrOverviewFilter: [...this.state.arrOverview].sort((a, b) => a.id - b.id)
            }, () => {

                console.log('đây là cần lấy ', this.state.isLoading);
                notifyWarn('Đã tải xong dữ liệu')
            })

        })




    }
    onSelect1 = (event) => {
        const selectedIndex = event.target.options.selectedIndex;
        let sele = event.target.options[selectedIndex].getAttribute('value');
        let nameshop = event.target.options[selectedIndex].text;
        this.setState({
            shipment_provider: nameshop
        }, () => {
            console.log('hello', this.state.shipment_provider);
        });
        this.setState({
            value2: sele,
            date2: nameshop,
        }, () => {
            console.log('xxoxoxnsos', this.state.value2);

        })
    }
    onSelect = (event) => {
        const selectedIndex = event.target.options.selectedIndex;
        let sele = event.target.options[selectedIndex].getAttribute('value');
        let nameshop = event.target.options[selectedIndex].text;
        switch (sele) {
            case 0:
                this.setState({
                    selectDate: this.state.day
                }, () => {
                    console.log('hello', this.state.selectDate);
                });
                break;
            case 1:
                this.setState({
                    selectDate: this.state.day7
                });
                break;
            case 2:
                this.setState({
                    selectDate: this.state.day30
                });
                break;
        }

        this.setState({
            value: sele,
            date: nameshop,
        }, () => {
            console.log(this.state.value);

        })
    }

    handleOnchangeSearch = (event) => {
        if (event.target.value === "") {
            this.setState({
                dataOrderItemsFilter2: this.state.dataOrderItemsFilter
            }, () => {
                console.log("đã changer 2", this.state.dataOrderItemsFilter2)
            })
        }
        else {
            this.setState({
                //textSearch: event.target.value,
                // dataOrderItemsFilter2: this.state.dataOrderItemsFilter.filter(
                //     ({ name, order_id, shop_id }) =>
                //         name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                //         order_id.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
                //         shop_id.toLowerCase().includes(event.target.value.toLowerCase())
                // )
                dataOrderItemsFilter2: this.state.dataOrderItemsFilter.find(
                    e => e[0].order_id.toString().toLowerCase().includes(event.target.value.toLowerCase()) === true
                )

                // ({ name, order_id, shop_id }) =>
                // name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                // order_id.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
                // shop_id.toLowerCase().includes(event.target.value.toLowerCase())
                // dataOrderItemsFilter2: this.state.dataOrderItemsFilter.map((item, index) => {
                //     item.filter(
                //         ({ name, order_id, shop_id }) =>
                //             name.toLowerCase().includes(event.target.value.toLowerCase()) ||
                //             order_id.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
                //             shop_id.toLowerCase().includes(event.target.value.toLowerCase())
                //     )
                // })



                // arrOverviewFilter: [...this.state.arrOverview].sort((a, b) => a.id - b.id)
            }, () => {
                console.log("đã changer", this.state.dataOrderItemsFilter2)
            })
        }


    }

    handleChangeCheckAll = (event) => {
        this.setState({
            boolCheckArray: new Array(this.state.dataOrderItemsFilter2.length).fill(event.target.checked),
        }, () => {
            console.log('kiểm tra checkbox', this.state.boolCheckArray)
        })

    }
    handleOnchangeToken = (event) => {
        this.setState({
            tokenValue: event.target.value
        })
    }
    handleSetPacked = async () => {
        if (this.state.value2 === '-1') {
            notifyWarn('Vui lòng chọn nhà cung cấp vận chuyển')
            return;
        }
        if (this.state.statuss !== 'pending') {
            notifyError('Không phải phần chờ xử lí vui lòng kiểm tra lại')
            return;
        }
        let dataTemp = []

        let indices = this.state.boolCheckArray.flatMap((bool, index) => bool ? index : [])

        indices.map((item) => {
            dataTemp.push(this.state.dataOrderItemsFilter2[item][0] ? this.state.dataOrderItemsFilter2[item][0].order_item_id : this.state.dataOrderItemsFilter2[item].order_item_id);

            //set trạng thái đogns gói

        })
        if (dataTemp.length === 0) {
            notifyWarn('Không có đơn hàng nào được chọn');
            return;
        }
        let response = await getListItemSelect();
        console.log(response)
        let data = null;
        if (response && response.data.length > 0) {
            this.setState({
                arrItemSelect: response.data,
            }, async () => {

                this.state.arrItemSelect.map(async (item, index) => {
                    data = await setPack(item.Token, "[" + dataTemp.toString() + "]", this.state.date2)
                })
                notifySuccess('Hoàn thành vui lòng chờ')
                await this.sleep(2000);
                this.handleWaitToPack(this.state.statuss)
                console.log('d', data)
            })

        }


        // if (data.code !== "0") {
        //     notifyError('Lỗi :' + data.message)
        // }
        // else {
        //     notifySuccess('Hoàn thành vui lòng chờ')
        //     await this.sleep(2000);
        //     this.handleWaitToPackLimit(this.state.statuss)
        //     console.log('d', data)
        // }


    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    handleReadyToShip = async () => {
        if (this.state.value2 === '-1') {
            notifyWarn('Vui lòng chọn nhà cung cấp vận chuyển')
            return;
        }
        if (this.state.statuss !== 'packed') {
            notifyError('Không phải phần chờ đóng gói vui lòng kiểm tra lại')
            return;
        }

        let dataTemp = []
        let dataTemp_tracking_number = []
        let indices = this.state.boolCheckArray.flatMap((bool, index) => bool ? index : [])
        indices.map((item) => {
            dataTemp.push(this.state.dataOrderItemsFilter2[item][0] ? this.state.dataOrderItemsFilter2[item][0].order_item_id : this.state.dataOrderItemsFilter2[item].order_item_id);
            dataTemp_tracking_number.push(this.state.dataOrderItemsFilter2[item][0] ? this.state.dataOrderItemsFilter2[item][0].tracking_code : this.state.dataOrderItemsFilter2[item].tracking_code);
            //set trạng thái đogns gói

        })
        if (dataTemp.length === 0) {
            notifyWarn('Không có đơn hàng nào được chọn');
            return;
        }
        let response = await getListItemSelect();
        console.log(response)
        let data = null;
        if (response && response.data.length > 0) {
            this.setState({
                arrItemSelect: response.data,
            }, async () => {
                await Promise.all(
                    dataTemp.map(async (item, index) => {
                        await Promise.all(
                            this.state.arrItemSelect.map(async (itemToken, index2) => {
                                data = await setReadyToShip(itemToken.Token, "[" + item + "]", this.state.date2, dataTemp_tracking_number[index])
                            })
                        )


                    })
                )
                notifySuccess('Hoàn thành vui lòng chờ')
                await this.sleep(5000);
                this.handleWaitToPack(this.state.statuss)
            })
        }



    }
    handleSelecter = () => {
        this.getallShop('All');
        this.setState({
            isOpenModalShowListItem: true
        })
    }
    render() {



        let indexTble = 0;

        let id_buyer = '';
        let arrayID = [];
        return (
            <div className="users-container">
                {
                    this.state.isOpenModalShowListItem &&
                    <ShowListItem
                        toggleShopModal={this.toggleShopModalListItem}
                        isOpen={this.state.isOpenModalShowListItem}
                        arrItems={this.state.arrOptionShop}
                        //anyBoxesChecked={this.state.anyBoxesChecked}
                        getallShop={this.getallShop}
                    />
                }
                <div className='title text-center'>Quản lí lazada</div>
                <div class='row mt-2'>
                    <div class='col-sm-2'>
                        <div className='mx-2'>
                            <button className='btn btn-primary px-4'
                                onClick={() => { this.handleSelecter() }}
                            ><i class="fas fa-info-circle"></i>  Chọn shop</button>

                        </div>

                    </div>
                    <div class='col-sm-3'>
                        <div class="form-group has-search">

                            <span class="far fa-calendar-alt form-control-feedback"></span>
                            <select value={this.state.value} onChange={(event) => { this.onSelect(event) }} style={{ width: '100%' }} class="form-control" aria-label="Default select example">
                                <option value="-1" selected>Chọn mốc thời gian</option>
                                <option value="1">Hôm qua | {this.state.day}</option>
                                <option value="2">7 Ngày trước | {this.state.day7} {'->'} {this.state.day}</option>
                                <option value="3">30 Ngày trước  | {this.state.day30} {'->'} {this.state.day}</option>

                            </select>
                        </div>

                    </div>
                    <div class='col-sm-3'>
                        <div class="form-group has-search">
                            <span class="fa fa-search form-control-feedback"></span>
                            <input
                                onChange={(event) => { this.handleOnchangeSearch(event) }}
                                style={{ width: '80%' }}
                                type="text" class="form-control"
                                placeholder="Search" />
                        </div>

                    </div>
                    <div class='col-sm-3'>
                        <div class="form-group has-search">

                            <span class="far fa-calendar-alt form-control-feedback"></span>
                            <select value={this.state.value2} onChange={(event) => { this.onSelect1(event) }} style={{ width: '100%' }} class="form-control" aria-label="Default select example">
                                <option value="-1" selected>Nhà cung cấp vận chuyển</option>
                                <option value="1">GHN</option>
                                <option value="2">LEX VN</option>
                                <option value="3">Ship60</option>
                                <option value="4">SOFP_VN</option>
                                <option value="5">NinjavanVN</option>
                                <option value="6">B2B VN</option>
                                <option value="7">GRAB</option>
                                <option value="8">Logisthai VN</option>
                                <option value="9">I Logic VN</option>
                                <option value="10">J&T VN</option>
                                <option value="11">Vinacapital</option>
                                <option value="12">Cainiao</option>
                                <option value="13">PickmeeVN</option>
                                <option value="14">LGS</option>




                            </select>
                        </div>
                    </div>
                </div>
                <div className='row mt-2'>
                    <div class='col-sm-10'>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-primary px-2'
                                    onClick={() => this.handleWaitToPack(' ')}
                                ><i className="far fa-check-circle"></i> Tất cả</button>
                            </div>
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-primary px-2'
                                    onClick={() => this.handleWaitToPack('unpaid')}
                                ><i className="far fa-check-circle"></i> Chờ thanh toán</button>
                            </div>
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-primary px-2'
                                    onClick={() => this.handleWaitToPack('pending')}
                                ><i className="far fa-check-circle"></i> Chờ xử lí</button>
                            </div>
                        </div>

                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-primary px-2'
                                    onClick={() => this.handleWaitToPack('packed')}
                                ><i className="far fa-check-circle"></i> Chờ đóng gói</button>
                            </div>
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-primary px-2'
                                    onClick={() => this.handleWaitToPack('ready_to_ship')}
                                ><i className="far fa-check-circle"></i> Chờ bàn giao</button>
                            </div>
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-primary px-2'
                                    onClick={() => this.handleWaitToPack('shipped')}
                                ><i className="far fa-check-circle"></i> Đang vận chuyển</button>
                            </div>
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-primary px-2'
                                    onClick={() => this.handleWaitToPack('delivered')}
                                ><i className="far fa-check-circle"></i> Đã giao hàng</button>
                            </div>
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-primary px-2'
                                    onClick={() => this.handleWaitToPack('failed')}
                                ><i className="far fa-check-circle"></i> Giao hàng thất bại</button>
                            </div>
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-primary px-2'
                                    onClick={() => this.handleWaitToPack('canceled')}
                                ><i className="far fa-check-circle"></i> Hủy đơn hàng</button>
                            </div>
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <div className='text-right status'>Tổng số đơn : {this.state.dataOrderItemsFilter2.length}</div>
                            </div>
                        </div>

                    </div>
                </div>


                <div className='row mt-2'>
                    <div class='col-sm-10'>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-warning px-2'
                                    onClick={() => this.handleSetPacked()}
                                ><i className="fas fa-cube"></i> Đóng gói</button>
                            </div>
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <button style={{ color: 'white' }} className='btn btn-success px-2'
                                    onClick={() => this.handleReadyToShip()}
                                ><i className="fas fa-truck"></i>  Sẵn sàng giao</button>
                            </div>
                        </div>
                        <div className='btn-group'>
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button btn btn-success px-2"
                                table="customers"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="Download as XLS"
                            />
                        </div>
                        <div class="btn-group">
                            <div className='ml-0'>
                                <input onChange={(event) => { this.handleChangeCheckAll(event) }} class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                                <label class="form-check-label" for="defaultCheck1">Chọn tất cả</label>
                            </div>

                        </div>
                        {/* <div class="btn-group has-search">
                            <div className='ml-0'>
                                <span class="fas fa-user-alt form-control-feedback"></span>
                                <input
                                    onChange={(event) => { this.handleOnchangeToken(event) }}

                                    style={{ width: '500px' }}
                                    type="text" class="form-control"
                                    placeholder="Nhập token" />
                            </div>
                        </div> */}


                    </div>

                </div>
                {/* <CSVLink data={this.state.dataOrderItemsFilter2} filename={'fileName'}>Export</CSVLink> */}



                <div className='user-table mt-3 mx-1'>

                    <table id="customers">
                        <tr>
                            <th>Select</th>
                            <th>STT</th>
                            <th>ID đặt hàng</th>
                            <th>Nhà cung cấp</th>
                            <th>Số lượng đơn</th>
                            <th>Tình trạng</th>
                            <th>Ảnh</th>
                            <th>Sản phẩm</th>
                            <th>Thông tin đơn hàng</th>
                            <th>Giá</th>
                            <th>Tên shop</th>
                        </tr>
                        {

                            this.state.dataOrderItemsFilter2 && this.state.dataOrderItemsFilter2.map((item, index) => {
                                arrayID.push(index);
                                let name = '';
                                if (item.length > 0) {
                                    item.map((item2, index2) => {
                                        name += '- ' + item2.name + '\n'
                                    })
                                }
                                return (
                                    <tr>
                                        <td> <div class="custom-control custom-checkbox">

                                            <input onChange={() => { this.handleChange(arrayID[index]) }} type="checkbox" class="custom-control-input" id="customCheck1 "
                                                checked={this.state.boolCheckArray[arrayID[index]] ? "checker" : ""} />
                                        </div></td>
                                        <td>{index}</td>
                                        <td>{item && item.order_id ? item.order_id : item[0].order_id}</td>
                                        <td>{item && item.shipment_provider || item.shipment_provider == "" ? item.shipment_provider : item[0].shipment_provider}</td>
                                        <td>{item && item.status ? 1 : item.length}</td>
                                        <td>{item && item.status ? item.status : item[0].status}</td>
                                        <td><img width={50} height={50} src={item.product_main_image ? item.product_main_image : item[0].product_main_image} /></td>
                                        <td>{
                                            name
                                        }</td>
                                        <td>{item && item.variation || item.variation == "" ? item.variation : item[0].variation}</td>
                                        <td>{item && item.paid_price || item.paid_price == 0 ? item.paid_price : item[0].paid_price + (item && item.shipping_amount ? item.shipping_amount : item[0].shipping_amount) - (item && item.shipping_fee_discount_seller ? item.shipping_fee_discount_seller : item[0].shipping_fee_discount_seller)}</td>
                                        <td>{item && item.shop_id ? item.shop_id : item[0].shop_id}</td>
                                    </tr>

                                )

                            })
                        }
                    </table>
                    <div class='col-sm-1'>
                        <div style={{ display: this.state.isLoading ? 'block' : 'none' }} class="spinner-border text-primary"></div>
                    </div>
                    <nav aria-label="..." className='mt-10'>
                        <ul class="pagination mt-10">
                            {/* {pagesArray} */}
                            {
                                this.state.pagesArray.length > 0 && this.state.pagesArray.map((item, index) => {
                                    return (
                                        <li key={index} class={"page-item " + (item === this.state.activeLink ? 'active' : '')}>
                                            <a onClick={() => { this.handleOnClickActive(item) }} class="page-link" href="#">{item} <span class="sr-only">(current)</span></a>
                                        </li >
                                    )

                                })
                            }


                        </ul>
                    </nav>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
