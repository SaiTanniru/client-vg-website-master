import React from 'react';
import imgSrc from 'arcdynamic-resize';

export default class extends React.Component {
	_error = (e)=>{
		if (this.props.onError) {
			this.props.onError(e);
		}
		const src = imgSrc(arc.path.media+this.props.src);
		if (src !== this.state.src) {
			this.setState({src});
		}
	}
	state = {
		src: imgSrc(arc.path.media+this.props.src, this.props.resizeWidth, this.props.resizeHeight),
	};
	componentDidUpdate(prevProps) {
		if (['src', 'resizeWidth', 'resizeHeight'].every(key => this.props[key] === prevProps[key]) === false) {
			this.setState({src: imgSrc(arc.path.media+this.props.src, this.props.resizeWidth, this.props.resizeHeight)});
		}
	}
	render() {
		const { ...props } = this.props;
		delete props.resizeHeight;
		delete props.resizeWidth;
		return <img {...props} src={this.state.src} onError={this._error} alt={props.alt || ''}/>;
	}
}