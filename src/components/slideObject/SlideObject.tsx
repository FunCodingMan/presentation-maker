import type { SlideObject, TextObject, ImageObject, FigureObject } from '../../model/types/objects.js'
import { TextInput } from '../common/textInput/TextInput.js'
import { dispatch } from '../../editor.js'
import { modifySlide } from '../../model/functions/presentation.js'
import { updateTextContent } from '../../model/functions/objects.js'
import styles from './SlideObject.module.css'
import { modifyPresentation } from '../../viewmodel/functions/navigation.js'

type SlideObjectProps = {
    object: SlideObject
    slideId: string
    readonly?: boolean
    isSelected?: boolean
    onSelect?: (objectId: string, isShiftPressed: boolean) => void
    onMouseDown?: (e: React.MouseEvent, objectId: string) => void
}

type TextObjectProps = { object: TextObject; slideId: string; readonly?: boolean }
type ImageObjectProps = { object: ImageObject }
type FigureObjectProps = { object: FigureObject }

function TextObjectComponent({ object, slideId, readonly }: TextObjectProps) {
    const plainText = object.spans.map(span => span.text).join('')
    const baseStyle = object.spans[0]?.style
    const styleArray = baseStyle?.fontStyle || []

    const textObjectStyle: React.CSSProperties = {
        textAlign: object.textLayout,
        fontFamily: baseStyle?.fontFamily,
        fontSize: `${baseStyle?.fontSize || 24}px`,
        color: baseStyle?.fontColor || '#000000',
        fontWeight: styleArray.includes('bold') ? 'bold' : 'normal',
        fontStyle: styleArray.includes('italic') ? 'italic' : 'normal',
        textDecoration: styleArray.includes('underline') ? 'underline' : 'none',
    }

    const handleTextChange = (newText: string) => {
        dispatch(modifyPresentation, {
            operation: modifySlide,
            args: {
                slideId,
                operation: updateTextContent,
                args: { objectId: object.id, newText },
            },
        })
    }

    return (
        <TextInput
            value={plainText}
            onChange={handleTextChange}
            style={textObjectStyle}
            readonly={readonly}
            placeHolder="Введите текст"
            className={styles.textObject}
            canvasMode={true}
        />
    )
}

function ImageObjectComponent({ object }: ImageObjectProps) {
    let filterStr = 'none'
    if (object.filters) {
        const blur = object.filters.blur ? `blur(${object.filters.blur}px)` : ''
        const brightness = object.filters.brightness !== undefined ? `brightness(${object.filters.brightness}%)` : ''
        filterStr = `${blur} ${brightness}`.trim() || 'none'
    }
    return (
        <img
            src={object.src}
            alt="Image"
            style={{ filter: filterStr }}
            className={styles.imageObject}
            draggable={false}
        />
    )
}

function FigureObjectComponent({ object }: FigureObjectProps) {
    const { shape, fillColor, strokeColor, strokeWidth } = object.figureStyle
    return (
        <svg className={styles.figureObject} viewBox="0 0 100 100" preserveAspectRatio="none">
            {shape === 'rectangle' && (
                <rect width="100" height="100" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            )}
            {shape === 'circle' && (
                <ellipse cx="50" cy="50" rx="47" ry="47" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            )}
            {shape === 'triangle' && (
                <polygon points="50,0 100,100 0,100" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
            )}
        </svg>
    )
}

function SlideObject({ object, slideId, readonly, isSelected, onSelect, onMouseDown }: SlideObjectProps) {
    const handleMouseDown = (e: React.MouseEvent) => {
        if (readonly) return

        if (onSelect && !isSelected) {
            onSelect(object.id, e.shiftKey)
        }

        const target = e.target as HTMLElement
        const isClickInsideText = target.closest('[contenteditable="true"]') !== null

        if (onMouseDown) {
            if (!isClickInsideText || !isSelected) {
                onMouseDown(e, object.id)
            }
        }
    }

    const handleClick = (e: React.MouseEvent) => {
        if (readonly) return
        e.stopPropagation()
        if (onSelect && isSelected && !e.shiftKey) {
            onSelect(object.id, false)
        }
    }

    const dynamicWrapperStyle: React.CSSProperties = {
        left: `${object.position.x}px`,
        top: `${object.position.y}px`,
        width: `${object.size.width}px`,
        ...(object.type === 'text'
            ? { minHeight: `${object.size.height}px`, height: 'auto' }
            : { height: `${object.size.height}px` }),
    }

    const wrapperClass = `${styles.objectWrapper} ${isSelected ? styles.objectWrapperSelected : ''}`

    return (
        <div onMouseDown={handleMouseDown} onClick={handleClick} className={wrapperClass} style={dynamicWrapperStyle}>
            {object.type === 'text' && <TextObjectComponent object={object} slideId={slideId} readonly={readonly} />}
            {object.type === 'image' && <ImageObjectComponent object={object} />}
            {object.type === 'figure' && <FigureObjectComponent object={object} />}
        </div>
    )
}

export { SlideObject }