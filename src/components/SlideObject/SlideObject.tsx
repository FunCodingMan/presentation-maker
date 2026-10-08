import type { SlideObject, TextObject, ImageObject, FigureObject } from '../../types/objects.js';
import { TextInput } from '../Common/TextInput/TextInput.js';
import { dispatch } from '../../editor.js';
import { modifySlide } from '../../functions/presentation.js';
import { updateTextContent } from '../../functions/objects.js';
import styles from './SlideObject.module.css';

type SlideObjectProps = {
    object: SlideObject;
    slideId: string;
    readonly?: boolean;
};

type TextObjectProps = {
    object: TextObject;
    dynamicStyle: React.CSSProperties;
    slideId: string;
    readonly?: boolean;
};

type ImageObjectProps = {
    object: ImageObject;
    dynamicStyle: React.CSSProperties;
};

type FigureObjectProps = {
    object: FigureObject;
    dynamicStyle: React.CSSProperties;
};

function TextObjectComponent({ object, dynamicStyle, slideId, readonly }: TextObjectProps) {
    const plainText = object.spans.map(span => span.text).join('');
    const baseStyle = object.spans[0]?.style;
    const styleArray = baseStyle?.fontStyle || [];

    const textObjectStyle: React.CSSProperties = {
        ...dynamicStyle,
        textAlign: object.textLayout,
        fontFamily: baseStyle?.fontFamily,
        fontSize: `${baseStyle?.fontSize || 24}px`,
        color: baseStyle?.fontColor || '#000000',
        fontWeight: styleArray.includes('bold') ? 'bold' : 'normal',
        fontStyle: styleArray.includes('italic') ? 'italic' : 'normal',
        textDecoration: styleArray.includes('underline') ? 'underline' : 'none',
    };
    const handleTextChange = (newText: string) => {
        dispatch(modifySlide, {
            slideId: slideId,
            operation: updateTextContent,
            args: { objectId: object.id, newText: newText }
        });
    };


    return (
        <TextInput 
            value={plainText}
            onChange={handleTextChange}
            style={textObjectStyle}
            readonly={readonly}
            placeHolder="Введите текст"
            className={`${styles.baseObject} ${styles.textObject}`}
        />
    );
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
                        rx="47" ry="47"
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

function SlideObjectComponent({ object, slideId, readonly }: SlideObjectProps) {
    const dynamicStyle: React.CSSProperties = {
        left: `${object.position.x}px`,
        top: `${object.position.y}px`,
        position: 'absolute',
        width: `${object.size.width}px`,
        ...(object.type === 'text' 
            ? { minHeight: `${object.size.height}px`, height: 'auto' } 
            : { height: `${object.size.height}px` }
        )
    };

    switch (object.type) {
        case 'text':
            return <TextObjectComponent object={object} dynamicStyle={dynamicStyle} slideId={slideId} readonly={readonly} />
        case 'image':
            return <ImageObjectComponent object={object} dynamicStyle={dynamicStyle} />
        case 'figure':
            return <FigureObjectComponent object={object} dynamicStyle={dynamicStyle} />
        default:
            return null
    }
}

export{ SlideObjectComponent }