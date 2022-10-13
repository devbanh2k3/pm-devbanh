import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notifyError = (text) => {
    toast.error(text, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

}
const notifyWarn = (text) => {
    toast.warn(text, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

}
const notifySuccess = (text) => {
    toast.success(text, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

}
export {
    notifyError,
    notifySuccess,
    notifyWarn,
}