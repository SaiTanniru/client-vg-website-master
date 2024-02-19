import React from 'react';
import request from 'arcdynamic-request';

export default class extends React.Component {
	state = {
		isBusy: null,
		alertMessage: null,
	};

	_handleSubmit = (e) => {
		e.preventDefault();

		if (this.state.isBusy) return;

		this.setState({isBusy: true});

		const currentURL = document.location.protocol+'//'+document.location.host+document.location.pathname;

		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.updateData',
			params: ['code','CONTACTFORM'],
			options: {
				value: [
					{
						FIRSTNAME: this._firstName.value,
						LASTNAME: this._lastName.value,
						COMPANY: this._company.value,
						EMAIL: this._email.value,
						PHONE: this._phone.value,
						MESSAGE: this._message.value+"\r\n\r\nMessage submitted from:\r\n"+currentURL,
					}
				]
			},
		}).then(res => {
			if (res && res.success) {
				this.setState({
					isBusy: null,
					isSubmitted: true,
				});
			} else {
				this.setState({
					isBusy: null,
					alertMessage: res && res.message ? res.message : <span>Sorry, there was a problem submitting your feedback. Please email your feedback to <a href="mailto:jvitorino@vitorinogroup.com">jvitorino@vitorinogroup.com</a></span>,
				});
			}
		});
	};
	render() {
		return (
			<div id='contact' className='Contact' style={{backgroundImage: `url("${arc.path.media}stripes.jpg")`}}>
				<div className='Contact_wrap'>
					<div className='Contact_body'>
						{
							this.state.isSubmitted ? (
								<div>
									<h2>Message Sent</h2>
								</div>
							) : (
								<div>
									<h2>Contact Us</h2>
									<form disabled={this.state.isBusy} onSubmit={this._handleSubmit}>
										<input ref={c => this._firstName = c} name='first-name' id='Contact-first-field' type='text' placeholder='First Name*' required/>
										<input ref={c => this._lastName = c} name='last-name' type='text' placeholder='Last Name*' required/>
										<input ref={c => this._company = c} name='company' type='text' placeholder='Company'/>
										<input ref={c => this._email = c} name='email' type='email' placeholder='Email*' required/>
										<input ref={c => this._phone = c} name='phone' type='tel' placeholder='Phone*' required/>
										<textarea ref={c => this._message = c} name='message' placeholder='Message'/>
										<button>Submit</button>
									</form>
								</div>
							)
						}
					</div>
					<div className='Contact_map'>
						<picture>
							<source srcset='/map.avif' type='image/avif' />
							<img src='/map.jpg' alt='Our location on a map'/>
						</picture>
					</div>
				</div>
			</div>
		);
	}
}