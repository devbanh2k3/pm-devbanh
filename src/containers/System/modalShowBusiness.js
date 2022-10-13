import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createNewShop, getListShop } from '../../services/ShopServices';
import { emitter } from '../../utils/emitter';
import moment from 'moment';
// const moment = require('moment');
import { notifyError, notifySuccess, notifyWarn, } from './notify'
class modalShowBusiness extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeLink: 1,
        }
    }

    componentDidMount() {
        this.setState({
            activeLink: 1
        })

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
        this.setState({
            activeLink: id
        }, () => {
            this.props.handleOpenShowBusiness(this.props.idItempro, this.props.idShoppro, id - 1)
        })
    }
    render() {
        let databusi = this.props.dataBusiness
        let databusiTotal = this.props.dataTotal

        let startdate = '';
        if (this.props.value === '1') {
            startdate = this.props.day;
        }
        if (this.props.value === '2') {
            startdate = this.props.day7;
        }
        if (this.props.value === '3') {
            startdate = this.props.day30;
        }
        var start = new Date(startdate);
        var end = new Date(this.props.day);
        var loop = new Date(start);
        let arrDay = [];
        while (loop <= end) {
            const result = moment(loop).format('YYYY-MM-DD');
            arrDay.push(result)
            var newDate = loop.setDate(loop.getDate() + 1);

        }


        var pagesArray = [];
        for (var i = 1; i <= this.props.countSku; i++) {
            let index = i;
            pagesArray.push(index)
        }
        return (

            <Modal size='xl' isOpen={this.props.isOpen} className={'modal-shop-container'}>
                <ModalHeader toggle={() => { this.toggle() }} >Phân tích</ModalHeader>
                <ModalBody>
                    <div className='user-table mt-1 mx-1 '>
                        <table id="customers">
                            <tr>
                                <th>STT</th>
                                <th>Ngày</th>
                                <th>Lược truy cập</th>
                                <th>Số lượng thêm vào giỏ hàng</th>
                                <th>Tỷ lệ chuyển đổi (CVR)</th>
                                <th>Sản phẩm bán được</th>
                                <th>Doanh thu</th>
                            </tr>

                            <div style={{ display: this.props.isLoadingBusiness ? 'none' : 'block' }} class="spinner-border text-success"></div>
                            {databusiTotal.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{index}</td>
                                        <td>{arrDay[index]}</td>
                                        <td>{item.sKUVisitor}</td>
                                        <td>{item.addToCartQuantity}</td>
                                        <td>{item.paidRate}</td>
                                        <td>{item.paidItemAmount}</td>
                                        <td>{this.formatter.format(item.payAmount)}</td>

                                    </tr>
                                )
                            })
                            }



                        </table>



                        {/* <table id="customers">
                            <tr>
                                <th>STT</th>
                                <th>Ngày</th>
                                <th>Thông tin sku</th>
                                <th>Lược truy cập</th>
                                <th>Số lượng thêm vào giỏ hàng</th>
                                <th>Tỷ lệ chuyển đổi (CVR)</th>
                                <th>Sản phẩm bán được</th>
                                <th>Doanh thu</th>
                            </tr>
                            <div style={{ display: this.props.isLoadingBusiness ? 'none' : 'block' }} class="spinner-border text-success"></div>
                            {databusi && databusi.map((item, index) => {

                                return (
                                    <tr>
                                        <td>{index}</td>
                                        <td>{arrDay[index]}</td>
                                        <td>{item ? item.sellerSKU.value : 'Null'}</td>
                                        <td>{item ? item.sKUVisitor.value : 'Null'}</td>
                                        <td>{item ? item.addToCartQuantity.value : 'Null'}</td>
                                        <td>{item ? item.paidRate.value : 'Null'}</td>
                                        <td>{item ? item.paidItemAmount.value : 'Null'}</td>
                                        <td>{item ? this.formatter.format(item.payAmount.value) : ''}</td>
                                    </tr>
                                )
                            })

                            }
                        </table> */}
                        <nav aria-label="...">
                            <ul class="pagination mt-10">
                                {/* {pagesArray} */}
                                {/* {
                                    pagesArray.map((item, index) => {
                                        return (
                                            <li key={index} class={"page-item " + (item === this.state.activeLink ? 'active' : '')}>
                                                <a onClick={() => { this.handleOnClickActive(item) }} class="page-link" href="#">{item} <span class="sr-only">(current)</span></a>
                                            </li >
                                        )

                                    })
                                } */}


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

export default connect(mapStateToProps, mapDispatchToProps)(modalShowBusiness);
