import { useTextStylePanel } from '../workspace/customHooks/useTextStylePanel.js'
import type { TextStyle, SlideObject } from '../../model/types/objects.js'
import styles from './TextStylePanel.module.css'

type TextStylePanelProps = {
    activeSlideId: string | null
    selectedObjectIds: string[]
    objects: SlideObject[]
}

const FONT_FAMILIES = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New',
    'Verdana', 'Tahoma', 'Trebuchet MS', 'Comic Sans MS', 'Impact',
]

type StyleButtonDef = {
    key: TextStyle['fontStyle'][number]
    label: string
    title: string
    iconStyle: React.CSSProperties
}

const STYLE_BUTTONS: StyleButtonDef[] = [
    {
        key: 'bold',
        label: 'B',
        title: 'Жирный',
        iconStyle: { fontWeight: 700 },
    },
    {
        key: 'italic',
        label: 'I',
        title: 'Курсив',
        iconStyle: { fontStyle: 'italic', fontFamily: 'Georgia, serif' },
    },
    {
        key: 'underline',
        label: 'U',
        title: 'Подчёркнутый',
        iconStyle: { textDecoration: 'underline' },
    },
    {
        key: 'strikethrough',
        label: 'S',
        title: 'Зачёркнутый',
        iconStyle: { textDecoration: 'line-through' },
    },
]

function TextStylePanel({ activeSlideId, selectedObjectIds, objects }: TextStylePanelProps) {
    const {
        isVisible,
        fontFamily,
        fontSizeInput,
        fontColor,
        fontStyle,
        handleFontFamilyChange,
        handleFontSizeInputChange,
        handleFontSizeBlur,
        handleFontSizeStep,
        handleFontColorChange,
        handleFontStyleToggle,
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
                    >−</button>
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
                    >+</button>
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Начертание</label>
                <div className={styles.styleRow}>
                    {STYLE_BUTTONS.map(({ key, label, title, iconStyle }) => {
                        const isActive = fontStyle.includes(key)
                        return (
                            <button
                                key={key}
                                type="button"
                                className={`${styles.styleButton} ${isActive ? styles.styleButtonActive : ''}`}
                                onClick={() => handleFontStyleToggle(key)}
                                title={title}
                                aria-pressed={isActive}
                            >
                                <span style={iconStyle}>{label}</span>
                            </button>
                        )
                    })}
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