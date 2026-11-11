import { useState, useEffect } from 'react'

export function usePreviewScale() {
    const [scale, setScale] = useState(1)

    useEffect(() => {
        const calculateScale = () => {
            const windowRatio = window.innerWidth / window.innerHeight
            const slideRatio = 1000 / 562
            
            if (windowRatio > slideRatio) {
                setScale(window.innerHeight / 562)
            } else {
                setScale(window.innerWidth / 1000)
            }
        }

        calculateScale()
        window.addEventListener('resize', calculateScale)
        return () => window.removeEventListener('resize', calculateScale)
    }, [])

    return scale
}