import request from "arcdynamic-request";

export function executeQuery({queryName, params = false, options = false, expireTime = false}) {
    const req = options ?
        {
            service: 'arcimedes',
            action: 'open.dataquery.execute',
            params: [queryName],
            options: options
        }
        :
        {
            service: 'arcimedes',
            action: 'open.dataquery.execute',
            params: [queryName, {param: params}]
        };
    if (expireTime) {
        return request(arc.path.api, req, {expires: expireTime});
    }
    return request(arc.path.api, req);
}