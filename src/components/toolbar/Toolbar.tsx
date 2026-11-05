import type { Presentation } from '../../model/types/presentation.js'
import { dispatch } from '../../editor.js'
import { modifyPresentation, setPreviewMode, removeActiveSlide } from '../../viewmodel/functions/navigation.js'
import { updatePresentationName, addSlide, modifySlide, generateId } from '../../model/functions/presentation.js'
import { addTextObject, addFigureObject } from '../../model/functions/objects.js' 
import { Button } from '../common/button/Button.js'
import { TextInput } from '../common/textInput/TextInput.js'
import { setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient } from '../../model/functions/slide.js'
import styles from './Toolbar.module.css'
import { ColorPicker } from '../colorPicker/ColorPicker.js'
import { ShapePicker } from '../common/shapePicker/ShapePicker.js'
import { useImageUpload } from './customHooks/useImageUpload.js'

type ToolbarProps = {
    presentation: Presentation
    activeSlideId: string | null
}

function Toolbar({ presentation, activeSlideId }: ToolbarProps) {
    const activeSlide = presentation.slides.find(s => s.id === activeSlideId) || presentation.slides[0]
    const currentColor = activeSlide?.background.type === 'color' ? activeSlide.background.color : '#ffffff'

    const { fileInputRef, handleFileChange, chooseFile } = useImageUpload({
        activeSlideId: activeSlide?.id ?? null,
    })

    const onNameChange = (newName: string) => {
        dispatch(modifyPresentation, {
            operation: updatePresentationName,
            args: newName
        })
    }

    const onAddSlide = () => {
        dispatch(modifyPresentation, {
            operation: addSlide,
            args: { id: generateId(), slidename: `Слайд ${presentation.slides.length + 1}` }
        })
    }

    const onStartPreview = () => {
        dispatch(setPreviewMode, true)
        document.documentElement.requestFullscreen().catch(e => console.log(e))
    }

    const onRemoveSlide = () => {
        dispatch(removeActiveSlide)
    }

    const onAddText = () => {
        dispatch(modifyPresentation, {
            operation: modifySlide,
            args: {
                slideId: activeSlide.id,
                operation: addTextObject,
                args: {
                    id: generateId(),
                    spans: [{ text: '', style: { fontFamily: 'Arial', fontSize: 24, fontColor: '#000000', fontStyle: [] } }],
                    position: { x: 50, y: 50 },
                    size: { width: 300, height: 50 },
                    textLayout: 'left'
                }
            }
        })
    }

    const onAddFigure = (shapeType: 'rectangle' | 'circle' | 'triangle') => {
        dispatch(modifyPresentation, {
            operation: modifySlide,
            args: {
                slideId: activeSlide.id,
                operation: addFigureObject,
                args: {
                    id: generateId(),
                    position: { x: 100, y: 100 },
                    size: { width: 100, height: 100 },
                    figureStyle: {
                        shape: shapeType,
                        fillColor: '#3498db',
                        strokeColor: '#2980b9',
                        strokeWidth: 2
                    }
                }
            }
        })
    }

    return (
        <div className={styles.toolbar}>
            <div className={styles.leftGroup}>
                <TextInput
                    value={presentation.name}
                    onChange={onNameChange}
                    className={styles.titleInput}
                    placeHolder="Название презентации"
                />
            </div>

            <div className={styles.centerGroup}>
                <Button text="+ Слайд" onClick={onAddSlide} />
                <Button text="Удалить слайд" onClick={onRemoveSlide} />
                <Button text="Текст" onClick={onAddText} />
                <Button text="Картинка" onClick={chooseFile} />

                <ShapePicker onChange={onAddFigure} />
            </div>

            <div className={styles.rightGroup}>
                <Button text="Слайд-шоу" onClick={onStartPreview} className={styles.primaryButton} />
            </div>

            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
            />
        </div>
    )
}

export { Toolbar }