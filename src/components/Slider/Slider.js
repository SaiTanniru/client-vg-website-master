import React from 'react';

export default class extends React.Component {
    constructor() {
        super();

        this.state = {
            index: 0,
        };

        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.setIndex = this.setIndex.bind(this);
    }

    next() {
        let index = this.state.index;
        index = index + 1 >= this.props.slides.length ? 0 : index + 1;
        this.setIndex(index, 15000);
    }

    prev() {
        let index = this.state.index;
        index = index - 1 < 0 ? this.props.slides.length - 1 : index - 1;
        this.setIndex(index, 15000);
    }

    setIndex(index, timeout = 7000) {
        clearTimeout(this.timeout);
        this.setState({index});

        this.timeout = setTimeout(()=> {
            let index = this.state.index;
            index = index + 1 >= this.props.slides.length ? 0 : index + 1;
            this.setIndex(index);
        }, timeout);
    }

    componentDidMount() {
        this.setIndex(0);
    }
}