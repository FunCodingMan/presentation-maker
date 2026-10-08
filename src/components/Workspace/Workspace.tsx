import type { Presentation } from '../model/types/presentation.js';
import { SlidePreview } from '../SlidePreview/SlidePreview.js';
import styles from './Workspace.module.css';

type WorkspaceProps = {
    presentation: Presentation
    activeSlideId: string | null
};

function Workspace({ presentation, activeSlideId }: WorkspaceProps) {
    const activeSlide = presentation.slides.find(slide => slide.id === activeSlideId) || presentation.slides[0];
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