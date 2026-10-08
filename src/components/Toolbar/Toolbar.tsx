import type { Presentation } from '../model/types/presentation.js';
import { dispatch, getActiveSlideId, setPreviewMode } from '../../editor.js';
import { updatePresentationName, addSlide, modifySlide, generateId } from '../model/functions/presentation.js';
import { addTextObject, addImageObject, addFigureObject } from '../model/functions/objects.js'; 
import { Button } from '../Common/Button/Button.js';
import { TextInput } from '../Common/TextInput/TextInput.js';
import { setSlideBackgroundColor, setSlideBackgroundImage, setSlideBackgroundGradient } from '../model/functions/slide.js'
import styles from './Toolbar.module.css';
import { ColorPicker } from '../ColorPicker/ColorPicker.js';
import { ShapePicker } from '../ShapePicker/ShapePicket.js';

type ToolbarProps = {
    presentation: Presentation;
    activeSlideId: string | null;
};

function Toolbar({ presentation, activeSlideId }: ToolbarProps) {
    const activeSlide = presentation.slides.find(s => s.id === activeSlideId) || presentation.slides[0];
    const currentColor = activeSlide?.background.type === 'color' ? activeSlide.background.color : '#ffffff';

    const onNameChange = (newName: string) => {
        dispatch(updatePresentationName, newName)
    }

    const onAddSlide = () => {
        dispatch(addSlide, { id: generateId(), slidename: `Слайд ${presentation.slides.length + 1}` })
    }

    const onStartPreview = () => {
        setPreviewMode(true)
        document.documentElement.requestFullscreen()
    }

    const onBackgroundColorChange = (newColor: string) => {
        dispatch(modifySlide, {
            slideId: activeSlide.id,
            operation: setSlideBackgroundColor,
            args: newColor
        });
    };

    const onBackgroundImageChange = () => {
        const url = prompt('Введите URL картинки для фона:', 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000');
        if (url) {
            dispatch(modifySlide, {
                slideId: activeSlide.id,
                operation: setSlideBackgroundImage,
                args: url
            });
        }
    };

    const onBackgroundGradientChange = () => {
        dispatch(modifySlide, {
            slideId: activeSlide.id,
            operation: setSlideBackgroundGradient,
            args: { colors: ['#a18cd1', '#fbc2eb'], angle: 45 }
        })
    }


    const onAddText = () => {
        dispatch(modifySlide, {
            slideId: activeSlide.id,
            operation: addTextObject,
            args: {
                id: generateId(),
                spans: [{ text: '', style: { fontSize: 24, fontColor: '#000', fontStyle: [] } }],
                position: { x: 50, y: 50},
                size: { width: 300, height: 50 },
                textLayout: 'left'
            }
        })
    }

    const onAddImage = () => {
        dispatch(modifySlide, {
            slideId: activeSlide.id,
            operation: addImageObject,
            args: {
                id: generateId(),
                url: 'https://i.pinimg.com/474x/1d/81/a3/1d81a30c542bada18ef5b89cb666cdb6.jpg',
                position: { x: 50, y: 50 },
                size: { width: 474, height: 463 },
                filters: [] 
            }
        })
    }

    const onAddFigure = (shapeType: 'rectangle' | 'circle' | 'triangle') => {
        dispatch(modifySlide, {
            slideId: activeSlide.id,
            operation: addFigureObject,
            args: {
                id: generateId(),
                position: { x: 100, y: 100 },
                size: { width: 100, height: 100 },
                figureStyle: {
                    shape: shapeType,
                    fillcolor: '#3498db',
                    strokeColor: '#2980b9',
                    strokeWidth: 2
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
                <Button text="Текст" onClick={onAddText} />
                <Button text="Картинка" onClick={onAddImage} />
                <ShapePicker onChange={onAddFigure} />

                <div className={styles.colorPickerTool}>
                    <span className={styles.toolLabel}>Фон:</span>
                    <ColorPicker 
                        value={currentColor} 
                        onChange={onBackgroundColorChange}
                    />
                    <Button text="🖼️" onClick={onBackgroundImageChange} />
                    <Button text="🌈" onClick={onBackgroundGradientChange} />
                </div>
            </div>

            <div className={styles.rightGroup}>
                <Button text="Слайд-шоу ▶" onClick={onStartPreview} className={styles.primaryButton} />
            </div>
        </div>
    )
}

export { Toolbar }