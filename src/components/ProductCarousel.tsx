import { useState, useEffect, useRef } from "react";
import { Carousel, Image } from "react-bootstrap";


interface Props {
    images: string[];
    height?: number;
}

const ProductCarousel = ({ images, height = 600 }: Props) => {
    const [index, setIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        function onMouseMove(e: MouseEvent) {
            const activeImage = carousel!.querySelector<HTMLImageElement>(".carousel-item.active img");
            if (!activeImage) return;

            const rect = carousel!.getBoundingClientRect();
            const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
            const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

            activeImage.style.transition = "transform 0.3s ease";
            activeImage.style.transform = "scale(2)";
            activeImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        }

        function onMouseLeave() {
            const activeImage = carousel!.querySelector<HTMLImageElement>(".carousel-item.active img");
            if (!activeImage) return;

            activeImage.style.transform = "scale(1)";
            activeImage.style.transformOrigin = "center center";
        }

        carousel!.addEventListener("mousemove", onMouseMove);
        carousel!.addEventListener("mouseleave", onMouseLeave);

        return () => {
            carousel!.removeEventListener("mousemove", onMouseMove);
            carousel!.removeEventListener("mouseleave", onMouseLeave);
        };
    }, []);

    if (!images || images.length === 0) return null;

    return (
        <div ref={carouselRef}>
            <Carousel
                activeIndex={index}
                onSelect={setIndex}
                interval={null}

            >
                {images.map((url, idx) => (
                    <Carousel.Item key={idx}>
                        <Image
                            src={url}
                            alt={`Product image ${idx + 1}`}
                            fluid
                            style={{ height, objectFit: "contain", width: "100%" }}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default ProductCarousel;
