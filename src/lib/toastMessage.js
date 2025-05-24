import { Flip, toast } from "react-toastify";

const toastConfig = {
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    // progress: undefined,
    theme: "light",
    transition: Flip,
}

const toastMessage = (msg="Success", type='success', duration=3000) => {
    type = type.toLowerCase();
    if(type === 'success'){
        toast.success(msg, { ...toastConfig, autoClose: duration, });
    }
    else if(type === 'error'){
        toast.error(msg, { ...toastConfig, autoClose: duration, });
    }
    else if(type === 'warning'){
        toast.warn(msg, { ...toastConfig, autoClose: duration, });
    }
    else if(type === 'info'){
        toast.info(msg, { ...toastConfig, autoClose: duration, });
    }
}

export default toastMessage;