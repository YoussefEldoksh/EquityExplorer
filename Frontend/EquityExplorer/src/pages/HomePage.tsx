import React from 'react'
import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar'

function HomePage() {
    return (
        <>
            <Navbar isOtherPage={false}></Navbar>
            <HeroSection></HeroSection>
            
        </>
    )
}

export default HomePage