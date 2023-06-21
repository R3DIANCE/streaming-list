// https://css-tricks.com/lazy-loading-images-with-vue-js-directives-and-intersection-observer/
function observe_images(el: HTMLElement): void {
    const observer = new IntersectionObserver(
        (
            entries: IntersectionObserverEntry[],
            observer: IntersectionObserver
        ) => {
            // we only expect one observer as we apply it directly to the image tag!
            if (entries[0].isIntersecting) {
                ;(entries[0].target as HTMLImageElement).srcset = (
                    entries[0].target as HTMLImageElement
                ).dataset.srcset!
                observer.unobserve(el)
            }
        },
        {
            root: null,
            threshold: 0,
        }
    )
    observer.observe(el)
}

export default {
    mounted(el: HTMLElement): void {
        if (document.readyState === "complete") {
            observe_images(el)
        }
    },
    updated(el: HTMLElement): void {
        observe_images(el)
    },
    unmounted(): void {
        window.removeEventListener("load", () => observe_images)
    },
}
