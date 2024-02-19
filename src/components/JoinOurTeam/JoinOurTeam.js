import React from 'react';
import request from 'arcdynamic-request';
import {uploadFileToArcimedes} from '../../utils/uploadFileToArcimedes'

const message = ['Supported file types are .pdf, .doc and .docx', 'Maximum file size is 20MB.'];

export default class extends React.Component {
    state = {
        isBusy: null,
        alertMessage: null,
        isSubmitted: null,
        resume: {
            name: null,
            file: null,
            message: message,
            invalidUpload: false
        }
    };

    constructor(props) {
        super(props);
        this.uploadResume = this.uploadResume.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }

    _handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.isBusy && this.state.resume.invalidUpload) return;

        this.setState({isBusy: true});

        const currentURL = document.location.protocol + '//' + document.location.host + document.location.pathname;

        if (this.state.resume.file) {
            uploadFileToArcimedes(this.state.resume).then(res => {
                if (res.data.responses[0].code !== 200 && res.data.responses[0].message === 'Unable to update file, one with this path/name already exists. Please set overwrite flag or delete existing one first.') {
                    const file = this.state.resume;
                    file.name = file.name.split('.')[0] + '(1)' + '.' + file.name.split('.')[1];  // Rename file, i.e. <filename>.pdf -> <filename>(1).pdf
                    uploadFileToArcimedes(file).then();
                    return {
                        code: 200,
                        data: {url: `https://dj4ao97lyirny.cloudfront.net/arcfusion/skydata/arc11a015/media/apps/arcimedes/v0/arcimedes/user/207/Resumes/${file.name}`}
                    };
                } else {
                    return res.data.responses[0];
                }
            }).then(res => {
                if (res && res.code === 200) {
                    this.addJobSubmission(res, currentURL);
                }
            });
        } else {
            this.addJobSubmission(null, currentURL);
        }
    };


    uploadResume() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.doc, .docx, .pdf');
        input.setAttribute('name', 'resume');
        input.click();

        input.addEventListener('change', () => {
            const file = input.files[0];
            let uploadFileErrors = this.handleErrors(file);
            if (!uploadFileErrors) {
                const reader = new FileReader();
                reader.addEventListener('load', event => {
                    this.setState({resume: {name: file.name, file: event.target.result, message: [file.name]}});
                });
                reader.readAsDataURL(file);
            } else {
                this.setState({resume: {name: null, file: null, message: [uploadFileErrors], invalidUpload: true}});
            }
        });
    }

    addJobSubmission = (res, currentUrl) => {
        const resumeLink = res ? res.data.url : null;
        request(arc.path.api, {
            service: 'arcimedes',
            action: 'open.datasource.table.Data.updateData',
            params: ['code', 'JOIN_OUR_TEAM'],
            options: {
                value: [
                    {
                        FIRST_NAME: this._firstName.value,
                        LAST_NAME: this._lastName.value,
                        EMAIL: this._email.value,
                        PHONE: this._phone.value,
                        RESUME_LINK: resumeLink,
                        RESUME_NAME: this.state.resume.name,
                        MESSAGE: this._message.value + "\r\n\r\nMessage submitted from:\r\n" + currentUrl,
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
                    isSubmitted: null,
                    alertMessage: res && res.message ? res.message :
                        <span>Sorry, there was a problem submitting your resume. Please email your resume to <a
                            href="mailto:jvitorino@vitorinogroup.com">jvitorino@vitorinogroup.com</a></span>,
                });
            }
        });
    };

    removeResume() {
        this.setState({
            resume: {
                name: null,
                file: null,
                message: message
            }
        })
    }

    handleErrors = (file) => {
        const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i.test(file.name) ? null : 'Wrong file format! Supported file types are .pdf, .doc and .docx';
        const sizeIsValid = file.size / 1024 / 1024 < 20 ? null : 'File is larger than 20MB';
        return allowedExtensions || sizeIsValid;
    };

    render() {
        const deleteSVGurl = arc.path.media + 'delete.svg';
        return (
            <div id='join-our-team' className='JoinOurTeam'
                 style={{backgroundImage: `url("${arc.path.media}stripes.jpg")`}}>
                <div className='JoinOurTeam_wrap'>
                    <div className='JoinOurTeam_body left'>
                        {
                            this.state.isSubmitted ? (
                                <div>
                                    <h2>Thank you! We'll review your application and we'll get back to you as soon as we can.</h2>
                                </div>
                            ) : (
                                <div>
                                    <h2>Join Our Team</h2>
                                    <form disabled={this.state.isBusy} onSubmit={this._handleSubmit}>
                                        <input ref={c => this._firstName = c} name='first-name'
                                               id='JoinOurTeam-first-field' type='text' placeholder='First Name*'
                                               required/>
                                        <input ref={c => this._lastName = c} name='last-name' type='text'
                                               placeholder='Last Name*' required/>
                                        <input ref={c => this._email = c} name='email' type='email' placeholder='Email*'
                                               required/>
                                        <input ref={c => this._phone = c} name='phone' type='tel' placeholder='Phone*'
                                               required/>
                                        <div className='JoinOurTeam_upload'>
                                            <div>Resume Upload</div>
                                            <div className='JoinOurTeam_button' onClick={this.uploadResume}>Choose
                                                File
                                            </div>
                                        </div>
                                        <div
                                            className={`JoinOurTeam_uploaded_message ${this.state.resume.file ? 'row' : ''}`}>
                                            {this.state.resume.message.map(err => <div style={{
                                                marginTop: '2px',
                                                color: `${this.state.resume.invalidUpload ? '#FF5050' : ''}`
                                            }}>{err}</div>)}
                                            <div onClick={() => this.removeResume()}
                                                 hidden={!this.state.resume.file}
                                                 className='JoinOurTeam_uploaded_file_delete'
                                                 style={{backgroundImage: `url("${deleteSVGurl}")`}}/>
                                        </div>
                                        <textarea ref={c => this._message = c} name='message' placeholder='Message'/>
                                        <button disabled={this.state.resume.invalidUpload}>Submit</button>
                                    </form>
                                </div>
                            )
                        }
                    </div>
                    <div className='JoinOurTeam_body right with_background'
                         style={{backgroundImage: `url("${arc.path.media}Job-Contact-Form-Background.png")`}}>
                        <div className='JoinOurTeam_text'>
                            <span className='JoinOurTeam_text bold'>STRIVE </span>
                            is a commercial real estate investment sales firm with over 100 years of combined real
                            estate experience. The scope of our business is focused on retail, industrial and office
                            investment sales in Texas and the Southwest with offices in Dallas and Houston. With over
                            $3.5 Billion in sales, our synergistic approach allows us to provide our clients with highly
                            exceptional service and results.
                        </div>
                        <div className='JoinOurTeam_text'>
                            <span className='JoinOurTeam_text bold'>STRIVE </span>
                            is always looking for potential team members who can provide value and assist in the
                            company’s broader goals. Please use the contact form to the left if you have interest in
                            joining the
                            <span className='JoinOurTeam_text bold'> STRIVE </span>
                            team.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
