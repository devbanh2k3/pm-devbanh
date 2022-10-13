import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getListItem, getListItemSelect } from '../../services/userServices';
import { getOverView, getCookie, getReportAds, getBusinessEveryday } from '../../services/overviewService';
import ModelUser from './modelUser';
import { emitter } from '../../utils/emitter';
import _ from 'lodash';
import { notifyError, notifySuccess, notifyWarn, } from './notify';
import ShowReport from './modalShowReport';
import ShowBusiess from './modalShowBusiness';
import ShowListItem from './modalItemChecker';
import { isConstructorDeclaration } from 'typescript';
const moment = require('moment');

class RegisterPackageGroupOrAcc extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            date: '',
            dateStart: '',
            dateEnd: '',
            day7: '',
            day30: '',
            day: '',
            textSearch: '',
            arrItems: [],
            arrItemSelect: {},
            arrOverview: [],
            arrOverviewFilter: [],
            rateRoi: 0,
            countPage: [],
            countSku: [],
            isOpenModalShowReport: false,
            isOpenModalShowBusiness: false,
            isOpenModalShowListItem: false,
            dataAdsShow: [],
            dataBusinessShow: [],
            dataOverView: [],
            idItempro: '',
            idShoppro: '',

            dataTotal: {},
            isLoading: false,
            isLoadingReport: false,
            isLoadingBusiness: false,

            anyBoxesChecked: [],

            sortUpItemPay: false,
            sortUpSpen: false,
            sortUppayAmount: false,

        }


    }
    async componentDidMount() {
        this.setDate();
        await this.getAllItem('All');
        this.setState({
            anyBoxesChecked: new Array(this.state.arrItems.length).fill(false)
        }, () => {
            console.log(this.state.anyBoxesChecked)
        })
    }
    formatter = new Intl.NumberFormat('vn', {
        style: 'currency',
        currency: 'VND',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    doPanination = async (idItem, idShop, pageNo) => {

    }
    handleShowListItem = () => {
        this.setState({
            isOpenModalShowListItem: true
        })
    }
    handleOpenShowReport = async (idItem, idShop) => {
        this.setState({
            isLoadingReport: false,
            isOpenModalShowReport: true,
            idItempro: idItem,
            idShoppro: idShop,
            dataAdsShow: [],
            countPage: 0
        }, async () => {

            console.log('click handle show report', idItem)
            let response2 = await getListItem(idItem);
            console.log('click handle show report sáddfasfsafsdf', response2.data.IdAds)
            if (response2 && response2.data.IdAds !== '') {
                console.log('get item 2', response2)
                let response = await getCookie(idShop)
                console.log('cái cần lấy', response);
                let dataPost = {};
                if (response.response.success) {
                    dataPost.adgroupId = response2.data.IdAds;
                    dataPost.Cookie = response.response.cookie;
                    dataPost.proxy = response.response.proxy;
                    dataPost.dateEnd = this.state.day;
                    dataPost.pageNo = '1';
                    if (this.state.value === '1') {
                        dataPost.dateStart = this.state.day;
                        dataPost.dateType = 'recent1';
                    }
                    if (this.state.value === '2') {
                        dataPost.dateStart = this.state.day7;
                        dataPost.dateType = 'recent7';
                    }
                    if (this.state.value === '3') {
                        dataPost.dateStart = this.state.day30;
                        dataPost.dateType = 'recent30';
                    }
                    console.log('datapost ads', dataPost);

                    let dataAds = await getReportAds(dataPost);
                    console.log('dataAds', dataAds)
                    if (dataAds && dataAds.success) {

                        let countRequest = 1;
                        if (dataAds.total > 20) {
                            countRequest = Math.round(dataAds.total / 20) + 1;

                        }

                        this.setState({
                            countPage: countRequest,
                            dataAdsShow: dataAds.result
                        }, () => {
                            console.log('data ads', dataAds);

                            console.log('tổng số trang report', this.state.dataAdsShow);
                        })
                    }

                }
            }
            else {
                notifyWarn('Sản phẩm không có id ads')
            }
            this.setState({
                isLoadingReport: true,
            })
        })

    }


    showInfoSystem = () => {
        this.setState({
            isLoading: true
        })
        console.log(this.state.anyBoxesChecked)
    }
    toggleShopModalReport = () => {
        this.setState({
            isOpenModalShowReport: !this.state.isOpenModalShowReport,
        })

    }
    handleOpenShowBusiness = async (idItem, idShop, indexSku) => {
        this.setState({
            isOpenModalShowBusiness: true,
            isLoadingBusiness: false,
            idItempro: idItem,
            idShoppro: idShop,
            dataBusinessShow: []
        }, async () => {
            let response2 = await getListItem(idItem);
            console.log('Lấy danh sách item', response2)
            if (response2) {
                let response = await getCookie(idShop)
                console.log('lấy cookie', response)
                let dataPost = {};
                if (response.response.success) {
                    if (!response2.data.Sku) {
                        return notifyWarn('Không có sku trong sản phẩm')
                    }
                    let arrSku = response2.data.Sku.split('|');
                    this.setState({
                        countSku: arrSku.length
                    })

                    dataPost.Sku = arrSku[indexSku];
                    dataPost.cookie = response.response.cookie;
                    dataPost.proxy = response.response.proxy;
                    dataPost.endDate = this.state.day;
                    if (this.state.value === '1') {
                        dataPost.startDate = this.state.day;
                    }
                    if (this.state.value === '2') {
                        dataPost.startDate = this.state.day7;
                    }
                    if (this.state.value === '3') {
                        dataPost.startDate = this.state.day30;
                    }
                    console.log('datapost business', dataPost);

                    let dataBusiness = await getBusinessEveryday(dataPost);
                    console.log('data get business', dataBusiness.data[0]);
                    if (dataBusiness) {
                        this.setState({
                            dataBusinessShow: dataBusiness.data
                        })
                    }
                }
            }
            this.setState({
                isLoadingBusiness: true,
            })

        })



    }

    handleOpenShowBusinessTotal = async (idItem, idShop, indexSku) => {
        this.setState({
            isOpenModalShowBusiness: true,
            isLoadingBusiness: false,
            idItempro: idItem,
            idShoppro: idShop,
            dataBusinessShow: [],
            dataTotal: []
        }, async () => {
            //tạo array ngày 
            let dataPost = {};
            dataPost.endDate = this.state.day;
            if (this.state.value === '1') {
                dataPost.startDate = this.state.day;
            }
            if (this.state.value === '2') {
                dataPost.startDate = this.state.day7;
            }
            if (this.state.value === '3') {
                dataPost.startDate = this.state.day30;
            }
            var start = new Date(dataPost.startDate);
            var end = new Date(this.state.day);
            var loop = new Date(start);
            let arrDay = [];
            while (loop <= end) {
                const result = moment(loop).format('YYYY-MM-DD');
                arrDay.push(result)
                loop.setDate(loop.getDate() + 1);
            }

            let saveEveryday = [];
            let response2 = await getListItem(idItem);
            if (response2) {
                let response = await getCookie(idShop)

                if (response.response.success) {
                    if (!response2.data.Sku) {
                        return notifyWarn('Không có sku trong sản phẩm')
                    }
                    let arrSku = response2.data.Sku.split('|');
                    this.setState({
                        countSku: arrSku.length
                    })
                    for (let index = 0; index < arrSku.length; index++) {
                        dataPost.Sku = arrSku[index];
                        dataPost.cookie = response.response.cookie;
                        dataPost.proxy = response.response.proxy;
                        let dataBusiness = await getBusinessEveryday(dataPost);
                        if (dataBusiness) {
                            saveEveryday[index] = dataBusiness;
                            console.log('dataBusiness', saveEveryday);
                            this.setState({
                                dataBusinessShow: []
                            })
                        }


                    }
                    for (let i = 0; i < arrDay.length; ++i) {
                        this.state.dataTotal[i] = {
                            sKUVisitor: 0,
                            payAmount: 0,
                            paidItemAmount: 0,
                            paidRate: 0,
                            addToCartQuantity: 0
                        };
                    }
                    for (let index = 0; index < saveEveryday.length; index++) {
                        await saveEveryday[index].data.map((item, indexx) => {
                            this.state.dataTotal[indexx].sKUVisitor += item ? item.sKUVisitor.value : 0;
                            this.state.dataTotal[indexx].payAmount += item ? item.payAmount.value : 0;
                            this.state.dataTotal[indexx].addToCartQuantity += item ? item.addToCartQuantity.value : 0;
                            this.state.dataTotal[indexx].paidRate += item ? item.paidRate.value : 0;
                            this.state.dataTotal[indexx].paidItemAmount += item ? item.paidItemAmount.value : 0;
                            console.log(this.state.dataTotal[index])
                        })
                    }

                    this.setState({
                        dataTotal: this.state.dataTotal
                    })

                }
            }
            this.setState({
                isLoadingBusiness: true,
            })

        })



    }
    toggleShopModalBusiness = () => {
        this.setState({
            isOpenModalShowBusiness: !this.state.isOpenModalShowBusiness,
        })

    }
    toggleShopModalListItem = () => {
        this.setState({
            isOpenModalShowListItem: !this.state.isOpenModalShowListItem,
        })

    }
    getAllItem = async (id) => {
        let response = await getListItem(id);
        if (response) {
            this.setState({
                arrItems: response.data,
            }, () => {
                // this.state.arrItems = this.state.arrItems.filter(person => person.NameItem != 'Tủ gỗ');
                console.log('danh sách sản phẩm', this.state.arrItems);

            })
        }

    }
    getAllItemSelec = async () => {
        let response = await getListItemSelect();
        if (response) {
            this.setState({
                arrItemSelect: response.data,
            }, () => {
                // this.state.arrItems = this.state.arrItems.filter(person => person.NameItem != 'Tủ gỗ');
                console.log('danh sách sản phẩm select', this.state.arrItemSelect);

            })
        }

    }
    OverView = async () => {
        let dataPost = {};
        let response = await getListItemSelect();
        console.log(response)
        if (response && response.data.length > 0) {
            this.setState({
                arrItemSelect: response.data,
            }, async () => {
                // this.state.arrItems = this.state.arrItems.filter(person => person.NameItem != 'Tủ gỗ');
                console.log('danh sách sản phẩm select', this.state.arrItemSelect);
                let arrItemsTemp = this.state.arrItemSelect;
                //lấy cookie từ shop

                console.log(arrItemsTemp.length)
                if (arrItemsTemp && arrItemsTemp.length > 0) {
                    await arrItemsTemp.map(async (item, index) => {
                        let response = await getCookie(item.ItemID)
                        console.log(response);
                        if (response && response.response.success) {
                            console.log(response);
                            dataPost.idShop = item.ItemID;
                            dataPost.id = item.id;
                            dataPost.rateRoi = this.state.rateRoi;
                            dataPost.dateEnd = this.state.day;
                            dataPost.cookie = response.response.cookie;
                            dataPost.proxy = response.response.proxy;
                            if (this.state.value === '1') {
                                dataPost.dateStart = this.state.day;
                                dataPost.dateType = 'recent1';
                            }
                            if (this.state.value === '2') {
                                dataPost.dateStart = this.state.day7;
                                dataPost.dateType = 'recent7';
                            }
                            if (this.state.value === '3') {
                                dataPost.dateStart = this.state.day30;
                                dataPost.dateType = 'recent30';
                            }
                            let dataResponse = await getOverView(dataPost);
                            if (dataResponse && dataResponse.data && dataResponse.data.success) {
                                let cutren = _.clone(this.state.arrOverview);
                                cutren.push(dataResponse.data);
                                this.setState({
                                    arrOverview: cutren,
                                    arrOverviewFilter: cutren
                                }, () => {
                                    console.log('đây là in', this.state.arrOverview);
                                })

                            }
                            else {
                                console.log('đây là errr', dataResponse);
                                notifyError(dataResponse.data.msg);
                            }

                        }
                    })


                }
            })

        }

        else {
            notifyWarn('Không sản phẩm nào được chọn')
        }

    }



    setDate = () => {
        var date = new Date();
        var oneDay = date.setDate(date.getDate() - 1);
        date = new Date();
        var SevenDay = date.setDate(date.getDate() - 7);
        date = new Date();
        var bamuoiDay = date.setDate(date.getDate() - 30);

        const result1 = moment(SevenDay).format('YYYY-MM-DD');
        const result2 = moment(bamuoiDay).format('YYYY-MM-DD');
        const result3 = moment(oneDay).format('YYYY-MM-DD');
        this.setState({
            day7: result1,
            day30: result2,
            day: result3
        }, () => {
            console.log(this.state.day7, this.state.day30, this.state.day)
        })
    }
    onSelect = (event) => {
        const selectedIndex = event.target.options.selectedIndex;
        let sele = event.target.options[selectedIndex].getAttribute('value');
        let nameshop = event.target.options[selectedIndex].text;

        this.setState({
            value: sele,
            date: nameshop
        }, () => {
            console.log(this.state);
        })
    }
    handleChangeRoi = (event) => {
        this.setState({
            rateRoi: event.target.value
        }, () => {
            //console.log(this.state.rateRoi)
        })
    }
    handleGetOverView = async () => {
        console.log(this.state.value)
        if (!this.state.value) {
            return notifyWarn('Vui lòng chọn mốc thời gian!')
        }
        if (!this.state.rateRoi) {
            return notifyWarn('Vui lòng điền đánh giá roi!')
        }
        this.setState({
            arrOverview: [],
            isLoading: true,
            arrOverviewFilter: []
        }, async () => {

            console.log(this.state.isLoading);
            await this.OverView();
            this.setState({
                isLoading: false
            })
        })


    }
    changProp = (data) => {
        this.setState({
            dataAdsShow: data,
        }, () => {

        })
    }
    handleOnchangeSearch = (event) => {
        // if (event.target.value === '') {
        //     this.setState({
        //         arrOverviewFilter: this.state.arrOverview
        //     })
        // }
        // else {

        // }
        console.log(event.target.value)
        this.setState({
            //textSearch: event.target.value,

            arrOverviewFilter: this.state.arrOverview.filter(
                ({ NameItem, shopName }) =>
                    NameItem.toLowerCase().includes(event.target.value.toLowerCase()) ||
                    shopName.toLowerCase().includes(event.target.value.toLowerCase())
            ),
            // arrOverviewFilter: [...this.state.arrOverview].sort((a, b) => a.id - b.id)
        })

    }
    handleClickSort = (event) => {
        if (event) {
            this.setState({
                //textSearch: event.target.value,
                arrOverviewFilter: this.state.arrOverview.sort((a, b) => a.paidItemAmount - b.paidItemAmount),
                sortUpItemPay: !event
            })
        }
        else {
            this.setState({
                //textSearch: event.target.value,
                arrOverviewFilter: this.state.arrOverview.sort((a, b) => b.paidItemAmount - a.paidItemAmount),
                sortUpItemPay: !event
            })
        }

        console.log(this.state.arrOverviewFilter)
    }
    handleClickSortSpen = (event) => {
        if (event) {
            this.setState({
                //textSearch: event.target.value,
                arrOverviewFilter: this.state.arrOverview.sort((a, b) => a.countSpen - b.countSpen),
                sortUpSpen: !event
            })
        }
        else {
            this.setState({
                //textSearch: event.target.value,
                arrOverviewFilter: this.state.arrOverview.sort((a, b) => b.countSpen - a.countSpen),
                sortUpSpen: !event
            })
        }


    }
    handleClickSortDoanhthu = (event) => {
        if (event) {
            this.setState({
                //textSearch: event.target.value,
                arrOverviewFilter: this.state.arrOverview.sort((a, b) => a.payAmount - b.payAmount),
                sortUppayAmount: !event
            })
        }
        else {
            this.setState({
                //textSearch: event.target.value,
                arrOverviewFilter: this.state.arrOverview.sort((a, b) => b.payAmount - a.payAmount),
                sortUppayAmount: !event
            })
        }


    }
    render() {
        let arr = this.state.arrOverviewFilter;
        return (
            <div className="users-container">
                {this.state.isOpenModalShowReport &&
                    <ShowReport
                        isLoadingReport={this.state.isLoadingReport}
                        value={this.state.value}
                        dateStart={this.state.dateStart}
                        dateEnd={this.state.dateEnd}
                        day7={this.state.day7}
                        day30={this.state.day30}
                        day={this.state.day}
                        isOpen={this.state.isOpenModalShowReport}
                        countPage={this.state.countPage}
                        dataAdsShow={this.state.dataAdsShow}
                        idItempro={this.state.idItempro}
                        idShoppro={this.state.idShoppro}
                        toggleShopModal={this.toggleShopModalReport}
                        doPanination={this.doPanination}
                        changProp={this.changProp}
                    />
                }
                {
                    this.state.isOpenModalShowBusiness &&
                    <ShowBusiess
                        dataTotal={this.state.dataTotal}
                        countSku={this.state.countSku}
                        isLoadingBusiness={this.state.isLoadingBusiness}
                        isOpen={this.state.isOpenModalShowBusiness}
                        dataBusiness={this.state.dataBusinessShow}
                        dateStart={this.state.dateStart}
                        value={this.state.value}
                        dateEnd={this.state.dateEnd}
                        day7={this.state.day7}
                        day30={this.state.day30}
                        day={this.state.day}
                        idItempro={this.state.idItempro}
                        idShoppro={this.state.idShoppro}
                        toggleShopModal={this.toggleShopModalBusiness}
                        handleOpenShowBusiness={this.handleOpenShowBusiness}
                    />
                }
                {
                    this.state.isOpenModalShowListItem && <ShowListItem
                        toggleShopModal={this.toggleShopModalListItem}
                        isOpen={this.state.isOpenModalShowListItem}
                        arrItems={this.state.arrItems}
                        anyBoxesChecked={this.state.anyBoxesChecked}
                        getAllItem={this.getAllItem}
                    />
                }

                <div className='title text-center'>Thông tin tổng quan</div>

                <div class='row mt-4'>
                    <div class='col-sm-2'>
                        <div className='mx-2'>
                            <button className='btn btn-primary px-4'
                                onClick={() => { this.showInfoSystem() }}
                            ><i class="fas fa-info-circle"></i>  Xem thông tin hệ thống</button>

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
                    <div class='col-sm-2'>
                        <div class="form-group has-search">
                            <span class="fas fa-chart-line form-control-feedback"></span>
                            <input onChange={(event) => { this.handleChangeRoi(event) }} style={{ width: '100%' }} type="text" class="form-control" placeholder="Đánh giá roi" />
                        </div>
                    </div>
                    <div class='col-sm-2'>
                        <div class="form-group has-search">
                            <span class="fa fa-search form-control-feedback"></span>
                            <input
                                onChange={(event) => { this.handleOnchangeSearch(event) }}
                                style={{ width: '80%' }}
                                type="text" class="form-control"
                                placeholder="Search" />
                        </div>
                    </div>
                    <div class='col-sm-1'>
                        <div className='ml-0'>

                            <button className='btn btn-success px-3'
                                onClick={() => this.handleGetOverView()}
                            ><i className="fas fa-play"></i> lấy dữ liệu</button>
                        </div>


                    </div>
                    <div class='col-sm-1'>
                        <div className='ml-0'>

                            <button style={{ color: 'white' }} className='btn btn-info px-2'
                                onClick={() => this.handleShowListItem()}
                            ><i className="far fa-check-circle"></i> Chọn sản phẩm</button>
                        </div>


                    </div>
                    <div class='col-sm-1'>
                        <div style={{ display: this.state.isLoading ? 'block' : 'none' }} class="spinner-grow text-success"></div>
                    </div>
                </div>

                <div className='user-table mt-3 mx-1'>
                    <table id="customers">
                        <tr>
                            <th>STT</th>
                            <th>Tên Sản Phẩm</th>
                            <th>Tên Shop</th>
                            <th onClick={() => { this.handleClickSort(this.state.sortUpItemPay) }}>Số Sản Phẩm Bán Được</th>
                            <th onClick={() => { this.handleClickSortSpen(this.state.sortUpSpen) }}>Chi Phí Quảng Cáo</th>
                            <th onClick={() => { this.handleClickSortDoanhthu(this.state.sortUppayAmount) }}>Doanh Thu</th>
                            <th>ROI</th>
                            <th>Nhận xét</th>
                            <th>Ghi Chú</th>
                            <th>Action</th>
                        </tr>
                        {arr && arr.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index}</td>
                                    <td>{item.NameItem}</td>
                                    <td>{item.shopName}</td>
                                    <td>{item.paidItemAmount}</td>
                                    <td>{this.formatter.format(item.countSpen)}</td>
                                    <td>{this.formatter.format(item.payAmount)}</td>
                                    <td>{item.Roi}</td>
                                    <td>{item.comment === 'good' ? <i style={{ color: 'green', margin: '0 40%' }} class="fas fa-check"></i> : <i style={{ color: 'red', margin: '0 40%' }} class="fas fa-times"></i>} </td>
                                    <td></td>
                                    <td>
                                        <button onClick={() => { this.handleOpenShowReport(item.idItem, item.idShop) }} className='btn-show-report'><i className="far fa-address-book"></i></button>
                                        <button onClick={() => { this.handleOpenShowBusinessTotal(item.idItem, item.idShop, 0) }} className='btn-show-business'><i className="far fa-bookmark"></i></button>
                                        {/* <button className='btn-edit'><i className='fas fa-pencil-alt'></i></button> */}
                                        <button className='btn-edit'><i className='fas fa-pencil-alt'></i></button>

                                    </td>
                                </tr>
                            )
                        })
                        }
                    </table>
                </div>
            </div >
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPackageGroupOrAcc);
