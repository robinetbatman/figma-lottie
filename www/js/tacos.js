const availablePhones = getAvailablePhones();
const figmaUrlHelper = document.getElementById("figma_url_helper");
const container = document.getElementById("right_column");
const lottieFilesSection = document.getElementById('lottie_files');
const animDiv = document.getElementById("anim");
const submitButton = document.getElementById("figmaLoginButton");
const $refreshButton = $(".refresh");
const $actionContainer = $(".action-container");
const figmaFrameId = 'figmaFrameId';
const phoneImageId = 'phoneImageId';

const ID_FILE_UPLOAD_TEMPLATE = "tacos_anim_upload_template";

let submitDoneOnce = false;
let submitLottieDoneOnce = false;
let session_uuid = undefined;
let api_url = undefined;
let nbJsonUploaded = 0;

let url = new URL(document.location.href);
if (url.searchParams.get("oauth") === 'OK') {
    session_uuid = url.searchParams.get("uuid");
    $(".input-block").css("display", "flex");
    submitButton.value = "Fetch";
    $("#figmaLoginButton").prop("onclick", null).off("click");
}

// Hide helper when input are filled
$('#figma_url').bind('input', function () {
    if ($(this).val().length === 0) {
        figmaUrlHelper.style.visibility = 'visible';
    } else {
        figmaUrlHelper.style.visibility = 'hidden';
    }
});

function showTutorial(){
    $(".tacos_tutorial").show();
}

// Set background animation
const rightAnimation = displayAnimation(animDiv, getLoadingLottiePath());

function refresh() {
    // Clean right column.
    let figmaFrame = document.getElementById(figmaFrameId);
    if(figmaFrame !== null) { container.removeChild(figmaFrame); }
    let phoneImage = document.getElementById(phoneImageId);
    if(phoneImage !== null) { container.removeChild(phoneImage); }
    document.querySelectorAll('[id^="animation_"]').forEach(function (element) {
        if (container.contains(element)) {
            container.removeChild(element);
        }
    });

    // clean lottie files
    lottieFilesSection.innerHTML = "";
    submitLottieDoneOnce = false;
    fetchFigmaFrame();
}

function submitWrapper() {
    let url = new URL(document.location.href);
    if (url.searchParams.get("oauth") !== 'OK') {
        figmaLogin();
    } else {
        if (!submitDoneOnce) {
            fetchFigmaFrame();
            submitDoneOnce = true;
        } else {
            submitLottie();
        }
    }
}

function handleFail(show) {
    let display = $(".form_fail");
    show ? display.show() : display.hide();
}

// create file upload
function addInput(animationName, width, ratio, height, frameImg, x, frameX, y, frameY, commentArguments) {
    let file_upload = document.getElementById(ID_FILE_UPLOAD_TEMPLATE);
    let clone = file_upload.cloneNode(true);
    clone.setAttribute("id", "tacos_lottie_upload_" + animationName);
    clone.style.display = "flex";
    let input = clone.querySelector('.lottie_file_input');
    input.id = 'input_' + animationName;
    input.name = animationName;
    clone.querySelector('.lottie_file_input_name').innerHTML = "Upload " + animationName;
    clone.onclick = function () {
        input.click();
    };
    clone.appendChild(input);
    lottieFilesSection.appendChild(clone);

    let remove = clone.querySelector('.delete-animation');

    input.onchange = function () {
        // document.getElementById(div2.id).innerHTML = animationName;
        this.parentElement.querySelector('.lottie_file_input_name').innerHTML = animationName;

        // Add Lottie file preview
        function onReaderLoad(event) {
            const animationData = JSON.parse(event.target.result);

            let existed = deleteAnimationIfExists(animationName);
            addAnimation(container, animationName, animationData, width * ratio, height * ratio,
                frameImg.x - container.getBoundingClientRect().left + (x - frameX) * ratio,
                frameImg.y + (y - frameY) * ratio,
                commentArguments.autoplay, commentArguments.loop, commentArguments.speed);

            remove.style.display = 'flex';

            // If all animations added, show the preview button
            if (!existed) {
                nbJsonUploaded += 1;
            }

            if (lottieFilesSection.children.length === nbJsonUploaded) {
                $actionContainer.css("display", "flex");
            }
        }

        const reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
    };

    remove.onclick = function () {
        nbJsonUploaded -= 1;
        let parentNode = this.parentNode;
        let animationName = parentNode.id.replace("tacos_lottie_upload_", "");
        deleteAnimationIfExists(animationName);
        parentNode.parentNode.removeChild(parentNode);
        addInput(animationName, width, ratio, height, frameImg, x, frameX, y, frameY, commentArguments, nbJsonUploaded);
    };
}

function fetchFigmaFrame() {
    // Prevent multiple clicks
    submitButton.disabled = true;

    handleFail(false);

    // Start loading animation
    if (container.contains(animDiv)) {
        rightAnimation.destroy();
        container.removeChild(animDiv);
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.style.width = "100%";
    loadingDiv.style.height = "100%";
    loadingDiv.id = 'loading';
    container.appendChild(loadingDiv);

    const loadingAnimation = displayAnimation(loadingDiv, getLoadingLottiePath());

    // Change appearance of Fetch button.
    submitButton.value = 'Fetching...';
    submitButton.style.backgroundColor = 'grey';

    const figmaUrl = document.getElementById('figma_url').value;

    getAll(figmaUrl, session_uuid).then(function (data) {
        let figma_comments = data["comments"];
        let figma_files = data["files"];
        let figma_image = data["image"];
        api_url = data["url"];

        // Clear animation
        loadingAnimation.destroy();
        container.removeChild(loadingDiv);

        // Make refresh button visible
        $refreshButton.css("display", "flex");

        // Set the frame
        const frameImg = setFrame(container, figmaFrameId);

        // Until all json are uploaded, hide preview button
        $actionContainer.hide();

        const tmp = pickPhoneAndDisplayFrame(container, figma_image, figma_files, frameImg, availablePhones, phoneImageId);
        const ratio = tmp[0];
        const frameX = tmp[1];
        const frameY = tmp[2];

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

            addInput(animationName, width, ratio, height, frameImg, x, frameX, y, frameY, commentArguments);
        });

        lottieFilesSection.style.display = "flex";

        // Hide submit button
        submitButton.style.display = 'none';
    }).catch(function(error) {
        console.error(error);
        alert("Failed to fetch the specified content");
        submitButton.value = "Fetch";
        submitButton.style.backgroundColor = "#f36";
        handleFail(true);
    });
}

function submitLottieAction(successCallback, errorCallback) {
    let form = $('#form')[0];
    let data = new FormData(form);
    $("#submit_button").prop("disabled", true);

    postLottie(data, api_url, successCallback, errorCallback);
}

// actions

function submitLottie() {
    submitLottieAction(function (data) {
        window.location = "preview.html?url=" + api_url;
    }, function (error) {
        console.error(error);
    })
}

function share() {
    function success(){
        submitLottieDoneOnce = true;
        let $link = $(".link-copied");
        $link.css("display", "flex");
        $link.css("opacity", 1);
        copyShareUrlToClipboard(api_url);
        function hide() {
            $link.css("display", "none");
        }
        setTimeout(hide, 3000);
    }

    if(submitLottieDoneOnce) {
        success();
    } else {
        submitLottieAction(success, function(){ /* handle error */ });
    }
}

function switchAccount() {
    figmaLogin();
}