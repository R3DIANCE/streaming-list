// https://css-tricks.com/lazy-loading-images-with-vue-js-directives-and-intersection-observer/
function loadImage(target) {
    if (target) {
        target.addEventListener("error", (error) =>
            console.log("image error")
        );
        target.srcset = target.dataset.srcset;
    }
}

const options = {
    root: null,
    threshold: "0",
};

export default {
    mounted: function(el) {
        function handleIntersect(entries, observer) {
            // we only expect one observer as we apply it directly to the image tag!
            if (entries[0].isIntersecting) {
                loadImage(entries[0].target);
                observer.unobserve(el);
            }
        }

        const observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(el);
    },
    updated: function(el) {
        function handleIntersect(entries, observer) {
            if (entries[0].isIntersecting) {
                loadImage(entries[0].target);
                observer.unobserve(el);
            }
        }

        const observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(el);
    },
};
