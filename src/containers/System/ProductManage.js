import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getListShop, editShop, deleteShop, deleteItemInShop } from '../../services/ShopServices';
import Createshop from './modalCreateShop';
import UpdateShop from './modalUpdateShop'
import { emitter } from '../../utils/emitter';
import { notifyError, notifySuccess, notifyWarn, } from './notify'
class ProductManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrShops: [],
            arrShopsCompa: [],
            isOpenModalCreateShop: false,
            isOpenModalUpdateShop: false,
        }
    }

    async componentDidMount() {
        await this.getallShop('All');
    }
    getallShop = async (id) => {
        let response = await getListShop(id);
        if (response) {
            if (id === 'All') {
                this.setState({
                    arrShops: response.data,
                }, () => {
                    //chạy xong thì chạy ở đây
                    notifySuccess('Làm mới dữ liệu thành công')
                })
            }
            else {
                this.setState({
                    arrShopsCompa: response.data,
                }, () => {
                    //chạy xong thì chạy ở đây
                    notifySuccess('Làm mới dữ liệu thành công')
                })
            }

        }
        //console.log(response);
    }
    setTileCreateShop = (title) => {
        this.setState({
            titleCreateShop: title,
        })
    }
    toggleShopModal = () => {
        this.setState({
            isOpenModalCreateShop: !this.state.isOpenModalCreateShop,
        })

    }
    toggleShopModalUpdate = () => {
        this.setState({
            isOpenModalUpdateShop: !this.state.isOpenModalUpdateShop,
        })

    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalCreateShop: true,
            textButton: 'Tạo ngay',
            titleCreateShop: 'Tạo shop mới',
        })
    }
    handleEditShop = (item) => {
        //this.getallShop(id);
        this.setState({
            isOpenModalUpdateShop: true,
            arrShopsCompa: item,
        })

    }
    handleDeleteShop = async (id) => {
        let mgs = await deleteShop(id);
        if (mgs.response === 'yes') {
            await this.getallShop('All');
            // //xóa shop => xóa item của shop
            // let response = await deleteItemInShop(id);
            // if (response && response.success) {
            //     notifySuccess(response.msg)
            //     await this.getallShop('All');
            // }
            // else {
            //     notifyError(response.msg)
            // }

            notifySuccess('xóa shop thành công')

        }
        else {
            notifyError('delete error')
        }
    }

    doEditShop = async (dataShop) => {

        let response = await editShop(dataShop);
        if (response !== 'no') {
            this.setState({
                isOpenModalUpdateShop: false,

            })
            await this.getallShop('All');
            notifySuccess('Cập nhật dữ liệu thành công')
        }
        else {
            notifyError('cập nhật thất bại')
        }
    }
    render() {
        let arrShops = this.state.arrShops;
        return (
            <div className="users-container">
                <Createshop
                    isOpen={this.state.isOpenModalCreateShop}
                    toggleShopModal={this.toggleShopModal}
                    getallShop={this.getallShop}
                />
                {this.state.isOpenModalUpdateShop &&
                    <UpdateShop
                        isOpen={this.state.isOpenModalUpdateShop}
                        arrShopsCompa={this.state.arrShopsCompa}
                        toggleShopModalUpdate={this.toggleShopModalUpdate}
                        doEditShop={this.doEditShop}
                    />
                }

                <div className='title text-center'>Quản lí shop</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewUser()}
                    ><i class="fas fa-plus"></i> Add new Shop</button>
                </div>
                <div className='user-table mt-3 mx-1'>
                    <table id="customers">
                        <tr>
                            <th>ID</th>
                            <th>shopName</th>
                            <th>Token</th>

                            <th>Action</th>
                        </tr>
                        {arrShops && arrShops.map((item, index) => {
                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.shopName}</td>
                                    <td>{item.Token}</td>

                                    <td>
                                        <button onClick={() => this.handleEditShop(item)} className='btn-edit'><i className='fas fa-pencil-alt'></i></button>
                                        <button onClick={() => { this.handleDeleteShop(item.id) }} className='btn-delete'><i className='fas fa-trash'></i></button>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </table>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductManage);
