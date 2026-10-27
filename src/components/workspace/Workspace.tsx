import { SlidePreview } from '../slideView/SlideView.js';
import { Slide } from '../../model/types/slide.js';
import styles from './Workspace.module.css';
import { useSelection } from './hooks/useSelection.js';
import { useWorkspaceShortcuts } from './hooks/useWorkspaceShortcuts.js';

type WorkspaceProps = {
    slides: Slide[];
    activeSlideId: string | null
};

function Workspace({ slides, activeSlideId }: WorkspaceProps) {
    const activeSlide = slides.find(slide => slide.id === activeSlideId) || slides[0]
    const { selectedObjectIds, handleSelect, clearSelection } = useSelection(activeSlideId);
    
    useWorkspaceShortcuts({
        selectedObjectIds,
        activeSlideId,
        onDelete: clearSelection
    });

    return (
        <div className={styles.workspace} onClick={clearSelection}>
            <div className={styles.canvasContainer}>
                {activeSlide ? (
                    <SlidePreview
                        slide={activeSlide} 
                        readonly={false}
                        selectedObjectIds={selectedObjectIds}
                        onObjectSelect={handleSelect}
                    />
                ) : (
                    <div className={styles.emptyState}>Нет слайдов</div>
                )}
            </div>
        </div>
    );
}

export { Workspace };