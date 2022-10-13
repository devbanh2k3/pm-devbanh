import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createNewShop, getListShop } from '../../services/ShopServices';
import { emitter } from '../../utils/emitter';
import _ from 'lodash';
import { notifyError, notifySuccess, notifyWarn, } from './notify'
class modalUpdateShop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            textCookie: '',
            textNameShop: '',
            textProxy: ''
        }
        this.listenToEmitter();

    }
    listenToEmitter() {

    }
    componentDidMount() {
        let shop = this.props.arrShopsCompa;
        if (shop && !_.isEmpty(shop)) {
            this.setState({
                id: shop.id,
                textCookie: shop.Token,
                textNameShop: shop.shopName,
            })
        }
        console.log(this.props.arrShopsCompa)

    }
    toggle = () => {
        this.props.toggleShopModalUpdate();
    }
    handleOnChangeCookie = (event) => {
        this.setState({
            textCookie: event.target.value,
        })
    }
    handleOnChangeProxy = (event) => {
        this.setState({
            textProxy: event.target.value,
        })


    }
    handleOnChangeNameShop = (event) => {
        this.setState({
            textNameShop: event.target.value,
        })


    }
    handleUpdateShop = () => {
        this.props.doEditShop(this.state)
    }
    render() {
        console.log(this.props.isOpen)
        return (

            <Modal size='xl' isOpen={this.props.isOpen} className={'modal-shop-container'}>
                <ModalHeader toggle={() => { this.toggle() }} >Cập nhật dữ liệu shop</ModalHeader>
                <ModalBody>
                    <div className='modal-shop-body '>
                        <div className='input-container' >
                            <label>Tên shop</label>
                            <input
                                onChange={(event) => { this.handleOnChangeNameShop(event) }}
                                value={this.state.textNameShop} type='text' />
                        </div>
                        <div className='input-container' >
                            <label>Token</label>
                            <input onChange={(event) => { this.handleOnChangeCookie(event) }} value={this.state.textCookie} type='text' />
                        </div>
                        {/* <div className='input-container' >
                            <label>Proxy</label>
                            <input onChange={(event) => { this.handleOnChangeProxy(event) }} value={this.state.textProxy} type='text' />
                        </div> */}
                    </div>


                </ModalBody>
                <ModalFooter>
                    <Button color="#841584" onClick={() => { this.handleUpdateShop() }} >Cập nhật</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(modalUpdateShop);
