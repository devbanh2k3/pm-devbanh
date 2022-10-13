import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import { createNewItem } from '../../services/userServices';
import { notifyError, notifySuccess, notifyWarn, } from './notify'
class modelUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrToTal: [],
            dataOverview: [],
            value: '',
            nameshop: '',
            nameItem: '',
            IdAds: '',
            sku: '',
            errMessage: ''
        }
        this.listenToEmitter();

    }
    listenToEmitter() {
        emitter.on('EVENT_MODAL', data => {
            console.log('EVENT_MODAL', data);
            this.setState({
                arrToTal: data.id,
            })
        })
        emitter.on('EVENT_MODAL_ARROVERVIEW', data => {
            console.log('EVENT_MODAL', data);

            this.setState({
                dataOverview: data.arrOverview,
            })
        })

    }
    componentDidMount() {
        //console.log("dây là modal", this.props.arrOptionShop)

    }
    handleOnChangeNameshop = (event) => {
        this.setState({
            nameItem: event.target.value,
        })
    }
    handleOnChangeIdAds = (event) => {
        this.setState({
            IdAds: event.target.value,
        })
    }
    handleOnChangeSku = (event) => {
        this.setState({
            sku: event.target.value,
        })
    }
    toggle = () => {
        this.props.toggleFromParent();

    }
    handleOnclickGetId = async (id) => {
        console.log(id);

    }
    onSelect = (event) => {
        const selectedIndex = event.target.options.selectedIndex;
        let sele = event.target.options[selectedIndex].getAttribute('value');
        let nameshop = event.target.options[selectedIndex].text;

        this.setState({
            value: sele,
            nameshop: nameshop
        }, () => {
            console.log(this.state);
        })


    }
    doCreateItem = async () => {
        this.setState({
            errMessage: ''
        })
        if (this.state.value) {
            // value: '',
            // nameshop: '',
            // nameItem: '',
            // IdAds: '',
            // sku: '',
            let data = await createNewItem(this.state.nameItem, this.state.value, this.state.IdAds, this.state.sku, '');
            if (data.success) {
                this.setState({
                    errMessage: data.msg
                })
                this.props.getAllItem();
                notifySuccess('Thêm sản phẩm thành công')
            }
            else {
                notifyError('Thêm sản phẩm thất bại')
            }
            console.log(data);
        }
        else {
            this.setState({
                errMessage: "vui lòng chọn shop!"

            })
            notifyWarn('vui lòng chọn shop!')
        }
        console.log(this.state);
    }

    render() {
        // console.log(this.props.arrOverview);

        let arrShop = this.props.arrOptionShop;
        //console.log(arrShop)
        return (
            <Modal size='xl' isOpen={this.props.isOpen} className={'modal-item-container'}>
                <ModalHeader toggle={() => { this.toggle() }} >Thêm sản phẩm</ModalHeader>
                <ModalBody>
                    <div className='modal-shop-body '>
                        <div className='input-container' >
                            <label>Tên sản phẩm</label>
                            <input
                                onChange={(event) => { this.handleOnChangeNameshop(event) }}
                                value={this.state.textNameShop} type='text' />
                        </div>
                        <div className='input-container' >
                            <label>ID Sản Phẩm tài trợ</label>
                            <input onChange={(event) => { this.handleOnChangeIdAds(event) }} value={this.state.textCookie} type='text' />
                        </div>
                        <div className='input-container' >
                            <label>Sku</label>
                            <input onChange={(event) => { this.handleOnChangeSku(event) }} value={this.state.textCookie} type='text' />
                            <small>Mỗi sku cách nhau bằng "|"</small>
                        </div>

                        <div className='input-container' >
                            <label>Chọn shop</label>

                            <select value={this.state.value} onChange={(event) => { this.onSelect(event) }}>
                                <option>--chọn shop cho sản phẩm--</option>
                                {arrShop && arrShop.map((item, index) => {
                                    return (
                                        <>
                                            <option key={item.id} value={item.id} >{item.shopName}</option>
                                        </>
                                    )
                                })

                                }

                            </select>
                        </div>
                        <div className='input-container' style={{ color: 'red', margin: '5px 2px' }}>
                            {this.state.errMessage}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => { this.doCreateItem() }}  >Something</Button>
                    <Button color='secondary' onClick={() => { this.toggle() }}>cancel</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(modelUser);
