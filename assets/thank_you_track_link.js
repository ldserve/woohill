if (document.querySelectorAll('.tracking-info__number a').length > 0 && document.querySelector('.tracking-info__number a').outerText && (document.querySelector('.tracking-info__number a').outerText != "")) {
document.querySelector('.tracking-info__number a').setAttribute('href','https://t.17track.net/en#nums='+ document.querySelector('.tracking-info__number a').outerText);
}