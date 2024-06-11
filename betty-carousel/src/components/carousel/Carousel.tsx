import React, { useRef, useEffect, useState } from 'react';
import './Carousel.css';

interface CarouselProps {
    images: string[];
}

const ITEMS_PER_LOAD = 16;
const BUFFER_SIZE = ITEMS_PER_LOAD / 1.3;
const ITEM_WIDTH = 220;//document.getElementsByClassName('carousel-item')[0].wi

const Carousel: React.FC<CarouselProps> = ({ images }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [displayedImages, setDisplayedImages] = useState<string[]>([]);
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchData = async (start: number, end: number): Promise<string[]> => {
        setIsLoading(true);
        const data = images.slice(start, end);
        // Simulate delay from API
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsLoading(false);
        return data;
    }

    const loadElements = async () => {
        if (displayedImages.length === 0) {
            const images = await fetchData(0, ITEMS_PER_LOAD);
            setDisplayedImages(images);
            return;
        }
        const nextRangeStart = displayedImages.length;
        const nextRangeEnd = displayedImages.length + ITEMS_PER_LOAD;
        const newData = await fetchData(nextRangeStart, nextRangeEnd);
        setDisplayedImages(prevImages => [...prevImages, ...newData]);
    };

    useEffect(() => {
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
            // If scroll reaches the threshold, get more data, so the user
            // doesn't see loader or any disruption with the scroll flow for better UX
            const { scrollLeft, scrollWidth, clientWidth } = carouselElement;
            if (scrollWidth - scrollLeft - clientWidth <= BUFFER_SIZE * ITEM_WIDTH && !isLoading) {
                loadElements();
            }
        }
    }, [scrollPosition, images]);

    return (
        <div className="carousel-container">
            {isLoading && <div>loading...</div>}
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