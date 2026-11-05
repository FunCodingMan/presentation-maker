import { useTextStylePanel } from '../workspace/customHooks/useTextStylePanel.js'
import type { SlideObject } from '../../model/types/objects.js'
import styles from './TextStylePanel.module.css'

type TextStylePanelProps = {
    activeSlideId: string | null
    selectedObjectIds: string[]
    objects: SlideObject[]
}

const FONT_FAMILIES = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Comic Sans MS',
    'Impact',
]

function TextStylePanel({ activeSlideId, selectedObjectIds, objects }: TextStylePanelProps) {
    const {
        isVisible,
        fontFamily,
        fontSizeInput,
        fontColor,
        handleFontFamilyChange,
        handleFontSizeInputChange,
        handleFontSizeBlur,
        handleFontSizeStep,
        handleFontColorChange,
    } = useTextStylePanel({ selectedObjectIds, activeSlideId, objects })

    if (!isVisible) return null

    const fontOptions = FONT_FAMILIES.includes(fontFamily)
        ? FONT_FAMILIES
        : [fontFamily, ...FONT_FAMILIES]

    return (
        <div
            className={styles.panel}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
        >
            <h3 className={styles.title}>Свойства текста</h3>

            <div className={styles.field}>
                <label className={styles.label}>Шрифт</label>
                <select
                    className={styles.select}
                    value={fontFamily}
                    onChange={(e) => handleFontFamilyChange(e.target.value)}
                >
                    {fontOptions.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Размер</label>
                <div className={styles.sizeRow}>
                    <button
                        type="button"
                        className={styles.stepButton}
                        onClick={() => handleFontSizeStep(-1)}
                        aria-label="Уменьшить размер"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        className={styles.numberInput}
                        value={fontSizeInput}
                        min={8}
                        max={200}
                        onChange={(e) => handleFontSizeInputChange(e.target.value)}
                        onBlur={handleFontSizeBlur}
                    />
                    <button
                        type="button"
                        className={styles.stepButton}
                        onClick={() => handleFontSizeStep(1)}
                        aria-label="Увеличить размер"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Цвет</label>
                <input
                    type="color"
                    className={styles.colorInput}
                    value={fontColor}
                    onChange={(e) => handleFontColorChange(e.target.value)}
                />
            </div>
        </div>
    )
}

export { TextStylePanel }