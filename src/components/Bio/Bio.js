import React from 'react';
import svgEnvelope from '../../svgs/envelope.svg';
import svgLinkedIn from '../../svgs/linkedin-square.svg';
import marked from 'marked';
import Icon from '../Icon';
import svgCertificate from '../../svgs/certificate.svg';
import ResizeImg from '../ResizeImg';

export default ({ profile, photoWidth }) => (
	<div className='Bio'>
		<div className='Bio_pic'>
			<ResizeImg alt={`${profile.FIRST_NAME} ${profile.LAST_NAME}`} className='Bio_pic_img' src={profile.PHOTO} resizeWidth={photoWidth}/>
			{
				profile.CREDENTIALS ? (
					<a className='Bio_pic_cred' href={profile.CREDENTIALS} target='_blank' rel='noopener'>
						<Icon svg={svgCertificate}/> <span>View credentials and achievements</span>
					</a>
				) : null
			}
		</div>
		<div className='Bio_body'>
			<div className='Bio_body_header'>
				<div>
					<div className='Bio_name'>{profile.FIRST_NAME} {profile.LAST_NAME}</div>
					<div className='Bio_role'>{profile.TITLE}</div>
					<div>{profile.PHONE}</div>
				</div>
				<div className='Bio_body_header_icons'>
					{ profile.LINKEDIN ? <a className='Bio_icon' href={profile.LINKEDIN} aria-label='LinkedIn' dangerouslySetInnerHTML={{__html: svgLinkedIn}}/> : null}
					{ profile.EMAIL ? <a className='Bio_icon' href={`mailto:${profile.EMAIL}`} aria-label='Email' dangerouslySetInnerHTML={{__html: svgEnvelope}}/> : null}
				</div>
			</div>
			{
				profile.DESCRIPTION ? (
					<div>
						<br/>
						<div dangerouslySetInnerHTML={{__html: marked(profile.DESCRIPTION)}}/>
					</div>
				) : null
			}
		</div>
	</div>
);