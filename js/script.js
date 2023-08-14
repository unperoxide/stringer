getModeTitle = () => {
    switch (CURRENT_MODE) {
        case Mode.HEX_ENCODE:
            return "Hex Encode";
        case Mode.HEX_DECODE:
            return "Hex Decode";
        case Mode.BASE64_ENCODE:
            return "Base64 Encode";
        case Mode.BASE64_DECODE:
            return "Base64 Decode";
        case Mode.PASSWORD:
            return "Password";
        case Mode.UUIDv4:
            return "UUID v4";
        case Mode.KEY:
            return "Key";
        case Mode.KEY_CAPS:
            return "Key (Caps)";
        case Mode.JSON_FORMAT:
            return "JSON Format";
        default:
            return "";
    }
};

__ = query => document.querySelector(query);

setMode = (mode) => {
    CURRENT_MODE = parseInt(mode);
};

getInput = () => {
    return __("#input").value;
}

setOutput = (value) => {
    __("#output").value = value;
}

setError = () => {
    __("#input").closest(".form-group").classList.add("has-danger");
};

removeError = () => {
    __("#input").closest(".form-group").classList.remove("has-danger");
};

getResult = () => {
    return getInput().getResult();
}

printResult = () => {
    setOutput(getResult());
}

isResultError = () => {
    return getResult() === ERROR_RESULT;
}

makeResult = () => {
    if (isResultError()) {
        setOutput('');
        setError();
    } else {
        printResult();
        removeError();
    }
};

setTitle = () => {
    __("[data-title]").innerText = getModeTitle();
}

copyOutputToClipboard = () => {
    __("#output").select();
    __("#output").setSelectionRange(0, 99999);
    document.execCommand("copy");
    __("#output").setSelectionRange(0, 0);
    __("#output").blur();
};

__("#input").addEventListener("keyup", makeResult, false);
__("#btn-submit").addEventListener("click", makeResult, false);

__("#btn-copy").addEventListener("click", function() {
    if (__("#output").value.trim().length === 0) return false;

    copyOutputToClipboard();

    __("#btn-copy").firstElementChild.innerText = 'done';

    setTimeout(() => {
        __("#btn-copy").firstElementChild.innerText = 'content_copy';
    }, 500);
});

$("#length-input").on('change keyup' ,function () {
    DEFAULT_LENGTH = parseInt($("#length-input").val());
    makeResult();
});

$("[data-mode-select]").click(function () {
    setMode($(this).data('mode-select'));

    setTitle();
    makeResult();
});