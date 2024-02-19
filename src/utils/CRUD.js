import request from "arcdynamic-request";
import axios from "axios";
import {apiArcUrl, apiArcUrlEmail} from "./apiBaseUrls";

// Arc Fusion: read
export function getData({tableCode, options, expireTime = false}) {
    const body = {
        service: 'arcimedes',
        action: 'open.datasource.table.Data.getData',
        params: ['code', tableCode, options]
    };

    if (expireTime) {
        return request(arc.path.api, body, {expires: expireTime});
    }
    return request(arc.path.api, body);
}

// Arc Fusion: create, update, delete
export function manageData({tableCode, data, expireTime = false}) {
    const body = {
        service: 'arcimedes',
        action: 'open.datasource.table.Data.updateByTableCode',
        params: [tableCode, {
            value: data, // data has to be array
        }]
    };
    if (expireTime) {
        return request(arc.path.api, body, {expires: expireTime});
    }
    return request(arc.path.api, body);
}

// Arc Proxy: read
export function getDataProxy({tableCode, options}) {
    const body = {
        requests: [{
            service: 'arcimedes',
            action: 'open.datasource.table.Data.getData',
            params: ['code', tableCode, options]
        }],
        id: 1,
        format: 'json',
    };

    return axios({
        method: 'POST',
        url: apiArcUrl,
        data: body,
    });
}

// Arc Proxy: create, update, delete
export function manageDataProxy({tableCode, data, isEmail = false}) {
    const body = {
        requests: [{
            service: 'arcimedes',
            action: 'open.datasource.table.Data.updateByTableCode',
            params: [tableCode, {
                value: data, // data has to be array
            }]
        }],
        id: 1,
        format: 'json',
    };

    return axios({
        method: 'POST',
        url: isEmail ? apiArcUrlEmail : apiArcUrl,
        data: body,
    });
}
