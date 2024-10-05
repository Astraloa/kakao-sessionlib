'use strict';

let f = [
    '/files/datastore/',
    '/shared_prefs/'
],
    n = [
        'KakaoTalk.hw.perferences.xml',
        'LocalUser_DataStore.pref.preferences_pb'
    ];

let chmod = (p, f) => java.lang.Runtime.getRuntime().exec(['su', '-c', 'chmod -R ' + p + ' ' + f]).waitFor();

module.exports = /** @class */ (function () {
    function Authorization(p, v) {
        this.app = {
            packageName: p,
            version: v
        };
        this.deviceUUID;
        this.accessToken;
        this.loginInfo;
        this.accessToken;
    }
    Authorization.prototype.getDeviceUUID = function () {
        chmod(777, '/data/data/' + this.app.packageName + f[1]);
        return this.deviceUUID = FileStream.read('/data/data/' + this.app.packageName + f[1] + n[0]).split(
            Number(this.app.version.split('.').slice(0, 1)[0]) <= 8
                ? '<string name="deviceUUID">'
                : '<string name="d_id">'
        )[1].split("</")[0];
    }
    Authorization.prototype.getAccessToken = function () {
        chmod(777, '/data/data/' + this.app.packageName + '/' + f[0]);
        this.loginData = localUserParse(FileStream.read('/data/data/' + this.app.packageName + f[0] + n[1]));
        let { encrypted_auth_token } = this.loginData;
        let doFinal = new javax.crypto.Cipher.getInstance('AES/CBC/PKCS5PADDING'),
            keySpec = new javax.crypto.spec.SecretKeySpec([
                67, 109, -115, -110, -23, 119, 33, 86, -99, -28, -102, 109, -73, 13, 43,
                -96, 109, -76, 91, -83, 73, -14, 107, -88, 6, 11, 74, 109, 84, -68, -80,
                15], 'AES'),
            ivSpec = new javax.crypto.spec.IvParameterSpec([10, 2, 3, -4, 20, 73, 47, -38, 27, -22, 11, -20, -22, 37, 36, 54]);
        doFinal.init(2, keySpec, ivSpec)
        this.loginInfo = JSON.parse(
            java.lang.String(
                doFinal.doFinal(android.util.Base64.decode(encrypted_auth_token, 0)), 'UTF-8'
            ) + ''
        );
        return this.accessToken = this.loginInfo.access_token;
    }
    Authorization.prototype.get = function () {
        return this.Authorization = this.getAccessToken() + '-' + this.getDeviceUUID();
    }

    return Authorization;
})();

function localUserParse(input) {
    input = input.replace(/[\u0000-\u0009\u000B-\u001F]/g, '')
        .replace(new RegExp(decodeURI("%EF%BF%BD"), "g"), '');
    var lines = input.split('\n');
    var data = {};
    var nowKey = null;

    lines.forEach(function (line) {
        line = line.trim();

        if (line === "") return;

        if (line.includes('*') || line.includes(':')) {
            var parts = line.split(/[*:]/);
            var key = parts[0].trim();
            var value = parts[1] ? parts[1].trim() : null;
            data[key] = value;
        } else {
            if (nowKey) {
                data[nowKey] += " " + line;
            } else {
                nowKey = line;
                data[nowKey] = null;
            }
        }
        nowKey = line.includes('*') || line.includes(':') ? null : nowKey;
    });
    Object.keys(data).map(key => {
        if (key.length <= 1) delete data[key];
    })

    return data;
}
