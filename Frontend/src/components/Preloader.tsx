import React from 'react'
import { motion } from 'framer-motion';

function Preloader(OginalComponent: React.ComponentType) {
    return (
        <>
            <OginalComponent />
            <motion.div
                initial={{ scaleY: 0}}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 1 }}
                transition={{ duration: 1, ease: [0.22,1,0.36,1] }}
                className='bg-orange-200 '
            >

            </motion.div>

            <motion.div
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 1, ease: [0.22,1,0.36,1], delay: 1.5 }}
                className='bg-orange-200 fixed inset-0 z-50'
            >
            </motion.div>
        </>
    )
}

export default Preloader
