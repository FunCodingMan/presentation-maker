import { useState, useEffect } from 'react';
import { SlidePreview } from '../slideView/SlideView.js';
import { Slide } from '../../model/types/slide.js';
import styles from './Workspace.module.css';
import { dispatch } from '../../editor.js';
import { modifyPresentation } from '../../viewmodel/functions/navigation.js';
import { modifySlide } from '../../model/functions/presentation.js';
import { removeObjects } from '../../model/functions/objects.js';

type WorkspaceProps = {
    slides: Slide[];
    activeSlideId: string | null
};

function Workspace({ slides, activeSlideId }: WorkspaceProps) {
    const activeSlide = slides.find(slide => slide.id === activeSlideId) || slides[0]
    const [selectedObjectIds, setSelectedObjectIds] = useState<string[]>([])
    
    useEffect(() => {
        setSelectedObjectIds([])
    }, [activeSlideId])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObjectIds.length > 0 && activeSlideId) {
                dispatch(modifyPresentation, {
                    operation: modifySlide,
                    args: {
                        slideId: activeSlideId,
                        operation: removeObjects,
                        args: { objectIds: selectedObjectIds }
                    }
                })
                setSelectedObjectIds([])
            }
        }
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedObjectIds, activeSlideId])

    const hangleObjectSelect = (objectId: string, isShiftPressed: boolean) => {
        if (isShiftPressed) {
            setSelectedObjectIds(prev => 
                prev.includes(objectId)
                    ? prev.filter(id => id !== objectId)
                    : [...prev, objectId]
            )
        } else {
            setSelectedObjectIds([objectId])
        }
    }

    const handleBackGroundClick = () => {
        setSelectedObjectIds([])
    }
    
    return (
        <div className={styles.workspace} onClick={handleBackGroundClick}>
            <div className={styles.canvasContainer}>
                {activeSlide ? (
                    <SlidePreview
                        slide={activeSlide} 
                        readonly={false}
                        selectedObjectIds={selectedObjectIds}
                        onObjectSelect={hangleObjectSelect}
                    />
                ) : (
                    <div className={styles.emptyState}>Нет слайдов</div>
                )}
            </div>
        </div>
    );
}

export { Workspace };