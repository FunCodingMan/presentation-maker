import type { Slide } from '../../model/types/slide.js';
import styles from './SlideView.module.css';
import { SlideObjectComponent } from '../slideObject/SlideObject.js';

type SlidePreviewProps = {
    slide: Slide;
    readonly?: boolean;
    selectedObjectIds?: string[];
    onObjectSelect?: (objectId: string, isShiftPressed: boolean) => void;
};

function SlidePreview({ slide, readonly = false, selectedObjectIds, onObjectSelect }: SlidePreviewProps) {
    let backgroundStyles: React.CSSProperties = {};

    switch (slide.background.type) {
        case 'color':
            backgroundStyles.backgroundColor = slide.background.color;
            break;
        case 'image':
            backgroundStyles.backgroundImage = `url(${slide.background.src})`;
            backgroundStyles.backgroundSize = 'cover';
            backgroundStyles.backgroundPosition = 'center';
            break;
        case 'gradient':
            const angle = slide.background.angle || 90;
            backgroundStyles.background = `linear-gradient(${angle}deg, ${slide.background.colors.join(', ')})`;
            break;
    }

    return (
        <div className={styles.slidePreview} style={backgroundStyles}>
            {slide.objects.map(obj => (
                <SlideObjectComponent 
                    key={obj.id} 
                    object={obj} 
                    slideId={slide.id} 
                    readonly={readonly}
                    isSelected={selectedObjectIds?.includes(obj.id)}
                    onSelect={onObjectSelect}
                />
            ))}
        </div>
    );

}

export { SlidePreview }