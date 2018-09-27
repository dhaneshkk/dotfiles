"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imgur api
// referred from node-imgur:
// https://github.com/kaimallea/node-imgur/blob/master/lib/imgur.js
const request = require("request");
const fs = require("fs");
// The following client ID is tied to the
// registered 'node-imgur' app and is available
// here for public, anonymous usage via this node
// module only.
const IMGUR_API_URL = process.env.IMGUR_API_URL || 'https://api.imgur.com/3/';
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || 'f0ea04148a54268';
function uploadFile(filePath) {
    return new Promise((resolve, reject) => {
        const headers = {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
        };
        request.post({
            url: `${IMGUR_API_URL}image`,
            encoding: 'utf8',
            formData: { image: fs.createReadStream(filePath) },
            json: true,
            headers
        }, (err, httpResponse, body) => {
            if (err) {
                return reject(err);
            }
            if (body.success) {
                return resolve(body.data.link);
            }
            else {
                return resolve(body.data.error.message);
            }
        });
    });
}
exports.uploadFile = uploadFile;
/*
uploadFile('/Users/wangyiyi/Desktop/markdown-example/test.jpg')
.then((url)=> {
  ...
}).then((error)=> {
  ...
})
*/
//# sourceMappingURL=imgur.js.map