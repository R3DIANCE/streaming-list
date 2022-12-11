// https://css-tricks.com/lazy-loading-images-with-vue-js-directives-and-intersection-observer/
function loadImage(target) {
    const imageElement = Array.from(target.children).find(
        (el) => el.nodeName === "IMG"
    );
    if (imageElement) {
        imageElement.addEventListener("error", (error) =>
            console.log("image error")
        );
        imageElement.srcset = imageElement.dataset.srcset;
    }
}

const options = {
    root: null,
    threshold: "0",
};

export default {
    mounted: function(el) {
        function handleIntersect(entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(el);
                }
            });
        }

        const observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(el);
    },
    updated: function(el) {
        function handleIntersect(entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(el);
                }
            });
        }

        const observer = new IntersectionObserver(handleIntersect, options);
        observer.observe(el);
    },
};
