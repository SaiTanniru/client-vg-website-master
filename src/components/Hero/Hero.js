import React from 'react';
import Cycle from '../Cycle';
import imgSrc from 'arcdynamic-resize';
import request from "arcdynamic-request";
import { getData, manageData } from '../../utils/CRUD';
import { removeFile, uploadFile } from '../../utils/fileRequests';
import {removeFileErrorMessage, saveFileErrorMessage, uploadFileErrorMessage} from "../../utils/utils";

const FOLDER = '';

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.validateSelectedFile = this.validateSelectedFile.bind(this);
        this.fileInputRef = React.createRef();
    }

    fetch() {
        const options = {
            column: [
                'ARCIMEDES_ROW_ID',
                'NAME',
                'DATA',
            ],
            filter: [
                {
                    code: 'NAME',
                    text: 'TEAM_PHOTO',
                    type: 'exact',
                },
            ],
            limit: {
                count: 1,
                offset: 0,
            },
        };
        const source = 'STRIVE';
        Promise.all([request(arc.path.api, {
                service: 'arcimedes',
                action: 'open.dataquery.execute',
                params: ['OPEN_SOLD_SUMMARY_ALL', {
                    param: {
                        source: source || '%',
                    },
                }],
            }),
            getData({tableCode:'WEBSITE', options})
        ]).then(res => {
            let state = {};
            if (res[0] && res[0].success) {
                let sum = res[0].data[0].SUM;
                let count = res[0].data[0].COUNT;
                sum = (sum / Math.pow(10, 9)).toString();
                sum = sum.slice(0, (sum.indexOf('.')) + 2);
                count = parseInt(count / 25) * 25;
                state = {
                    totalSum: sum,
                    totalCount: count
                };
            }
            if (res[1] && res[1].success)
                state.teamPhoto = res[1].success ? res[1].data[0] : '';
            this.setState(state);
        });
    }
    
    componentWillMount() {
        this.fetch();
    }

    upload(file) {
        const fileName = file.name;
        const base64File = file.base64;

        uploadFile({fileName, base64File, folder: FOLDER}).then(res => {
            res = res.data.responses[0];
            if (!res || !res.success) {
                this.setState({error: uploadFileErrorMessage});
            } else {
                let teamPhoto = {...this.state.teamPhoto};
                teamPhoto.DATA = res.data.url.split('/v0/')[1];
                manageData({tableCode: 'WEBSITE', data: [teamPhoto]}).then(res => {
                    if (res && res.success)
                        this.setState({
                            teamPhoto,
                            error: null
                        });
                    else
                        this.setState({error: saveFileErrorMessage});
                });
            }
            this.fileInputRef.current.value = null;
        });
    }

    async removePhoto() {
        const fileName = this.state.teamPhoto.DATA && this.state.teamPhoto.DATA.split('_')[1];
        const res = await removeFile({fileName, folder: FOLDER});
        if (!res || !res.success)
            this.setState({error: removeFileErrorMessage});
    }

    async validateSelectedFile(event) {
        let selectedFile = event.currentTarget.files[0];
        selectedFile["base64"] = await new Promise(resolve => {
            let baseURL = "";
            let reader = new FileReader();

            reader.readAsDataURL(selectedFile);
            reader.onload = () => {
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
        await this.removePhoto();
        this.upload(selectedFile);
    }

    render() {
        const isAdmin = this.props.isAdmin;
        const teamPhoto = this.state.teamPhoto && this.state.teamPhoto.DATA;
        const error = this.state.error;

        const items = [
            (
                <div className='Hero_item'>
                    <div>"Coming together is the beginning. Keeping together is progress. Working together is success."</div>
                    <div>
                        <small>- Henry Ford</small>
                    </div>
                    <div><a className='Hero_button' href={arc.path.base+'join-our-team'}>Join our Team</a></div>
                </div>
            ),
            (
                this.state.totalCount ?
                    <div className='Hero_item'>
                        <div><b>#1 RETAIL TEAM IN SOUTHWEST</b></div>
                        <div>{this.state.totalCount}+ Transactions | Over ${this.state.totalSum} Billion Sold</div>
                        <div><a className='Hero_button' href={arc.path.base + 'our-team'}>Meet Our Team</a></div>
                    </div>
                    :
                    <div className='Hero_item'/>
            ),
            (
                <div className='Hero_item'>
                    <div><b>STRATEGIC PARTNERS.</b> NOT JUST BROKERS.</div>
                    <div><a className='Hero_button' href={arc.path.base + 'our-team'}>Meet Our Team</a></div>
                </div>
            ),
            (
                <div className='Hero_item'>
                    <div>"<b>STRIVE</b> not to be a success, but rather to be of value."</div>
                    <div>
                        <small>- Albert Einstein</small>
                    </div>
                    <div><a className='Hero_button' href={arc.path.base + 'our-team'}>Meet Our Team</a></div>
                </div>
            ),
        ];
        return (
            <div className='Hero' style={{backgroundImage: `url("${imgSrc(arc.path.media + 'stripes.jpg')}")`}}>
                <div className='Hero_slides'>
                    {
                        isAdmin &&
                        <div className="Hero_corner_right">
                            <input className='hidden' type="file" ref={this.fileInputRef} accept={"image/png, image/jpeg, image/jpg, .svg"} onChange={this.validateSelectedFile}/>
                            <button className='Hero_button' onClick={() => this.fileInputRef.current.click()}>Change Photo</button>
                            {
                                error &&
                                <span className='Hero_error'>{error}</span>
                            }
                        </div>
                    }
                    <Cycle items={items}/>
                </div>
                <div className='Hero_team'>
                    {
                        teamPhoto &&
                        <div className='Hero_team_img'
                             style={{backgroundImage: `url("${arc.path.media + teamPhoto}")`}}/>
                    }
                </div>
            </div>
        )
    }
}