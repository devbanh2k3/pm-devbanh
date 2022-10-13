import { update } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { editItem } from '../../services/overviewService';
import { emitter } from '../../utils/emitter';

import { notifyError, notifySuccess, notifyWarn, } from './notify'
class modalItemChecker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pagesArray: [],
            checkAll: false,
        }


    }
    componentDidMount() {
        // this.setState({
        //     pagesArray: []
        // })
        // let arrItem = this.props.arrItems;
        // arrItem.map((item, index) => {
        //     this.state.pagesArray.push(item.Checkbox)
        // })
        // this.setState({
        //     pagesArray: this.state.pagesArray
        // })
        // console.log(this.state.pagesArray)

    }
    toggle = () => {
        this.props.toggleShopModal();

    }
    onChangSelect = async (id, Checkbox) => {
        let data = await editItem(id, !Checkbox);
        if (data && data.userData === 'yes') {
            await this.props.getallShop('All')
        }
        else {
            notifyError('Chọn thất bại')

        }

    }
    handleChangeCheckAll = async () => {
        this.setState({
            checkAll: !this.state.checkAll
        }, async () => {
            let data = await editItem('All', this.state.checkAll);
            console.log(this.state.checkAll)
            if (data && data.userData === 'yes') {
                await this.props.getallShop('All')

            }
            else {
                notifyError('Chọn thất bại')

            }
        })

    }
    render() {
        let arrItem = this.props.arrItems;


        return (
            <Modal size='xl' isOpen={this.props.isOpen} className={'modal-shop-container'}>
                <ModalHeader toggle={() => { this.toggle() }} >Danh sách sản phẩm</ModalHeader>
                <ModalBody>
                    <div className="users-container">
                        <div>
                            <div class="custom-control custom-checkbox mt-3 mx-1">
                                <input onChange={() => { this.handleChangeCheckAll() }} type="checkbox" class="custom-control-input" id="customCheck1 "
                                    checked={this.state.checkAll} />
                                <label className='mx-2'> Check All</label>
                            </div>
                        </div>

                        <div className='user-table mt-3 mx-1'>
                            <table id="customers">
                                <tr>
                                    <th>Shop</th>
                                    <th>Token</th>
                                    <th>Lựa chọn</th>
                                </tr>


                                {arrItem && arrItem.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{item.shopName}</td>
                                            <td>{item.Token}</td>
                                            <td>
                                                <div class="custom-control custom-checkbox">
                                                    <input onChange={() => { this.onChangSelect(item.id, item.Checkbox) }} type="checkbox" class="custom-control-input" id="customCheck1 "
                                                        checked={item.Checkbox ? "checker" : ""} />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                                }

                            </table>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
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

export default connect(mapStateToProps, mapDispatchToProps)(modalItemChecker);
