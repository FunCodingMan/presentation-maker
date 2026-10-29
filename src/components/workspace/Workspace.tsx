import { SlideView } from '../slideView/SlideView.js'
import { Slide } from '../../model/types/slide.js'
import styles from './Workspace.module.css'
import { useSelection } from './customHooks/useSelection.js'
import { useWorkspaceShortcuts } from './customHooks/useWorkspaceShortcuts.js'

type WorkspaceProps = {
    slides: Slide[]
    activeSlideId: string | null
}

function Workspace({ slides, activeSlideId }: WorkspaceProps) {
    const activeSlide = slides.find(slide => slide.id === activeSlideId) || slides[0]
    const selection = useSelection(activeSlideId)

    useWorkspaceShortcuts({
        activeSlideId: activeSlide?.id ?? null,
        getSelectedIds: selection.getSelectedIds,
        onDelete: selection.clearSelection,
    })

    return (
        <div className={styles.workspace} onMouseDown={selection.clearSelection}>
            <div className={styles.canvasContainer}>
                {activeSlide ? (
                    <SlideView slide={activeSlide} readonly={false} selection={selection} />
                ) : (
                    <div className={styles.emptyState}>Нет слайдов</div>
                )}
            </div>
        </div>
    )
}

export { Workspace }