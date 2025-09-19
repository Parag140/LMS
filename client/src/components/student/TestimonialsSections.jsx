import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";
import { motion } from "framer-motion";

const TestimonialsSections = () => {
  return (
    <div className="relative pb-14 px-8 md:px-0 from-cyan-100/70 overflow-hidden">
      
      {/* Floating glow particles for virtual feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2  rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%', 
              opacity: 0.3 
            }}
            animate={{ 
              y: [null, -25, 0],
              opacity: [0.3, 0.8, 0.3] 
            }}
            transition={{ 
              duration: 5 + Math.random() * 4, 
              repeat: Infinity, 
              delay: Math.random() * 2 
            }}
          />
        ))}
      </div>

      {/* Heading */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 relative z-10"
      >
        Testimonials
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
        className="md:text-base text-gray-700 mt-3 relative z-10"
      >
        Hear from our learners as they share their journeys of transformation,
        success, and how our <br className="hidden md:block" />
        platform has made a difference in their lives.
      </motion.p>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-auto gap-8 mt-14 relative z-10">
        {dummyTestimonial.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-sm text-left border border-gray-300/30 rounded-lg shadow-lg shadow-blue-500/10 
                       bg-white/80 backdrop-blur-lg hover:shadow-blue-500/30 transition-all duration-500 overflow-hidden"
          >
            {/* Top Card Header */}
            <div className="flex items-center gap-4 px-5 py-4 bg-white/40 backdrop-blur-sm border-b border-gray-200/40">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="h-12 w-12 rounded-full border border-gray-200"
              />
              <div>
                <h1 className="font-semibold text-gray-800">{testimonial.name}</h1>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
            
            {/* Rating + Feedback */}
            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                    alt="star"
                    className="h-5"
                  />
                ))}
              </div>
              <p className="text-gray-600 mt-5 leading-relaxed">{testimonial.feedback}</p>
            </div>

            {/* Read more */}
            <a 
              href="#" 
              className="text-blue-600 underline px-5 hover:text-purple-500 transition-all duration-300"
            >
              Read more
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSections;