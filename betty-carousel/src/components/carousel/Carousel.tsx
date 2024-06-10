import React, { useRef, useEffect, useState } from 'react';
import './Carousel.css';

interface CarouselProps {
    images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [displayedImages, setDisplayedImages] = useState<string[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        setDisplayedImages([...images, ...images, ...images]);

        const carouselElement = carouselRef.current;

        const handleWheel = (event: WheelEvent) => {
            if (carouselElement) {
                const { deltaY } = event;
                const scrollSpeed = 2.5; // Increase this value to make scrolling faster

                // Scroll the carousel
                carouselElement.scrollLeft += deltaY * scrollSpeed;
                setScrollPosition(carouselElement.scrollLeft);
            }
        };

        if (carouselElement) {
            carouselElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, [images]);

    useEffect(() => {
        const carouselElement = carouselRef.current;

        if (carouselElement) {
            const maxScrollLeft = carouselElement.scrollWidth - carouselElement.clientWidth;

            // If scroll reaches near the end, append images to the beginning
            if (scrollPosition >= maxScrollLeft - carouselElement.clientWidth) {
                setDisplayedImages((prevImages) => [...prevImages, ...images]);
            }
        }
    }, [scrollPosition, images]);

    return (
        <div className="carousel-container">
            <div
                className="carousel"
                ref={carouselRef}
                style={{ display: 'grid', gridAutoFlow: 'column' }}
            >
                {displayedImages.map((image, index) => (
                    <div className="carousel-item" key={index}>
                        <img src={image} alt={`carousel-item-${index}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;