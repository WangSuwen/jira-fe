import req from './base.js';

export default {
    //
    test (data) {
        return req.get('test',data);
    }
};