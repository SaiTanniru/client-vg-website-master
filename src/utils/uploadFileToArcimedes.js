import axios from 'axios';
import {apiJoinOurTeamUrl} from './apiBaseUrls';

export function uploadFileToArcimedes(file) {
    const data = {
        requests: `[{"service":"arcimedes","action":"open.File.update","params":["${file.file}","${file.name}","Resumes", true]}]`,
        id: 1,
        format: 'json'
    };

    return axios({
        method: 'POST',
        url: apiJoinOurTeamUrl,
        data: data,
        withCredentials: false
    })
}
