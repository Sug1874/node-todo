import { useState } from "react"

const Modal = (props: {children : React.ReactElement}) => {
    const [show, setShow] = useState(true)

    const open = () => {
        setShow(true)
    }

    const close = () => {
        setShow(false)
    }

    return (<>{show && <>{props.children}</>}</>)
}

export default Modal