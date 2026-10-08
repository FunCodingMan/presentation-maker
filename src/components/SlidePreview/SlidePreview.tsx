import type { Slide } from '../../types/slide.js';
import styles from './SlidePreview.module.css';
import { SlideObjectComponent } from '../SlideObject/SlideObject.js';

type SlidePreviewProps = {
    slide: Slide;
    readonly?: boolean;
};

function SlidePreview({ slide, readonly = false }: SlidePreviewProps) {
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
                <SlideObjectComponent key={obj.id} object={obj} slideId={slide.id} readonly={readonly} />
            ))}
        </div>
    );

}

export { SlidePreview }