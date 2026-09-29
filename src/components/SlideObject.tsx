import type { SlideObject, TextObject, ImageObject, FigureObject } from '../types/objects.js';
import styles from './SlideObject.module.css';

type SlideObjectProps = {
    object: SlideObject;
};

function TextObjectComponent(object: TextObject, dynamicStyle: React.CSSProperties) {
    return (
        <div 
            style={{...dynamicStyle, textAlign: object.textLayout}}
            className={`${styles.baseObject} ${styles.textObject}`}
        >
            {object.spans.map((span, idx) => {
                const isBold = span.style.fontStyle === 'bold';
                const isItalic = span.style.fontStyle === 'italic';

                return ()
            })}   
        </div>
    )
}

function SlideObjectComponent({ object }: SlideObjectProps) {
    const dynamicStyle: React.CSSProperties = {
        left: `${object.position.x}px`,
        top: `${object.position.y}px`,
        width: `${object.size.width}px`,
        height: `${object.size.height}px`,
    };

    switch (object.type) {
        case 'text':
            TextObjectComponent(object, dynamicStyle)
    }
}