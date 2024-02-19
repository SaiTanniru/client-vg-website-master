import React from "react";
import PropTypes from "prop-types";
import './Modal.scss';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
    }

    onClose = (e) => {
        this.props.onClose && this.props.onClose(e);
    };

    render() {
        if(!this.props.show){
            return null;
        }
        return (
            <div className='modal-container'>
                <div className='modal-background' onClick={(e) => this.onClose(e)}/>
                <div className='modal'>{this.props.children}</div>
            </div>
        )
    }
}

Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};