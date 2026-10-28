import type { Presentation } from '../../model/types/presentation.js'
import { SlideView } from '../slideView/SlideView.js'
import { Button } from '../common/button/Button.js'
import { Slide } from '../../model/types/slide.js'
import styles from './PreviewOverlay.module.css'


type PreviewOverlayProps = {
    slides: Slide[]
    activeSlideId: string | null
    onPrevSlide: () => void
    onNextSlide: () => void
    onClose: () => void
}

function PreviewOverlay({ slides, activeSlideId, onClose, onNextSlide, onPrevSlide }: PreviewOverlayProps) {
    let currentIndex = slides.findIndex(
        (slide) => slide.id === activeSlideId
    )
    if (currentIndex === -1) {
        currentIndex = 0
    }
    const currentSlide = slides[currentIndex]

    return (
        <div className={styles.overlay}>
            <div className={styles.controls}>
                <Button text="Назад" onClick={onPrevSlide} />
                
                <span className={styles.counter}>
                    {currentIndex + 1} / {slides.length}
                </span>
                
                <Button text="Далее" onClick={onNextSlide} />
                <Button text="✕ Закрыть" onClick={onClose} className={styles.closeBtn} />
            </div>

            <div className={styles.slideContainer}>
                <div className={styles.scaleWrapper}>
                    {currentSlide && <SlideView slide={currentSlide} readonly={true} />}
                </div>
            </div>
        </div>
    )
}

export { PreviewOverlay }