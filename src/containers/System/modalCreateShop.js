import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { createNewShop, getListShop } from '../../services/ShopServices';
import { emitter } from '../../utils/emitter';

import { notifyError, notifySuccess, notifyWarn, } from './notify'
class modalCreateShop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrToTal: [],
            textCookie: '',
            textNameShop: '',
            textProxy: '',
        }
        this.listenToEmitter();

    }
    listenToEmitter() {

    }
    componentDidMount() {


    }
    toggle = () => {
        this.props.toggleShopModal();

    }

    handleOnChangeCookie = (event) => {
        this.setState({
            textCookie: event.target.value,
        })
    }
    handleOnChangeNameShop = (event) => {
        this.setState({
            textNameShop: event.target.value,
        })


    }
    handleOnChangeProxy = (event) => {
        this.setState({
            textProxy: event.target.value,
        })


    }

    handleCreateNewShop = async () => {
        if (this.state.textCookie && this.state.textNameShop) {
            let response = await createNewShop(this.state.textNameShop, this.state.textCookie);
            if (response.success) {

                this.toggle();
                notifySuccess(response.msg);
                this.props.getallShop('All');
            }
            else {
                notifyError("Tạo shop thất bại");
            }
            console.log(response)
        }
    }
    render() {
        console.log(this.state.textCookie)
        return (
            <Modal size='xl' isOpen={this.props.isOpen} className={'modal-shop-container'}>
                <ModalHeader toggle={() => { this.toggle() }} >Tạo shop mới</ModalHeader>
                <ModalBody>
                    <div className='modal-shop-body '>
                        <div className='input-container' >
                            <label>Tên shop</label>
                            <input onChange={(event) => { this.handleOnChangeCookie(event) }} type='text' />
                        </div>
                        <div className='input-container' >
                            <label>Token</label>
                            <input onChange={(event) => { this.handleOnChangeNameShop(event) }} type='text' />
                        </div>
                    </div>


                </ModalBody>
                <ModalFooter>
                    <Button color="#841584" onClick={() => { this.handleCreateNewShop() }} >Tạo ngay</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(modalCreateShop);
