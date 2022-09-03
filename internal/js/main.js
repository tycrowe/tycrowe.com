let logoFadeOutTime = 600;
let logoOnFocus = null;
let isLogoAnimating = false;
let logos = {};

let technologyButtonTooltipHTML = ""

function getLogoFile(id) {
    console.log(id);
    return fetch('../logo-files/' + id + '.html')
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                return "No contributions added, check back later!"
            }
        });
}

/**
 * Iterates through all page logos, building our array of logo objects.
 * This is used to create the centered animation that then opens a background of knowledge
 * into the specific language for me :)
 */
function setupLogos() {
    $('img.logo').each(function (i, obj) {
        logos[obj.id] = {
            'this': this,
            'toggled': false,
            'logoText': obj.alt,
            'group': this.dataset.group
        }
        $(this).click(function () {
            if (logoOnFocus === null) {
                logos[obj.id].toggled = true;
                $.each(logos, function (k, v) {
                    if (k !== obj.id && v.group === logos[obj.id].group) {
                        $(v.this).animate({opacity: 0}, logoFadeOutTime);
                    }
                });
                $('#logo-block-subtitle-' + logos[obj.id].group).fadeOut(function() {
                    let subtitleBlockBe = $('#logo-block-subtitle-' + logos[obj.id].group);
                    subtitleBlockBe.text(logos[obj.id].logoText).fadeIn();
                    subtitleBlockBe.append("<div style=\"display: none;\"></div>");
                    let subtitleBlockInfoBe = $('#logo-block-subtitle-' + logos[obj.id].group + ' div');
                    getLogoFile(obj.id).then((data) => {
                        subtitleBlockInfoBe.html(data);
                    });
                    subtitleBlockInfoBe.fadeIn();
                });
                setTimeout(function () {
                    let logoParentContainer = $(logos[obj.id].this).parent();
                    let bb = $(logos[obj.id].this).position();
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $(logos[obj.id].this).parent().prev('.parallax-component').offset().top
                    }, logoFadeOutTime);
                    logos[obj.id].lastPos = $(logos[obj.id].this).position();
                    $(logos[obj.id].this).css({left: bb.left, position: 'absolute', top: bb.top});
                    $(logos[obj.id].this).animate({
                        top: 0,
                        left: $(logos[obj.id].this).parent().width() / 2 - $(logos[obj.id].this).width() / 2
                    }, logoFadeOutTime);
                    if (logoParentContainer) {
                        logos[obj.id].parentHeight = $(logoParentContainer).height();
                        $(logoParentContainer).animate({
                            height: $(logos[obj.id].this).height() + 10
                        }, logoFadeOutTime);
                    }
                    logoOnFocus = logos[obj.id];
                }, logoFadeOutTime + 5);
            }
        });
    });
}

// let floatingImages = {};
//
// function setupFloatingImages() {
//     $('#scroll-screen img.floating-image').each(function (i, obj) {
//         floatingImages['floating-image-' + i] = {
//             'this': this,
//             'dX': $(this).data('x'),
//             'dY': $(this).data('y'),
//             'scrubbing': 20
//         }
//         if ($(this).data('scrubbing')) {
//             floatingImages['floating-image-' + i].scrubbing = $(this).data('scrubbing');
//         }
//         // Set the position based fed dataset properties: x and y (relative to its current parent)
//         $(this).css({
//             left: $(this).position().left + (floatingImages['floating-image-' + i].dX),
//             top: $(this).position().top + (floatingImages['floating-image-' + i].dY)
//         });
//         floatingImages['floating-image-' + i].pos = $(this).position();
//     });
//     console.log(floatingImages);
// }
//
// let lastScrollTop = 0;
//
// function scrubFloatingImages() {
//     let scrollYAmountBe = $(window).scrollTop();
//     if (Math.round(scrollYAmountBe) % 2 === 0) {
//         $(floatingImages).each(function (i, obj) {
//             let tempObjBe = floatingImages['floating-image-' + i]
//             if (scrollYAmountBe > lastScrollTop) {
//                 // down
//                 $(tempObjBe.this).css({
//                     top: tempObjBe.pos.top + tempObjBe.scrubbing
//                 });
//             } else {
//                 // up
//                 $(tempObjBe.this).css({
//                     top: tempObjBe.pos.top - tempObjBe.scrubbing
//                 });
//             }
//             tempObjBe.pos = $(tempObjBe.this).position();
//         });
//         lastScrollTop = scrollYAmountBe <= 0 ? 0 : scrollYAmountBe;
//     }
// }

function resetFocusedLogo() {
    isLogoAnimating = true;
    $(logoOnFocus.this).animate({
        left: logoOnFocus.lastPos.left,
        top: logoOnFocus.lastPos.top
    }, logoFadeOutTime);
    $('#logo-block-subtitle-' + logoOnFocus.group).fadeOut(function() {
        $('#logo-block-subtitle-' + logoOnFocus.group).text("Click on any logo above to see associated projects").fadeIn();
        let subtitleBlockInfoBe = $('#logo-block-subtitle-' + logoOnFocus.group + ' div');
        $([document.documentElement, document.body]).animate({
            scrollTop: $(logoOnFocus.this).parent().prev('.parallax-component').offset().top
        }, 500);
        subtitleBlockInfoBe.fadeOut(800);
    });
    let logoFocusParent = $(logoOnFocus.this).parent();
    if (logoFocusParent) {
        $(logoFocusParent).animate({
            height: logoOnFocus.parentHeight
        }, logoFadeOutTime);
        $('#logo-block-subtitle-' + logoOnFocus.group + ' div').fadeOut();
    }
    setTimeout(function () {
        logoOnFocus.this.style = '';
        $.each(logos, function (k, v) {
            $(v.this).animate({opacity: 1}, logoFadeOutTime);
        });
        setTimeout(function () {
            logoOnFocus = null;
            isLogoAnimating = false;
        }, 200);
    }, logoFadeOutTime + 250);
}

$(window).click(function () {
    if (logoOnFocus !== null && !isLogoAnimating) {
        resetFocusedLogo();
    }
});

$(window).resize(function() {
    if (logoOnFocus !== null && !isLogoAnimating) {
        resetFocusedLogo();
    }
});

$(window).scroll(function () {});

buildBlinkingCursors();
buildTypedTexts();
typeText();
canvasedCursors['typed-text-one-cursor'].typedObject = typedObjects['typed-text-one'];
typedObjects['typed-text-one'].canvasedCursor = canvasedCursors['typed-text-one-cursor'];
setupLogos();

let toastElList = [].slice.call(document.querySelectorAll('.toast'))
let toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
})
