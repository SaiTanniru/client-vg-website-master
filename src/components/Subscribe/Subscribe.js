import React from 'react';

export default class extends React.Component {
	componentDidMount() {
		window._ctct_m = "9ab3a457560f60b5239696711468c4f9";
		const x = document.createElement('script');
		x.src = "//static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js";
		x.id = "signupScript";
		document.head.appendChild(x);
	}
	shouldComponentUpdate() {
		return false;
	}
	render() {
		const html = `<div class="ctct-inline-form" data-form-id="f6c06cbc-fb17-43d7-b0ab-34c2ae30c27d"></div>`;

		return (
			<div className='Subscribe'>
				<div className='Subscribe_wrap' dangerouslySetInnerHTML={{__html: html}}/>
			</div>
		);
	}
}