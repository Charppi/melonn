import Swal from "sweetalert2"
import { SweetAlertIcon } from "sweetalert2";

export const loader = {
    open: (text: string = "Loading, please wait...") => {
        Swal.fire({
            text,
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading()
            }
        });
    },
    close: () => Swal.close()
}

export const confirmation = async (html: string) => {
    return await Swal.fire({ icon: "question", html, showConfirmButton: true, showCancelButton: true })
}

export const showMessage = (icon: SweetAlertIcon, html: string) => {
    return Swal.fire({
        icon,
        html,
    })
}