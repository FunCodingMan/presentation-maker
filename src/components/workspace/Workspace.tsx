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
    const { selectedObjectIds, handleSelect, clearSelection } = useSelection(activeSlideId)

    useWorkspaceShortcuts({
        selectedObjectIds,
        activeSlideId: activeSlide?.id ?? null,
        onDelete: clearSelection,
    })

    const handleWorkspaceMouseDown = (e: React.MouseEvent) => {
        if (e.defaultPrevented) return
        clearSelection()
    }

    return (
        <div className={styles.workspace} onMouseDown={handleWorkspaceMouseDown}>
            <div className={styles.canvasContainer}>
                {activeSlide ? (
                    <SlideView
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
    )
}

export { Workspace }