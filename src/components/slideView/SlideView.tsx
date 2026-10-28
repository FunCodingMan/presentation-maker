import type { Slide } from '../../model/types/slide.js'
import styles from './SlideView.module.css'
import { SlideObject } from '../slideObject/SlideObject.js'
import { useObjectDrag } from '../workspace/hooks/useObjectDrag.js'

type SlideViewProps = {
    slide: Slide
    readonly?: boolean
    selectedObjectIds?: string[]
    onObjectSelect?: (objectId: string, isShiftPressed: boolean) => void
}

function SlideView({ slide, readonly = false, selectedObjectIds, onObjectSelect }: SlideViewProps) {
    const { handleMouseDown } = useObjectDrag({
        selectedObjectIds: selectedObjectIds ?? [],
        activeSlideId: slide.id,
        objects: slide.objects,
    })

    let backgroundStyles: React.CSSProperties = {}

    switch (slide.background.type) {
        case 'color':
            backgroundStyles.backgroundColor = slide.background.color
            break
        case 'image':
            backgroundStyles.backgroundImage = `url(${slide.background.src})`
            backgroundStyles.backgroundSize = 'cover'
            backgroundStyles.backgroundPosition = 'center'
            break
        case 'gradient':
            const angle = slide.background.angle || 90
            backgroundStyles.background = `linear-gradient(${angle}deg, ${slide.background.colors.join(', ')})`
            break
    }

    return (
        <div className={styles.slidePreview} style={backgroundStyles}>
            {slide.objects.map(obj => (
                <SlideObject 
                    key={obj.id} 
                    object={obj} 
                    slideId={slide.id} 
                    readonly={readonly}
                    isSelected={selectedObjectIds?.includes(obj.id)}
                    onSelect={onObjectSelect}
                    onMouseDown={handleMouseDown}
                />
            ))}
        </div>
    )

}

export { SlideView }