function displayAnimation(container, loading_lottie_filepath) {
    return bodymovin.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: loading_lottie_filepath
    });
}

function copyUrlToClipboard() {
    return copyToClipboard(window.location.href);
}

function copyShareUrlToClipboard(urlToken) {
    let url = window.location.origin + '/preview.html?url=' + urlToken;
    return copyToClipboard(url);
}

function copyToClipboard(url) {
    const tmp = document.createElement('textarea');
    tmp.value = url;
    tmp.setAttribute('readonly', '');
    tmp.style.position = 'absolute';
    tmp.style.left = '-9999px';
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
}

function setFrame(container, figmaFrameId) {
    const img = document.createElement('img');
    img.id = figmaFrameId;
    img.setAttribute("style", "position:absolute;z-index:1;");
    container.appendChild(img);
    return img;
}

function getAnimationName(object) {
    const objectName = object.name.toLowerCase();
    if (!objectName.includes('=')) {
        return "object_id_" + object.id;
    }
    return objectName.split('=')[1];
}

function pickPhoneAndDisplayFrame(container, apiResponseImage, apiResponseFiles, frame_img, available_phones, phoneImageId = 'phoneImageId') {
    const frame_figma_content = apiResponseFiles;
    const frameX = parseFloat(frame_figma_content.absoluteBoundingBox.x);
    const frameY = parseFloat(frame_figma_content.absoluteBoundingBox.y);
    const frameWidth = parseFloat(frame_figma_content.absoluteBoundingBox.width);
    const frameHeight = parseFloat(frame_figma_content.absoluteBoundingBox.height);

    let ratio = 0;

    // Check which phone image to display around the frame
    for (let key in available_phones) {
        if (!available_phones.hasOwnProperty(key)) {
            continue;
        }
        let available_phone = available_phones[key];
        // The appropriate phone must have the same size as the frame's
        if (available_phone['width'] !== frameWidth ||
            available_phone['height'] !== frameHeight) {
            continue;
        }

        let phone_image = document.createElement('img');
        phone_image.id = phoneImageId;
        phone_image.setAttribute("style", "position:absolute;z-index:30;");
        phone_image.src = available_phone['src'];

        const phone_height = window.innerHeight * 0.8;
        ratio = phone_height / available_phone['display_height'];
        phone_image.style.height = phone_height + "px";
        container.appendChild(phone_image);

        // The image is only displayed here, so that it does not load before the phone is shown
        let img_height = frameHeight * ratio;
        // frame_img.src = apiResponseImage.images[nodeId];
        frame_img.src = apiResponseImage;
        frame_img.style.height = img_height + "px";
        frame_img.style.zIndex = "10px";

        break;
    }

    // If no phone has been found, set the image to normal size.
    if (ratio === 0) {
        // frame_img.src = apiResponseImage.images[nodeId];
        frame_img.src = apiResponseImage;
        ratio = 1;
    }

    return [ratio, frameX, frameY];
}

function deleteAnimationIfExists(animationName) {
    // uses this selector to handle complicated named
    let $1 = $('[id="animation_' + animationName + '"]');
    let exists = $1.length > 0;
    $1.remove();
    return exists;
}

function addAnimation(container, animationName, animationData, width, height, left, top, autoplay, loop, speed) {
    const div = document.createElement('div');
    div.id = 'animation_' + animationName;
    //div.setAttribute("style", "z-index:20;");
    div.setAttribute("style", "position:absolute;"
        + "width:" + width + "px;height:" + height + "px;left:" + left + "px;top:" + top + "px;" + "z-index:20;");

    container.appendChild(div);
    const anim = bodymovin.loadAnimation({
        container: div,
        renderer: 'svg',
        animationData: animationData
    });
    anim.autoplay = autoplay;
    anim.loop = loop;
    anim.setSpeed(speed);
}

function parseCommentArguments(comments, animationX, animationY, animationWidth, animationHeight, frameX, frameY) {
    let autoplay = true;
    let loop = true;
    let speed = 1;

    comments.forEach(function (comment) {
        const commentPosition = comment.client_meta.node_offset;
        if ((animationX <= commentPosition.x + frameX) &&
            (commentPosition.x + frameX <= animationX + animationWidth) &&
            (animationY <= commentPosition.y + frameY) &&
            (commentPosition.y + frameY <= animationY + animationHeight)) {
            try {
                const commentJson = JSON.parse(comment.message);
                if (commentJson.hasOwnProperty('arguments')) {
                    const arguments = commentJson.arguments;
                    if (arguments.hasOwnProperty('loop')) {
                        loop = arguments.loop;
                    }
                    if (arguments.hasOwnProperty('autoplay')) {
                        autoplay = arguments.autoplay;
                    }
                    if (arguments.hasOwnProperty('speed')) {
                        speed = arguments.speed;
                    }
                }
            } catch (e) {
                console.error(e);
            }

        }
    });

    return {
        "autoplay": autoplay,
        "loop": loop,
        "speed": speed,
    };
}

function getAvailablePhones() {
    return {
        "iphone_x": {
            "width": 375,
            "height": 812,
            "display_width": 441,
            "display_height": 871,
            "src": "/phones/iphone_x.png"
        },
        "iphone_8": {
            "width": 375,
            "height": 667,
            "display_width": 460,
            "display_height": 900,
            "src": "/phones/iphone_8.png"
        },
        "pixel_3_xl": {
            "width": 412,
            "height": 847,
            "display_width": 570,
            "display_height": 1083,
            "src": "/phones/pixel_3_xl.png"
        },
        "samsung_galaxy": {
            "width": 360,
            "height": 740,
            "display_width": 450,
            "display_height": 850,
            "src": "/phones/samsung_galaxy.png"
        }
    };
}
