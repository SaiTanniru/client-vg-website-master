import {manageDataProxy} from "./CRUD";

export function sendNewUserEmail(userData) {
    Promise.resolve(manageDataProxy({tableCode: 'WEBSITE_NEW_USER_LOGIN', data: userData, isEmail: true}));
}
