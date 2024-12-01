"use strict";

document.addEventListener("DOMContentLoaded", function() {
    var lastScrollTop = 0;
    var header = document.getElementById('header');

    window.addEventListener("scroll", function() {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop){
            // downscroll
            header.classList.add('hidden');
        } else {
            // upscroll
            header.classList.remove('hidden');
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }, false);
});
