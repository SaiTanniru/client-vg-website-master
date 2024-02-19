import axios from "axios";
import request from "arcdynamic-request";

export function uploadFile({fileName, base64File, folder}) {

    return axios({
        withCredentials:true,
        method: 'POST',
        url: arc.path.api,
        headers: {'Accept': '*', 'Content-Type':'application/json'},
        data: {
            id:1,
            requests: [{
                service:"arcimedes",
                action:"open.File.update",
                params: [
                    base64File,
                    fileName,
                    folder,
                    true,
                ]
            }]
        }
    })
}

//remove file from arc
export function removeFile({fileName, folder}){
    return request(arc.path.api, {
        service: "arcimedes",
        action: "open.File.purge",
        params: [
            fileName, 
            folder, 
            "public"
        ]
    });
}