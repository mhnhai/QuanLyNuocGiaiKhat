import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import banner1 from '../banner/banner1.png';
import banner2 from '../banner/banner2.png';
import banner3 from '../banner/banner3.png';

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
        <div className="container mx-auto px-4">
            <Carousel
                responsive={responsive}
                autoPlay={true}
                autoPlaySpeed={3000}
                infinite={true}
                showDots={true}
                className='relative z-0'
            >
                <div>
                    <img src={banner1} alt="Banner 1" className="w-full h-[500px] object-contain"/>
                </div>
                <div>
                    <img src={banner2} alt="Banner 2" className="w-full h-[500px] object-contain"/>
                </div>
                <div>
                    <img src={banner3} alt="Banner 3" className="w-full h-[500px] object-contain"/>
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;