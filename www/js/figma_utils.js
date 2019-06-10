const DOMAIN = "https://api.tacos.wtf";

const ROUTE_OAUTH = "/chicken/v1/oauth";
const ROUTE_FIGMA_FETCH = "/chicken/v1/form";
const ROUTE_LOTTIE_POST = "/chicken/v1/lottie";
const ROUTE_PREVIEW_GET = "/chicken/v1/preview/";

function figmaLogin() {
    window.location = DOMAIN + ROUTE_OAUTH;
}

function getAll(figma_link, session_uuid) {
    let u = DOMAIN + ROUTE_FIGMA_FETCH + "?" + $.param({uuid: session_uuid, figma_url: figma_link});
    return fetch(u, {
        method: 'GET',
    }).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json()
    });
}

function postLottie(data, api_url, callback_success, callback_error) {
    let u = DOMAIN + ROUTE_LOTTIE_POST + "?&url=" + api_url;

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: u,
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (callback_success !== undefined) {
                callback_success(data);
            }
        },
        error: function (e) {
            if (callback_error !== undefined) {
                callback_error(e);
            }
        }
    });
}

function fetchPreview(url) {
    let u = DOMAIN + ROUTE_PREVIEW_GET + url;
    return fetch(u, {
        method: 'GET',
    }).then(function (response) {
        return response.json();
    }).catch(function (error) {
        console.log(error);
        return error;
    });
}
