import request from '../utils/request';

export const fetchData = query => {
    return request({
        // url: './table.json',
        url: '/api/equipFaultReport/all',
        params: query,
        method: 'get',
    });
};

export const fetchData1 = query => {
    return request({
        url: '/api/equip_maintenance_plan/all',
        method: 'get',
    });
};


