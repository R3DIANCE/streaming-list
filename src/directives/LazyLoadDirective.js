// https://css-tricks.com/lazy-loading-images-with-vue-js-directives-and-intersection-observer/
const options = {
    root: null,
    threshold: "0"
};

export default {
    mounted: function(el) {
        const observer = new IntersectionObserver((entries, observer) => {
            // we only expect one observer as we apply it directly to the image tag!
            if (entries[0].isIntersecting) {
                entries[0].target.srcset = entries[0].target.dataset.srcset;
                observer.unobserve(el);
            }
        }, options);
        observer.observe(el);
    },
    updated: function(el) {
        const observer = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                entries[0].target.srcset = entries[0].target.dataset.srcset;
                observer.unobserve(el);
            }
        }, options);
        observer.observe(el);
    },
};
