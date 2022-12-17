// https://css-tricks.com/lazy-loading-images-with-vue-js-directives-and-intersection-observer/
function observe_images(el) {
    const observer = new IntersectionObserver((entries, observer) => {
        // we only expect one observer as we apply it directly to the image tag!
        if (entries[0].isIntersecting) {
            entries[0].target.srcset = entries[0].target.dataset.srcset;
            observer.unobserve(el);
        }
    }, {
        root: null,
        threshold: "0"
    });
    observer.observe(el);
}

export default {
    created: function(el) {
        if (document.readyState == "interactive") {
            // the page has not loaded and the data is pulled from localstorage
            window.addEventListener("load", () => observe_images(el));
        } else {
            window.addEventListener("streaming-list-update", () => observe_images(el));
        }        
    },
    mounted: function(el) {
        if (document.readyState == "complete") { observe_images(el); }
    },
    updated: function(el) {
        if (document.readyState == "complete") { observe_images(el); }
    },
    unmounted: function() {
        window.removeEventListener("streaming-list-update", () => observe_images(el));
        window.removeEventListener("load", () => observe_images(el));
    }
};
