import type { Presentation } from '../../model/types/presentation.js'
import { SlideView } from '../slideView/SlideView.js'
import { dispatch } from '../../editor.js'
import { Slide } from '../../model/types/slide.js'
import { setActiveSlideId } from '../../viewmodel/functions/navigation.js'
import styles from './SlideList.module.css'

type SlideListProps = {
    slides: Slide[]
    activeSlideId: string | null
}
//TODO: список слайдов в пропс
function SlideList({ slides, activeSlideId }: SlideListProps) {
    return (
        <div className={styles.slideList}>
            {slides.map((slide, index) => {
                const isActive = slide.id === (activeSlideId || slides[0]?.id)

                return (
                    <div 
                        key={slide.id} 
                        className={styles.slideItem}
                        onClick={() => dispatch(setActiveSlideId, slide.id)}
                    >
                        <span className={styles.slideNumber}>{index + 1}</span>
                        <div 
                            className={`${styles.thumbnailContainer} ${isActive ? styles.activeSlide : ''}`}
                        >
                            <div className={styles.thumbnailScale}>
                                <SlideView slide={slide} readonly={true}/>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export { SlideList }