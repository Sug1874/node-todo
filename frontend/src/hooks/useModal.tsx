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
            <div>
                <button onClick={closeModal}>X</button>
                {children}
            </div> 
            : <></>)
    }

    return {Modal, openModal}
}

export default useModal