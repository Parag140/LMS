import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CourseSection from '../../components/student/CourseSection'
import TestimonialsSections from '../../components/student/TestimonialsSections'
import CallTOAction from '../../components/student/CallTOAction'
import Footer from '../../components/student/Footer'

const Home = () => {
  return (
    // Light blue gradient (soft and consistent across the page)
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-200 via-blue-100 to-white">
      <div className="flex flex-col items-center text-center">
        <Hero />
        <Companies />
        <CourseSection />
        <TestimonialsSections />
        <CallTOAction />
        <Footer />
      </div>
    </div>
  )
}

export default Home