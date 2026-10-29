import type { Slide } from '../../model/types/slide.js'
import styles from './SlideView.module.css'
import { SlideObject } from '../slideObject/SlideObject.js'
import { useObjectDrag } from '../workspace/customHooks/useObjectDrag.js'
import type { SelectionReturn } from '../workspace/customHooks/useSelection.js'

type SlideViewProps = {
    slide: Slide
    readonly?: boolean
    selection?: SelectionReturn
}

const EMPTY_GET_IDS = () => [] as string[]

function SlideView({ slide, readonly = false, selection }: SlideViewProps) {
    const getSelectedIds = selection?.select ? selection.getSelectedIds : EMPTY_GET_IDS
    const { handleMouseDown } = useObjectDrag({
        activeSlideId: slide.id,
        objects: slide.objects,
        getSelectedIds: getSelectedIds ,
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
            {slide.objects.map(obj => (
                <SlideObject
                    key={obj.id}
                    object={obj}
                    slideId={slide.id}
                    readonly={readonly}
                    isSelected={selection?.isSelected(obj.id) ?? false}
                    onSelect={selection?.select}
                    onMouseDown={handleMouseDown}
                />
            ))}
        </div>
    )
}

export { SlideView }