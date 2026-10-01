import type { Presentation } from '../types/presentation.js';
import { SlidePreview } from './SlidePreview.js';
import { Button } from './Button.js';
import styles from './PreviewOverlay.module.css';

type PreviewOverlayProps = {
    presentation: Presentation;
    onClose: () => void;
};

function PreviewOverlay({ presentation, onClose }: PreviewOverlayProps) {
    const currentSlide = presentation.slides[0];
    const currentIndex = 0;

    return (
        <div className={styles.overlay}>
            <div className={styles.controls}>
                <Button text="Назад" onClick={() => console.log('Назад')} />
                
                <span className={styles.counter}>
                    {currentIndex + 1} / {presentation.slides.length}
                </span>
                
                <Button text="Далее" onClick={() => console.log('Вперед')} />
                <Button text="✕ Закрыть" onClick={onClose} className={styles.closeBtn} />
            </div>

            <div className={styles.slideContainer}>
                {currentSlide && <SlidePreview slide={currentSlide} />}
            </div>
        </div>
    );
}

export { PreviewOverlay };