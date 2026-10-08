import type { Presentation } from '../model/types/presentation.js';
import { SlidePreview } from '../SlidePreview/SlidePreview.js';
import { Button } from '../Common/Button/Button.js';
import styles from './PreviewOverlay.module.css';

type PreviewOverlayProps = {
    presentation: Presentation
    activeSlideId: string | null
    onPrevSlide: () => void
    onNextSlide: () => void
    onClose: () => void
};

function PreviewOverlay({ presentation, activeSlideId, onClose, onNextSlide, onPrevSlide }: PreviewOverlayProps) {
    let currentIndex = presentation.slides.findIndex(
        (slide) => slide.id === activeSlideId
    );
    if (currentIndex === -1) {
        currentIndex = 0
    }
    const currentSlide = presentation.slides[currentIndex];

    return (
        <div className={styles.overlay}>
            <div className={styles.controls}>
                <Button text="Назад" onClick={onPrevSlide} />
                
                <span className={styles.counter}>
                    {currentIndex + 1} / {presentation.slides.length}
                </span>
                
                <Button text="Далее" onClick={onNextSlide} />
                <Button text="✕ Закрыть" onClick={onClose} className={styles.closeBtn} />
            </div>

            <div className={styles.slideContainer}>
                <div className={styles.scaleWrapper}>
                    {currentSlide && <SlidePreview slide={currentSlide} readonly={true} />}
                </div>
            </div>
        </div>
    );
}

export { PreviewOverlay };