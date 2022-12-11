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
        window.addEventListener("load", () => observe_images(el));
    },
    updated: function(el) {
        observe_images(el);
    },
};
