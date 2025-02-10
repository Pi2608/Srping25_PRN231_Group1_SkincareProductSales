import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { TestimonialsData } from '../../../../data/testimonials'
import './Review.css'

const Review = () => {

  return (
    <div id='reviews'>
        
        <p className='tittle'>Customers says</p>

        <div className='review-container'>
            <Swiper
                slidesPerView={3}
                slidesPerGroup={1}
                spaceBetween={20}
                className='swiper'
            >
                {
                    TestimonialsData.map((testimonial, i) => (
                        <SwiperSlide key={i}>
                            <div className='review'>
                                <img 
                                className='img'
                                src={testimonial.image} 
                                alt="" 
                                />
                                <span className='comment'>{testimonial.comment}</span>
                                <hr />
                                <span className='name'>{testimonial.name}</span>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    </div>
  )
}

export default Review