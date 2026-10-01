import type { Presentation } from '../types/presentation.js';
import { dispatch, setPreviewMode } from '../editor.js';
import { updatePresentationName, addSlide } from '../functions/presentation.js';
import { generateId } from '../functions/presentation.js';
import { Button } from './Button.js';
import { TextInput } from './TextInput.js';
import { addTextObject } from '../functions/objects.js'
import styles from './Toolbar.module.css';

type ToolbarProps = {
    presentation: Presentation;
};

function Toolbar({ presentation }: ToolbarProps) {
    const onNameChange = (newName: string) => {
        dispatch(updatePresentationName, newName)
    }

    const onAddSlide = () => {
        dispatch(addSlide, { id: generateId(), slidename: `Слайд ${presentation.slides.length + 1}` })
    }

    const onStartPreview = () => {
        setPreviewMode(true)
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
                <Button text="Текст" onClick={onAddSlide} />
                <Button text="Картинка" onClick={onAddSlide} />
                <Button text="Фигура" onClick={onAddSlide} />
            </div>

            <div className={styles.rightGroup}>
                <Button text="Слайд-шоу ▶" onClick={onStartPreview} className={styles.primaryButton} />
            </div>
        </div>
    )
}

export { Toolbar }