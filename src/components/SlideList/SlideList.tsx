import type { Presentation } from '../../types/presentation.js';
import { SlidePreview } from '../SlidePreview/SlidePreview.js';
import { setActiveSlideId } from '../../editor.js';
import styles from './SlideList.module.css';

type SlideListProps = {
    presentation: Presentation
    activeSlideId: string | null
};

function SlideList({ presentation, activeSlideId }: SlideListProps) {
    return (
        <div className={styles.slideList}>
            {presentation.slides.map((slide, index) => {
                const isActive = slide.id === (activeSlideId || presentation.slides[0]?.id);

                return (
                    <div 
                        key={slide.id} 
                        className={styles.slideItem}
                        onClick={() => setActiveSlideId(slide.id)}
                    >
                        <span className={styles.slideNumber}>{index + 1}</span>
                        <div 
                            className={`${styles.thumbnailContainer} ${isActive ? styles.activeSlide : ''}`}
                        >
                            <div className={styles.thumbnailScale}>
                                <SlidePreview slide={slide} readonly={true}/>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export { SlideList };