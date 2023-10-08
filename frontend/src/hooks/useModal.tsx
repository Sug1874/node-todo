import { useState } from "react"

const useModal = () => {
    const [show, setShow] = useState(false)

    const openModal = () => {
        console.log("open modal")
        setShow(true)
    }

    const closeModal = () => {
        console.log("close modal")
        setShow(false)
    }

    const Modal = ({children}) => {
        return (show ? 
            <div className="modal_container">
                <div className="modal">
                    <button onClick={closeModal} className="modal_close_button">X</button>
                    <div className="modal_content">{children}</div>
                </div>
            </div> 
            : <></>)
    }

    return {Modal, openModal}
}

export default useModal