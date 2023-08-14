const Mode = {
    HEX_ENCODE: 1,
    HEX_DECODE: 2,
    BASE64_ENCODE: 3,
    BASE64_DECODE: 4,
    PASSWORD: 5,
    UUIDv4: 6,
    KEY: 7,
    KEY_CAPS: 8,
    JSON_FORMAT: 9,
};

const ERROR_RESULT = "__**__**__**__";

let CURRENT_MODE = Mode.BASE64_ENCODE;
let DEFAULT_LENGTH = 18;

String.prototype.jsonFormat = function () {
    try {
        return JSON.stringify(JSON.parse(this), null, 4);
    } catch (err) {
        return ERROR_RESULT;
    }
};

String.prototype.hexEncode = function () {
    var s = unescape(encodeURIComponent(this));
    var h = "";
    for (var i = 0; i < s.length; i++) {
        h += s.charCodeAt(i).toString(16);
    }
    return h;
};

String.prototype.hexDecode = function () {
    try {
        var s = "";
        for (var i = 0; i < this.length; i += 2) {
            s += String.fromCharCode(parseInt(this.substr(i, 2), 16));
        }
        return decodeURIComponent(escape(s));
    } catch (err) {
        return ERROR_RESULT;
    }
};

String.prototype.base64Encode = function () {
    return window.btoa(this);
};

String.prototype.base64Decode = function () {
    return window.atob(this);
};

String.prototype.isBase64 = function () {
    try {
        return btoa(atob(this)) == this;
    } catch (err) {
        return false;
    }
};

uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

generateStringFromCharset = (options = {}) => {
    var length = options.length || 18,
        charset = options.charset || PASSWORD_CHAR_SET,
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};

const CHAR_SET_PASSWORD = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789>!@#$%^&*()_+[]{}?:";
const CHAR_SET_KEY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CHAR_SET_KEY_CAPS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

generatePassword = () => generateStringFromCharset({
    length: DEFAULT_LENGTH,
    charset: CHAR_SET_PASSWORD,
});

generateKey = () => generateStringFromCharset({
    length: DEFAULT_LENGTH,
    charset: CHAR_SET_KEY,
});

generateKeyCaps = () => generateStringFromCharset({
    length: DEFAULT_LENGTH,
    charset: CHAR_SET_KEY_CAPS,
});

String.prototype.getResult = function () {
    switch (CURRENT_MODE) {
        case Mode.HEX_ENCODE:
            return this.hexEncode();
        case Mode.HEX_DECODE:
            return this.hexDecode();
        case Mode.BASE64_ENCODE:
            return this.base64Encode();
        case Mode.BASE64_DECODE:
            return this.isBase64() ?
                this.base64Decode() :
                ERROR_RESULT;
        case Mode.PASSWORD:
            return generatePassword();
        case Mode.KEY:
            return generateKey();
        case Mode.KEY_CAPS:
            return generateKeyCaps();
        case Mode.UUIDv4:
            return uuidv4();
        case Mode.JSON_FORMAT:
            return this.jsonFormat();
        default:
            return this.hexEncode();
    }
};