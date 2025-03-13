import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const Banner = () => {
    return (
        <Carousel
            responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={3000}
            infinite={true}
            showDots={true}
            className='relative z-0'
        >
            <div>
                <img src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp" alt="Banner 1" className="w-full"/>
            </div>
            <div>
                <img src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp" alt="Banner 2" />
            </div>
            <div>
                <img src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp" alt="Banner 3" />
            </div>
            <div>
                <img src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp" alt="Banner 4" />
            </div>
        </Carousel>
    );
};

export default Banner;