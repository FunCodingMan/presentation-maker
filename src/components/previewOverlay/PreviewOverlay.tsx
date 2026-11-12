import type { Slide } from '../../model/types/slide.js'
import { SlideView } from '../slideView/SlideView.js'
import { Button } from '../common/button/Button.js'
import { usePreviewScale } from './customHooks/usePreviewScale.js'
import { usePreviewNavigation } from './customHooks/usePreviewNavigation.js'
import styles from './PreviewOverlay.module.css'

type PreviewOverlayProps = {
    slides: Slide[]
    activeSlideId: string | null
    onPrevSlide: () => void
    onNextSlide: () => void
    onClose: () => void
}

function PreviewOverlay({ slides, activeSlideId, onClose, onNextSlide, onPrevSlide }: PreviewOverlayProps) {
    let currentIndex = slides.findIndex((slide) => slide.id === activeSlideId)
    if (currentIndex === -1) {
        currentIndex = 0
    }
    const currentSlide = slides[currentIndex]

    const scale = usePreviewScale()
    usePreviewNavigation({ onNextSlide, onPrevSlide, onClose })

    return (
        // По клику на черный фон или сам слайд — переключаем вперед
        <div className={styles.overlay} onClick={onNextSlide}>
            
            {/* Обертка-ловушка для наведения курсора внизу экрана */}
            <div className={styles.controlsArea}>
                
                {/* Остановка всплытия клика, чтобы при нажатии на кнопки слайд не переключался */}
                <div className={styles.controls} onClick={(e) => e.stopPropagation()}>
                    <Button text="◄ Назад" onClick={onPrevSlide} />
                    
                    <span className={styles.counter}>
                        {currentIndex + 1} / {slides.length}
                    </span>
                    
                    <Button text="Далее ►" onClick={onNextSlide} />
                    <Button text="✕ Выход" onClick={onClose} className={styles.closeBtn} />
                </div>
            </div>

            <div 
                className={styles.scaleWrapper} 
                style={{ transform: `scale(${scale})` }}
            >
                {currentSlide && <SlideView slide={currentSlide} readonly={true} />}
            </div>
        </div>
    )
}

export { PreviewOverlay }