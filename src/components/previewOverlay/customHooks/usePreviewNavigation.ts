import { useEffect } from 'react'

type UsePreviewNavigationProps = {
    onNextSlide: () => void
    onPrevSlide: () => void
    onClose: () => void
}

export function usePreviewNavigation({ onNextSlide, onPrevSlide, onClose }: UsePreviewNavigationProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
                onNextSlide()
            } else if (e.key === 'ArrowLeft') {
                onPrevSlide()
            } else if (e.key === 'Escape') {
                onClose()
            }
        }

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    }, [onNextSlide, onPrevSlide, onClose])
}