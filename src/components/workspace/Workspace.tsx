import type { Presentation } from '../../model/types/presentation.js';
import { SlidePreview } from '../slideView/SlideView.js';
import { Slide } from '../../model/types/slide.js';
import styles from './Workspace.module.css';

type WorkspaceProps = {
    slides: Slide[];
    activeSlideId: string | null
};

function Workspace({ slides, activeSlideId }: WorkspaceProps) {
    const activeSlide = slides.find(slide => slide.id === activeSlideId) || slides[0];
    return (
        <div className={styles.workspace}>
            <div className={styles.canvasContainer}>
                {activeSlide ? (
                    <SlidePreview slide={activeSlide} readonly={false} />
                ) : (
                    <div className={styles.emptyState}>Нет слайдов</div>
                )}
            </div>
        </div>
    );
}

export { Workspace };