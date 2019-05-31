const loadingLottieFilepath = "/lottie/loading_stairs.json";
const availablePhones = getAvailablePhones();
const container = document.getElementById("preview");
const fullLoading = document.getElementById("full_loading");
const loadingAnimation = displayAnimation(fullLoading, loadingLottieFilepath);

let url = new URL(document.location.href);
const api_url = url.searchParams.get("url");

function hideLoading() {
    loadingAnimation.destroy();
    $(".full_loading").hide();
    $(".heading-2").hide();
    $(".parapgraph").hide();
}

function fetchPreviewCallback(data) {
    let figma_comments = data["comments"];
    let figma_files = data["files"];
    let figma_image = data["image"];
    let animations = data["lottie_files"];

    hideLoading();

    // Set the frame
    const frameImg = setFrame(container);
    const tmp = pickPhoneAndDisplayFrame(container, figma_image, figma_files, frameImg, availablePhones);
    const ratio = tmp[0];
    const frameX = tmp[1];
    const frameY = tmp[2];

    frameImg.onload = function () {
        figma_files.children.forEach(function (object) {
                const objectName = object.name.toLowerCase();
                if (!objectName.startsWith('@lottie')) {
                    return;
                }
                const animationName = getAnimationName(object);
                const width = object.absoluteBoundingBox.width;
                const height = object.absoluteBoundingBox.height;
                const x = parseFloat(object.absoluteBoundingBox.x);
                const y = parseFloat(object.absoluteBoundingBox.y);

                const commentArguments = parseCommentArguments(figma_comments, x, y, width, height, frameX, frameY);

                addAnimation(container, animationName, animations[animationName], width * ratio, height * ratio,
                    frameImg.x + (x - frameX) * ratio,
                    frameImg.y + (y - frameY) * ratio,
                    commentArguments.autoplay, commentArguments.loop, commentArguments.speed);
            }
        );
    }
}

$("#share").click(function(event) {
   event.preventDefault();
    let $link = $(".link-copied");
    $link.css("display", "flex");
    $link.css("opacity", 1);
    copyUrlToClipboard();
    function hide() {
        $link.css("display", "none");
    }
    setTimeout(hide, 3000);
});

fetchPreview(api_url).then(fetchPreviewCallback).catch(function (error) {
    hideLoading();
    let $heading = $(".heading-2");
    $heading.html("Failed to fetch content");
    $heading.css("display", "flex");
    // want to handle?
});