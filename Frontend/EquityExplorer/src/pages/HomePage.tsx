import React from 'react'
import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function HomePage() {
    return (
        <>
            <Navbar isOtherPage={false}></Navbar>
            <HeroSection></HeroSection>
            <Footer></Footer>
        </>
    )
}

export default HomePage