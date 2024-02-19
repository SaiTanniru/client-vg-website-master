import React from 'react';
import { setAdmin, setUser } from '../../actions';
import request from 'arcdynamic-request';

function logout(e) {
	e.preventDefault();
	request(arc.path.api, {
		service: 'arcimedes',
		action: 'Authentication.logout',
	});
	setAdmin(false);
	setUser(false);
}

export default ({isUser, pathname}) => (
    <div className='Header' style={{backgroundImage: `url("${arc.path.media + 'bg-pattern-header.png'}")`}}>
        <a href='/' className='Header_logo'>
            <img src={arc.path.media + 'strive.svg'} alt='Home' width='185'/>
        </a>
        <nav className='Header_nav'>
            <a className={'Header_nav_link' + (pathname === '/our-team' ? ' Header_nav_link--current' : '')} href='/our-team'>Who</a>
            <a className={'Header_nav_link' + (pathname === '/what' ? ' Header_nav_link--current' : '')} href='/what'>What</a>
            <a className={'Header_nav_link' + (pathname === '/how' ? ' Header_nav_link--current' : '')} href='/how'>How</a>
            <a className={'Header_nav_link' + (pathname.slice(0, 9) === '/listings' ? ' Header_nav_link--current' : '')} href='/listings'>Listings</a>
            <span tabIndex={0} className={'Header_nav_link' + ((pathname === '/news' || pathname === '/events' || pathname.slice(0, 5) === '/blog') ? ' Header_nav_link--current' : '')}>
                <span>Press</span>
                <span className='Header_nav_link_drop' style={{backgroundImage: `url("${arc.path.media + 'bg-pattern-header.png'}")`}}>
                    <a className={'Header_nav_link' + (pathname === '/news' ? ' Header_nav_link--current' : '')} href='/news'>News</a>
                    <a className={'Header_nav_link' + (pathname === '/events' ? ' Header_nav_link--current' : '')} href='/events'>Events</a>
                    {/*<a className={'Header_nav_link' + (pathname.slice(0, 5) === '/blog' ? ' Header_nav_link--current' : '')} href='/blog'>Blog</a>*/}
                </span>
            </span>
            <a className={'Header_nav_link' + (pathname === '/contact' ? ' Header_nav_link--current' : '')} href='/contact'>Contact</a>
            {
                isUser ? <a className='Header_nav_link' href='#' onClick={logout}>Logout</a> : false
            }
        </nav>
    </div>
)
