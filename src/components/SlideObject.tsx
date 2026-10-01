import type { SlideObject, TextObject, ImageObject, FigureObject } from '../types/objects.js';
import styles from './SlideObject.module.css';

type SlideObjectProps = {
    object: SlideObject;
};

type TextObjectProps = {
    object: TextObject;
    dynamicStyle: React.CSSProperties;
};

type ImageObjectProps = {
    object: ImageObject;
    dynamicStyle: React.CSSProperties;
};

type FigureObjectProps = {
    object: FigureObject;
    dynamicStyle: React.CSSProperties;
};

function TextObjectComponent({ object, dynamicStyle }: TextObjectProps) {
    return (
        <div 
            style={{...dynamicStyle, textAlign: object.textLayout}}
            className={`${styles.baseObject} ${styles.textObject}`}
        >
            {object.spans.map((span, idx) => {
                const styleArray = span.style.fontStyle || [];

                const isBold = styleArray.includes('bold');
                const isItalic = styleArray.includes('italic');
                const isUnderline = styleArray.includes('underline');

                return (
                    <span 
                        key={idx}
                        style={{
                            fontFamily: span.style.fontFamily,
                            fontSize: `${span.style.fontSize}px`,
                            color: span.style.fontColor,
                            fontWeight: isBold ? 'bold' : 'normal',
                            fontStyle: isItalic ? 'italic' : 'normal',
                            textDecoration: isUnderline ? 'underline' : 'none',
                        }}
                    >
                        {span.text}
                    </span>
                );
            })}   
        </div>
    )
}

function ImageObjectComponent({ object, dynamicStyle }: ImageObjectProps) {
    let filterStr = 'none';
    if (object.filters) {
        const blur = object.filters.blur ? `blur(${object.filters.blur}px)` : ''
        const brightness = object.filters.brightness !== undefined ? `brightness(${object.filters.brightness}%)` : ''
        filterStr = `${blur} ${brightness}` || 'none'
    }

    return (
        <div
            style={dynamicStyle}
            className={`${styles.baseObject} ${styles.imageObject}`}
        >
            <img 
                src={object.src}
                alt='Image'
                style={{ filter: filterStr }}
                className={styles.image}
            />
        </div>
    )
}

function FigureObjectComponent({ object, dynamicStyle }: FigureObjectProps) {
    const { shape, fillColor, strokeColor, strokeWidth } = object.figureStyle;

    return (
        <div
            style={dynamicStyle}
            className={`${styles.baseObject} ${styles.figureObject}`}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {shape === 'rectangle' && (
                    <rect
                        width="100"
                        height="100"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                    />
                )}

                {shape === 'circle' && (
                    <ellipse 
                        cx="50" cy="50" 
                        rx="48" ry="48"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                    />
                )}

                {shape === 'triangle' && (
                    <polygon 
                        points="50,0 100,100 0,100" 
                        fill={fillColor} 
                        stroke={strokeColor} 
                        strokeWidth={strokeWidth} 
                    />
                )}
            </svg>
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
            return <TextObjectComponent object={object} dynamicStyle={dynamicStyle} />
        case 'image':
            return <ImageObjectComponent object={object} dynamicStyle={dynamicStyle} />
        case 'figure':
            return <FigureObjectComponent object={object} dynamicStyle={dynamicStyle} />
        default:
            return null
    }
}

export{ SlideObjectComponent }