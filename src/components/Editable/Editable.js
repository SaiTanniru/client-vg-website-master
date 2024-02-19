import React from 'react';
import Editor from '../Editor';

const Content = class extends React.Component {
	shouldComponentUpdate(nextProps) {
		return nextProps.content !== this.props.content || nextProps.tag !== this.props.tag || nextProps.isHTML !== this.props.isHTML;
	}
	render() {
		return this.props.isHTML ? (
			React.createElement(this.props.tag, {dangerouslySetInnerHTML: {__html: this.props.content}})
		) : (
			React.createElement(this.props.tag, null, this.props.content)
		);
	}
}

export default class extends React.Component {
	static defaultProps = {
		content: '',
		tag: 'div',
		isHTML: false,
	};
	state = {
		isSaving: false,
	};
	_save = ()=>{
		if (!this.state.isSaving) {
			this.setState({isSaving: true}, ()=> {
				this.props.onSave(this.props.isHTML ? this._content.lastChild.innerHTML :  this._content.lastChild.innerText).then(()=> {
					this.setState({isSaving: false});
				});
			});
		}
	}
	componentDidMount() {
		if (this.props.enabled) {
			this._toolbar.init(this._content.lastChild);
		}
	}
	componentDidUpdate(prevProps) {
		if (this.props.enabled && !prevProps.enabled) {
			this._toolbar.init(this._content.lastChild)
		}
	}
	render() {
		const content = <Content content={this.props.content} tag={this.props.tag} isHTML={this.props.isHTML}/>;

		if (!this.props.enabled) return content;

		return (
			<div className='Editable' ref={c => this._content = c}>
				<Editor ref={c => this._toolbar = c} whitelist={this.props.isHTML ? (this.props.whitelist || undefined) : {}} onSave={this._save} isSaving={this.state.isSaving}/>
				{content}
			</div>
		);
	}
}