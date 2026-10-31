import type { Slide } from '../../model/types/slide.js'
import styles from './SlideView.module.css'
import { SlideObject } from '../slideObject/SlideObject.js'
import { useObjectDrag } from '../workspace/customHooks/useObjectDrag.js'
import { useObjectResize } from '../workspace/customHooks/useObjectResize.js'


type SlideViewProps = {
    slide: Slide
    readonly?: boolean
    selectedObjectIds?: string[]
    onObjectSelect?: (objectId: string, isShiftPressed: boolean) => void
}

function SlideView({
    slide,
    readonly = false,
    selectedObjectIds = [],
    onObjectSelect,
}: SlideViewProps) {
    const { handleDragMouseDown, dragOffset } = useObjectDrag({
        selectedObjectIds,
        activeSlideId: slide.id,
        objects: slide.objects,
    })

    const { handleResizeMouseDown, resizeOffset } = useObjectResize({
        selectedObjectIds,
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
        case 'gradient': {
            const angle = slide.background.angle || 90
            backgroundStyles.background = `linear-gradient(${angle}deg, ${slide.background.colors.join(', ')})`
            break
        }
    }

    return (
        <div className={styles.slidePreview} style={backgroundStyles}>
            {slide.objects.map(obj => {
                const isSelected = selectedObjectIds.includes(obj.id)
                return (
                    <SlideObject
                        key={obj.id}
                        object={obj}
                        slideId={slide.id}
                        readonly={readonly}
                        isSelected={isSelected}
                        onSelect={onObjectSelect}
                        onDragMouseDown={handleDragMouseDown}
                        dragOffset={isSelected ? dragOffset : undefined}
                        onResizeMouseDown={handleResizeMouseDown}
                        resizeOffset={isSelected ? resizeOffset : undefined}
                    />
                )
            })}
        </div>
    )
}

export { SlideView }