import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createNewShop, getListShop } from '../../services/ShopServices';
import { emitter } from '../../utils/emitter';
import Pagination from '@material-ui/lab/Pagination';
import { getListItem } from '../../services/userServices';
import { getOverView, getCookie, getReportAds } from '../../services/overviewService';

import { notifyError, notifySuccess, notifyWarn, } from './notify'
class modalShowReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            classActive: '',
            activeLink: 1,
        }
    }

    componentDidMount() {


    }
    formatter = new Intl.NumberFormat('vn', {
        style: 'currency',
        currency: 'VND',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    toggle = () => {
        this.props.toggleShopModal();

    }
    handleOnClickActive = (id) => {
        this.props.changProp('');
        this.setState({
            activeLink: id
        }, async () => {
            console.log('đã chạy')
            //     //gọi hàm lấy report
            console.log('click handle show report', this.props.idItempro)
            let response2 = await getListItem(this.props.idItempro);

            if (response2) {
                console.log('get item 2', response2)

                let response = await getCookie(this.props.idShoppro)
                console.log(response);
                let dataPost = {};
                if (response.response.success) {
                    dataPost.adgroupId = response2.data.IdAds;
                    dataPost.Cookie = response.response.cookie;
                    dataPost.dateEnd = this.props.day;
                    dataPost.pageNo = id;
                    if (this.props.value === '1') {
                        dataPost.dateStart = this.props.day;
                        dataPost.dateType = 'recent1';
                    }
                    if (this.props.value === '2') {
                        dataPost.dateStart = this.props.day7;
                        dataPost.dateType = 'recent7';
                    }
                    if (this.props.value === '3') {
                        dataPost.dateStart = this.props.day30;
                        dataPost.dateType = 'recent30';
                    }
                    console.log('datapost', dataPost);

                    let dataAds = await getReportAds(dataPost);
                    if (dataAds && dataAds.success) {
                        let countRequest = Math.round(dataAds.total / 20) + 1;
                        this.props.changProp(dataAds.result);
                        //console.log('data đổi', dataAds.result)
                    }

                }
            }
        })

    }
    render() {

        var pagesArray = [];
        for (var i = 1; i <= this.props.countPage; i++) {
            let index = i;
            pagesArray.push(index)
        }
        let dataAds = this.props.dataAdsShow;
        console.log(this.props.isLoadingReport);
        return (
            <Modal size='xl' isOpen={this.props.isOpen} className={'modal-shop-container'}>
                <ModalHeader toggle={() => { this.toggle() }} >Thông kê báo cáo</ModalHeader>
                <ModalBody>
                    <div className='user-table mt-3 mx-1'>
                        <table id="customers">
                            <tr>
                                <th>STT</th>
                                <th>Từ khóa</th>
                                <th>Thứ hạng</th>
                                <th>Giá thầu</th>
                                <th>Chi Phí Quảng Cáo</th>
                                <th>Tỷ lệ chuyển đổi (CVR)</th>
                                <th>Đơn hàng</th>
                                <th>Doanh thu</th>
                            </tr>

                            {dataAds && dataAds.map((item, index) => {
                                return (<>
                                    <tr>
                                        <td>{index}</td>
                                        <td>{item.keyword}</td>
                                        <td>đang cập nhật...</td>
                                        <td>{item.maxBid}</td>
                                        <td>{this.formatter.format(item.spend)}</td>
                                        <td>{item.storeCvr}</td>
                                        <td>{item.productOrders}</td>
                                        <td>{this.formatter.format(item.productRevenue)}</td>
                                    </tr>
                                </>
                                )
                            })}
                            <div style={{ display: this.props.isLoadingReport ? 'none' : 'block' }} class="spinner-border text-success"></div>

                        </table>

                        <nav aria-label="...">
                            <ul class="pagination mt-10">
                                {/* {pagesArray} */}
                                {
                                    pagesArray.map((item, index) => {
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

                </ModalBody>
                <ModalFooter>
                    {/* <Button color="#841584"  >Tạo ngay</Button> */}
                    {/* <Button color='#841584' onClick={() => { this.toggle() }}>cancel</Button> */}
                </ModalFooter>
            </Modal >
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

export default connect(mapStateToProps, mapDispatchToProps)(modalShowReport);
