import React from 'react';
import Error404 from '../Error404';
import Icon from '../Icon';
import PropertyHero from '../PropertyHero';
import Contact from '../Contact';
import svgBack from '../../svgs/chevron-left.svg';
import marked from 'marked';
import Modal from "../Modal/Modal";
import {
    formatPhoneNumber,
    isPhoneValid,
    deviceType,
    isNameValid, isNameInvalid
} from "../../utils/utils";
import {getData, getDataProxy, manageDataProxy} from "../../utils/CRUD";
import agentTypes from "../../agent-types";
import {sendNewUserEmail} from "../../utils/emailRequests";

const formSteps = {
    email: 'email',
    details: 'details',
    end: 'end',
};

const checkboxProps = [
    'IS_PRINCIPAL',
    'IS_BROKER',
];

function convertDataToForm(formData) {
    const data = {...formData};

    checkboxProps.forEach(key => {
        if (data.hasOwnProperty(key)) {
            data[key] = data[key] ? 'y' : 'n';
        }
    });

    return data;
}

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            showModal: false,
            isBusy: null,
            phoneNumberError: '',
            firstNameError: '',
            lastNameError: '',
            formStep: formSteps.email,
            form: {
                EMAIL: null,
                FIRST_NAME: null,
                LAST_NAME: null,
                COMPANY_NAME: null,
                IS_PRINCIPAL: false,
                IS_BROKER: false,
                PHONE: null,
                PACKAGES_ID: null,
                ARCIMEDES_ROW_ID: null,
            },
            packageData: {},
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.saveData = this.saveData.bind(this);
        this.verifyUser = this.verifyUser.bind(this);
        this.downloadPackage = this.downloadPackage.bind(this);
    }

    _fetch = (id, isUser) => {
        const filter = [
            {
                code: 'ARCIMEDES_ROW_ID',
                text: id,
                type: 'exact',
            },
            {
                code: 'DELETED',
                text: '',
                type: 'null',
            },
        ];

        if (!isUser) {
            filter.push({
                code: 'SOURCE',
                text: 'STRIVE',
                type: 'exact',
            });
            filter.push({
                code: 'VISIBLE',
                text: 'y',
                type: 'exact',
            });
        }

        const options = {
            limit: {
                count: 1,
                offset: 0,
            },
            filter: filter,
            filterType: 'and',
        };

        getData({tableCode: 'PROPERTIES',options, expireTime: 1000 * 60 * 6}).then(res => {
            let _resData=res.success && res.data.length ? res.data[0] : false;
            if(res.data.length){
                _resData = res.data[0];
               options.filter= [options.filter[0]];
               options.filter[0].code='PROPERTY_ID';
        getData({tableCode: 'UNDERWRITING_SINGLE_TENANT',options}).then(res2 => {
                    const _data = res2.data[0];
                     if(_data && _data.SALE_LEASE_BACK){
                        const SALE_LEASE_BACK =  _data.SALE_LEASE_BACK;
                        const ORIGINAL_LEASE_TERM = _data.ORIGINAL_LEASE_TERM
                        const __data = {..._resData,SALE_LEASE_BACK, ORIGINAL_LEASE_TERM}
                        this.setState({data:__data});
                    }
                });
            }
            this.setState({data: _resData});       
        });
    }

    componentDidMount() {
        if (this.props.isUser !== undefined) {
            this._fetch(this.props.id, this.props.isUser);
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.id !== this.props.id) || (nextProps.isUser !== this.props.isUser)) {
            this.setState({data: null});
            this._fetch(nextProps.id, nextProps.isUser);
        }
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    downloadPackage() {
        const userEmail = localStorage.getItem('email');
        // if email exists in localStorage get data, else open modal
        if (userEmail) {
            this.verifyUser(userEmail);
        } else {
            this.toggleModal();
        }
    }

    verifyUser(userEmail) {
        if (this.state.isBusy) return;

        this.setState({isBusy: true});

        const userOptions = {
            filter: [
                {
                    code: 'EMAIL',
                    text: userEmail,
                    type: 'exact',
                },
            ],
        };

        const packageOptions = {
            filter: [
                {
                    code: 'PROPERTY_ID',
                    text: this.state.data.ARCIMEDES_ROW_ID,
                    type: 'exact',
                },
            ],
        };

        Promise.all([
            getDataProxy({tableCode: 'WEBSITE_USERS', options: userOptions}),
            getDataProxy({tableCode: 'WEBSITE_PACKAGES', options: packageOptions}),
        ]).then(res => {
            const userRes = res[0].data.responses[0];
            const packageRes = res[1].data.responses[0];
            const userExists = res && res[0].status === 200 && res[1].status === 200 && userRes.success && userRes.data.length && packageRes.success;

            this.setState({
                isBusy: null,
            }, () => {
                // if email exists in DB and user has submitted all details (verify FIRST_NAME has value) save downloaded package ID
                if (userExists && userRes.data[0].FIRST_NAME) {
                    const usersID = packageRes.data[0] && packageRes.data[0].USERS_ID ? `${packageRes.data[0].USERS_ID},${userRes.data[0].ARCIMEDES_ROW_ID}` : userRes.data[0].ARCIMEDES_ROW_ID;
                    const packagesID = userRes.data[0].PACKAGES_ID ? `${userRes.data[0].PACKAGES_ID},${this.state.data.ARCIMEDES_ROW_ID}|${(new Date()).toLocaleDateString()}` : `${this.state.data.ARCIMEDES_ROW_ID}|${(new Date()).toLocaleDateString()}`;
                    const userData = {
                        ARCIMEDES_ROW_ID: userRes.data[0].ARCIMEDES_ROW_ID,
                        PACKAGES_ID: packagesID,
                    };
                    const packageData = {};
                    if (packageRes.data[0]) {
                        packageData.ARCIMEDES_ROW_ID = packageRes.data[0].ARCIMEDES_ROW_ID;
                        packageData.USERS_ID = usersID;
                    } else {
                        packageData.PROPERTY_ID = this.state.data.ARCIMEDES_ROW_ID;
                        packageData.USERS_ID = usersID;
                    }

                    this.saveData({userData, packageData, step: formSteps.end});
                } else {
                    // if user doesn't exist, save it's email and go to step 2
                    // if user didn't completed the form go to step 2
                    if (this.state.showModal) {
                        if (!userExists) {
                            const formData = {...this.state.form};
                            this.setState({
                                packageData: packageRes.data.length ? packageRes.data[0] : {},
                            }, () => {
                                this.saveData({userData: formData, step: formSteps.details});
                            });
                        } else {
                            this.setState({
                                form: {...this.state.form, ARCIMEDES_ROW_ID: userRes.data[0].ARCIMEDES_ROW_ID},
                                formStep: formSteps.details,
                                packageData: packageRes.data.length ? packageRes.data[0] : {},
                            });
                        }
                    } else {
                        // else open modal
                        localStorage.removeItem('email');
                        this.toggleModal();
                    }
                }
            });
        });
    }

    saveData({userData, packageData, step, sendEmail = false}) {
        if (this.state.isBusy) return;

        this.setState({isBusy: true});

        const requests = [
            manageDataProxy({tableCode: 'WEBSITE_USERS', data: [convertDataToForm(userData)]})
        ];
        if (step === formSteps.end) {
            requests.push(
                manageDataProxy({tableCode: 'WEBSITE_PACKAGES', data: [packageData]})
            );
        }

        Promise.all(requests).then(response => {
            const userRes = response[0].data.responses[0];
            const packageRes = response[1] ? response[1].data.responses[0] : null;

            if (response[0].status === 200 && userRes && userRes.success && (packageRes && packageRes.success || !packageRes)) {
                const state = {
                    isBusy: null,
                    formStep: step,
                };

                if (step === formSteps.details) {
                    state.form = {...userData, ARCIMEDES_ROW_ID: userRes.data[0].ARCIMEDES_ROW_ID};
                }

                if (step === formSteps.end) {
                    state.form = userRes.data[0];
                    state.packageData = packageRes.data[0];
                    if (!localStorage.getItem('email')) {
                        localStorage.setItem('email', this.state.form.EMAIL);
                    }

                    if (sendEmail)
                        this.sendNewUserEmail(userRes.data[0]);

                    this.openDownloadPackage();
                }

                this.setState(state);
            } else {
                this.setState({
                    isBusy: null,
                    alertMessage: userRes && userRes.message ? userRes.message :
                        <span>Sorry, there was a problem submitting your data. Please try again.</span>,
                });
            }
        });
    }

    sendNewUserEmail(userData) {
        const newUserData = [{
            FIRST_NAME: userData.FIRST_NAME,
            LAST_NAME: userData.LAST_NAME,
            EMAIL: userData.EMAIL,
            PHONE_NUMBER: userData.PHONE,
            COMPANY: userData.COMPANY_NAME,
            IS_PRINCIPAL: userData.IS_PRINCIPAL === 'y' ? '1' : null,
            IS_AGENT: userData.IS_BROKER === 'y' ? '1' : null,
            PROPERTY_NAME: this.state.data.NAME,
            PROPERTY_CITY: this.state.data.CITY,
            PROPERTY_STATE: this.state.data.STATE
        }];

        sendNewUserEmail(newUserData);
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const formStep = this.state.formStep;
        const formData = {...this.state.form};

        if (formStep === formSteps.email) {
            // verify email in DB
            this.verifyUser(formData.EMAIL);
        }

        if (formData.FIRST_NAME && formData.LAST_NAME) {
            const firstNameInvalid = isNameInvalid(formData.FIRST_NAME);
            const lastNameInvalid = isNameInvalid(formData.LAST_NAME);

            if (firstNameInvalid)
                this.setState({firstNameError: 'Please enter a valid first name!'});

            if (lastNameInvalid)
                this.setState({lastNameError: 'Please enter a valid last name!'});
        }

        if (formStep === formSteps.details) {
            // verify if user's phone number is in US prefixes range
            if (!isPhoneValid(formData.PHONE)) {
                this.setState({phoneNumberError: 'Please input a valid phone number!'});
                return;
            }

            // save user's data, download the package and close the modal
            const userData = {...formData, PACKAGES_ID: this.state.data.ARCIMEDES_ROW_ID};
            const packageData = {...this.state.packageData};
            if (packageData && Object.keys(packageData).length) {
                packageData.USERS_ID = `${packageData.USERS_ID},${formData.ARCIMEDES_ROW_ID}`;
            } else {
                packageData.PROPERTY_ID = this.state.data.ARCIMEDES_ROW_ID;
                packageData.USERS_ID = formData.ARCIMEDES_ROW_ID;
            }
            this.saveData({userData, packageData, step: formSteps.end, sendEmail: true});
        }
    };

    handleChange(e, code = false) {
        let value = e.currentTarget.value;
        let key = e.currentTarget.name;
        const newValues = {};

        if (e.currentTarget.type === 'radio') {
            value = e.currentTarget.checked;
            key = code;
            if (e.currentTarget.checked) {
                switch (code) {
                    case 'IS_PRINCIPAL':
                        newValues.IS_BROKER = false;
                        break;
                    case 'IS_BROKER':
                        newValues.IS_PRINCIPAL = false;
                        break;
                }
            }
        }
        if (e.currentTarget.name === 'PHONE') {
            value = formatPhoneNumber(value);
            this.setState({phoneNumberError: ''});
        }
        newValues[key] = value;

        this.setState({
            form: Object.assign(this.state.form, newValues),
            firstNameError: '',
            lastNameError: ''
        });
    }

	openDownloadPackage() {
		const mediaKit = this.state.data.MEDIA_KIT;
		if (deviceType() === 'desktop') {
            window.open(`${arc.path.media}${mediaKit}`);
        } else {
            window.location.assign(`${arc.path.media}${mediaKit}`);
        }
    }

    render() {
        const {data, showModal, formStep, form} = this.state;
        const returnUrl = this.props.location.query.back;
        const isUser = this.props.isUser;

        return (
            <div className='Property'>
                <Modal onClose={this.toggleModal} show={showModal}>
                    {
                        [formSteps.email, formSteps.details].includes(formStep) ?
                            <form className='download-package-form' onSubmit={this.handleSubmit}>
                                <fieldset className='download-package-form' disabled={this.state.isBusy}>
                                    <div className='download-package-message'>
                                        {
                                            formStep === formSteps.email ?
                                                'To view this package, we require you to log in to our site with your email address. If you are a new visitor, you will be asked to register.'
                                                :
                                                'Please register in order to view our packages:'
                                        }
                                    </div>
                                    {
                                        formStep === formSteps.email &&
                                        <input value={form.EMAIL} className='download-package-input' name='EMAIL'
                                               type='email' placeholder='Email' required onChange={this.handleChange}/>
                                    }
                                    {
                                        formStep === formSteps.details ?
                                            <React.Fragment>
                                                <input value={form.FIRST_NAME} className='download-package-input'
                                                       name='FIRST_NAME' type='text' placeholder='First Name' required
                                                       onChange={this.handleChange}/>
                                                {
                                                    this.state.firstNameError &&
                                                    <div className='first-last-name-error'>Please enter a valid first name!</div>
                                                }

                                                <input value={form.LAST_NAME} className='download-package-input'
                                                       name='LAST_NAME' type='text' placeholder='Last Name' required
                                                       onChange={this.handleChange}/>
                                                {
                                                    this.state.lastNameError &&
                                                    <div className='first-last-name-error'>Please enter a valid last name!</div>
                                                }

                                                <input value={form.COMPANY_NAME} className='download-package-input'
                                                       name='COMPANY_NAME' type='text' placeholder='Company Name'
                                                       onChange={this.handleChange}/>
                                                <fieldset id='radio' className='download-package-checkbox-container'>
                                                    {
                                                        agentTypes.map((el, i) => {
                                                            return (
                                                                <div key={i} className='download-package-checkbox-item'>
                                                                    <input type='radio' name='radio'
                                                                           checked={form[el.code]}
                                                                           onClick={e => this.handleChange(e, el.code)}
                                                                           required/>
                                                                    <div key={i}
                                                                         className={`download-package-checkbox-name${form[el.code] ? ' is-active' : ''}`}>{el.name}</div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </fieldset>
                                                <input value={form.PHONE} className='download-package-input'
                                                       name='PHONE' type='text' placeholder='Phone' required
                                                       pattern='\([0-9]{3}\) [0-9]{3}-[0-9]{4}'
                                                       onInput={this.handleChange}/>
                                                {
                                                    this.state.phoneNumberError &&
                                                        <div className='phone-number-error'>Please enter a valid phone number!</div>
                                                }
                                            </React.Fragment>
                                            :
                                            null
                                    }
                                    <div className='buttons-container'>
                                        <button className='download-package-button'>Submit</button>
                                        <button className='download-package-button' onClick={this.toggleModal}>Close
                                        </button>
                                    </div>
                                </fieldset>
                            </form>
                            :
                            <div className='end-container'>
                                <div className='download-package-message'>Thank you!</div>
                                <button className='download-package-button' onClick={this.toggleModal}>Close</button>
                            </div>
                    }
                </Modal>
                <div className='Property_head'>
                    <div className='Property_head_back'>
                        <a href={returnUrl ? returnUrl : arc.path.base + 'listings'}><Icon
                            className='Property_head_back_icon' svg={svgBack}/> <span>Back to listings</span></a>
                    </div>
                    {
                        data ? <PropertyHero data={data} isUser={isUser}
                                             downloadPackage={() => this.downloadPackage()}/> : null
                    }
                </div>
                {
                    data && data.HIGHLIGHTS && (isUser || data.STATUS !== 'Closed') ? (
                        <div className='Property_detail'>
                            <div className='Property_detail_block'>
                                <h2>Highlights</h2>
                                <div dangerouslySetInnerHTML={{__html: marked(data.HIGHLIGHTS)}}/>
                            </div>
                        </div>
                    ) : null
                }
                {
                    data === false ? <Error404/> : null
                }
                <Contact/>
            </div>
        );
    }
}
