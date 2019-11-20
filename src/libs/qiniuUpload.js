
import api from '@/apis/common';
import * as qiniu from 'qiniu-js';



let qiniuUpload = {};
qiniuUpload.upload = function (file,observer) {

    var fileName=   new Date().getTime()+""+ Math.floor(Math.random()*1000000000);
    var putExtra = {
        fname: "",
        params: {},
        mimeType: [] || null
    };
    var config = {
        useCdnDomain: true,
        region: qiniu.region.z0
};

    api.getQiNiuToken().then(function (data) {
        var observable = qiniu.upload(file, fileName, data.data, putExtra, config);
        var subscription = observable.subscribe(observer); // 上传开始
    })
    return fileName;
};

const AccessKey= '';
const SecretKey= '';

qiniuUpload.getBaseUrl=function () {
    return '';
}


function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];// 结果：   image/png
    console.log("arr[0]====" + JSON.stringify(arr[0]));//   "data:image/png;base64"
    console.log("arr[0].match(/:(.*?);/)====" + arr[0].match(/:(.*?);/));// :image/png;,image/png
    console.log("arr[0].match(/:(.*?);/)[1]====" + arr[0].match(/:(.*?);/)[1]);//   image/png
    var bstr = atob(arr[1].replace(/\s/g, ''));
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});//值，类型
}


export default qiniuUpload;
