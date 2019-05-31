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
    }).then(function (response) {
        return response.json();
    }).catch(function (error) {
        return {"comments": [{"id": "5951919", "file_key": "QNmd49FBEL50KAAHgNJ6cKek", "parent_id": "", "user": {"handle": "Baptiste Amato", "img_url": "https://s3-alpha.figma.com/profile/c6a2f3bb-01b6-4f89-8913-c5321d317d05", "id": "625415104311497142"}, "created_at": "2019-04-22T02:33:33Z", "resolved_at": null, "message": "{\"arguments\": {\"loop\": false}}", "client_meta": {"node_id": "56:2", "node_offset": {"x": 299, "y": 610}}, "order_id": "5"}, {"id": "5951377", "file_key": "QNmd49FBEL50KAAHgNJ6cKek", "parent_id": "", "user": {"handle": "Baptiste Amato", "img_url": "https://s3-alpha.figma.com/profile/c6a2f3bb-01b6-4f89-8913-c5321d317d05", "id": "625415104311497142"}, "created_at": "2019-04-22T00:46:02Z", "resolved_at": "2019-04-22T00:47:37Z", "message": "{\n    \"info\": \"Start on hover\",\n    \"arguments\": {\n        \"loop\": true,\n        \"speed\": 5,\n        \"autoplay\": true\n    }\n}", "client_meta": {"node_id": "56:2", "node_offset": {"x": 104, "y": 210}}, "order_id": "3"}], "image": "https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/b911/69f0/42cade89632c30cce50371aec2f8bbcf", "files": {"id": "56:2", "name": "Test 2", "type": "FRAME", "blendMode": "PASS_THROUGH", "children": [{"id": "224:4", "name": "@lottie=vampire.json", "type": "FRAME", "blendMode": "PASS_THROUGH", "children": [], "absoluteBoundingBox": {"x": 430.0, "y": 112.0, "width": 344.0, "height": 414.0}, "constraints": {"vertical": "TOP", "horizontal": "LEFT"}, "clipsContent": true, "background": [{"blendMode": "NORMAL", "type": "SOLID", "color": {"r": 0.9490196108818054, "g": 0.6000000238418579, "b": 0.29019609093666077, "a": 1.0}}], "backgroundColor": {"r": 0.9490196108818054, "g": 0.6000000238418579, "b": 0.29019609093666077, "a": 1.0}, "styles": {"background": "224:5"}, "effects": []}, {"id": "56:7", "name": "Figma \u2764\ufe0f Lottie", "type": "TEXT", "blendMode": "PASS_THROUGH", "absoluteBoundingBox": {"x": 411.0, "y": 46.0, "width": 382.0, "height": 32.0}, "constraints": {"vertical": "TOP", "horizontal": "LEFT"}, "fills": [{"blendMode": "NORMAL", "type": "SOLID", "color": {"r": 0.0, "g": 0.0, "b": 0.0, "a": 1.0}}], "strokes": [], "strokeWeight": 1.0, "strokeAlign": "OUTSIDE", "effects": [], "characters": "Figma \u2764\ufe0f Lottie", "style": {"fontFamily": "Gilroy-ExtraBold", "fontPostScriptName": null, "fontWeight": 400, "fontSize": 32.0, "textAlignHorizontal": "CENTER", "textAlignVertical": "TOP", "letterSpacing": 0.0, "lineHeightPx": 37.5, "lineHeightPercent": 100.0, "lineHeightUnit": "INTRINSIC_%"}, "characterStyleOverrides": [], "styleOverrideTable": {"2": {"fills": [{"blendMode": "NORMAL", "type": "IMAGE", "scaleMode": "STRETCH", "imageRef": null, "imageTransform": [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]]}]}}}, {"id": "56:8", "name": "EMMA THE VAMPIRE", "type": "TEXT", "blendMode": "PASS_THROUGH", "absoluteBoundingBox": {"x": 447.0, "y": 130.0, "width": 382.0, "height": 32.0}, "constraints": {"vertical": "TOP", "horizontal": "LEFT"}, "fills": [{"blendMode": "NORMAL", "type": "SOLID", "color": {"r": 1.0, "g": 1.0, "b": 1.0, "a": 1.0}}], "strokes": [], "strokeWeight": 1.0, "strokeAlign": "OUTSIDE", "effects": [], "characters": "EMMA THE VAMPIRE", "style": {"fontFamily": "Gilroy-Black", "fontPostScriptName": null, "fontWeight": 400, "fontSize": 16.0, "textAlignHorizontal": "LEFT", "textAlignVertical": "TOP", "letterSpacing": 0.0, "lineHeightPx": 18.75, "lineHeightPercent": 100.0, "lineHeightUnit": "INTRINSIC_%"}, "characterStyleOverrides": [], "styleOverrideTable": {}}, {"id": "56:9", "name": "Vector", "type": "VECTOR", "blendMode": "PASS_THROUGH", "absoluteBoundingBox": {"x": 448.0, "y": 155.0, "width": 28.0, "height": 0.0}, "constraints": {"vertical": "TOP", "horizontal": "LEFT"}, "fills": [], "strokes": [{"blendMode": "NORMAL", "type": "SOLID", "color": {"r": 1.0, "g": 1.0, "b": 1.0, "a": 1.0}}], "strokeWeight": 3.0, "strokeAlign": "CENTER", "effects": []}, {"id": "56:10", "name": "Rectangle", "type": "RECTANGLE", "blendMode": "PASS_THROUGH", "absoluteBoundingBox": {"x": 430.0, "y": 542.0, "width": 344.0, "height": 284.0}, "constraints": {"vertical": "TOP", "horizontal": "LEFT"}, "fills": [{"blendMode": "NORMAL", "type": "GRADIENT_RADIAL", "gradientHandlePositions": [{"x": 0.03052318028272516, "y": 0.05000011737964005}, {"x": 0.6831394665579332, "y": 1.2173913762099797}, {"x": -1.1368680785476144, "y": 1.5098867341663964}], "gradientStops": [{"color": {"r": 0.11956293880939484, "g": 0.5795612335205078, "b": 0.9126637578010559, "a": 1.0}, "position": 0.0}, {"color": {"r": 0.25155889987945557, "g": 0.7399531006813049, "b": 0.847161591053009, "a": 1.0}, "position": 1.0}]}], "strokes": [], "strokeWeight": 1.0, "strokeAlign": "INSIDE", "effects": [], "cornerRadius": 10.0, "rectangleCornerRadii": [10.0, 10.0, 10.0, 10.0]}, {"id": "56:11", "name": "MIKE CROWPHONE", "type": "TEXT", "blendMode": "PASS_THROUGH", "absoluteBoundingBox": {"x": 447.0, "y": 561.0, "width": 382.0, "height": 32.0}, "constraints": {"vertical": "TOP", "horizontal": "LEFT"}, "fills": [{"blendMode": "NORMAL", "type": "SOLID", "color": {"r": 1.0, "g": 1.0, "b": 1.0, "a": 1.0}}], "strokes": [], "strokeWeight": 1.0, "strokeAlign": "OUTSIDE", "effects": [], "characters": "MIKE CROWPHONE", "style": {"fontFamily": "Gilroy-Black", "fontPostScriptName": null, "fontWeight": 400, "fontSize": 16.0, "textAlignHorizontal": "LEFT", "textAlignVertical": "TOP", "letterSpacing": 0.0, "lineHeightPx": 18.75, "lineHeightPercent": 100.0, "lineHeightUnit": "INTRINSIC_%"}, "characterStyleOverrides": [], "styleOverrideTable": {}}, {"id": "56:12", "name": "Vector", "type": "VECTOR", "blendMode": "PASS_THROUGH", "absoluteBoundingBox": {"x": 448.0, "y": 586.0, "width": 28.0, "height": 0.0}, "constraints": {"vertical": "TOP", "horizontal": "LEFT"}, "fills": [], "strokes": [{"blendMode": "NORMAL", "type": "SOLID", "color": {"r": 1.0, "g": 1.0, "b": 1.0, "a": 1.0}}], "strokeWeight": 3.0, "strokeAlign": "CENTER", "effects": []}, {"id": "224:6", "name": "@lottie", "type": "FRAME", "blendMode": "PASS_THROUGH", "children": [], "absoluteBoundingBox": {"x": 638.0, "y": 573.0, "width": 114.0, "height": 75.0}, "constraints": {"vertical": "TOP", "horizontal": "LEFT"}, "clipsContent": true, "background": [{"blendMode": "NORMAL", "type": "SOLID", "color": {"r": 1.0, "g": 0.0, "b": 0.0, "a": 1.0}}], "backgroundColor": {"r": 1.0, "g": 0.0, "b": 0.0, "a": 1.0}, "effects": []}], "absoluteBoundingBox": {"x": 415.0, "y": 0.0, "width": 375.0, "height": 812.0}, "constraints": {"vertical": "TOP", "horizontal": "LEFT"}, "clipsContent": true, "background": [{"blendMode": "NORMAL", "type": "SOLID", "color": {"r": 1.0, "g": 1.0, "b": 1.0, "a": 1.0}}], "backgroundColor": {"r": 1.0, "g": 1.0, "b": 1.0, "a": 1.0}, "effects": []}, "url": "a6ba452d-971e-4130-a805-bb856acbe35c"};
        console.log(url);
        return {err: error};
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
