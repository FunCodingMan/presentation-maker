import { useBackgroundPanel } from '../workspace/customHooks/useBackgroundPanel.js'
import type { Background } from '../../model/types/slide.js'
import styles from './BackgroundPanel.module.css'

type BackgroundPanelProps = {
    activeSlideId: string | null
    background: Background
}

export function BackgroundPanel({ activeSlideId, background }: BackgroundPanelProps) {
    const {
        handleColorChange,
        handleClear,
        handleImageUpload,
        gradType, setGradType,
        gradColor1, setGradColor1,
        gradColor2, setGradColor2,
        gradAngle, setGradAngle,
        handleGradientChange
    } = useBackgroundPanel({ activeSlideId, background })

    const currentColor = background.type === 'color' ? background.color : '#ffffff'

    return (
        <div className={styles.panel} onMouseDown={(e) => e.stopPropagation()}>
            <h3 className={styles.title}>Фон слайда</h3>
            
            <div className={styles.section}>
                <label className={styles.label}>Сплошной цвет</label>
                <input 
                    type="color" 
                    value={currentColor} 
                    onChange={(e) => handleColorChange(e.target.value)}
                    className={styles.colorInput}
                />
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Фоновое изображение</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                />
            </div>

            <div className={styles.section}>
                <label className={styles.label}>Градиент</label>
                <select 
                    value={gradType} 
                    onChange={(e) => setGradType(e.target.value as 'linear' | 'radial')}
                    className={styles.select}
                >
                    <option value="linear">Линейный</option>
                    <option value="radial">Радиальный</option>
                </select>
                
                <div className={styles.row}>
                    <input type="color" value={gradColor1} onChange={(e) => setGradColor1(e.target.value)} />
                    <input type="color" value={gradColor2} onChange={(e) => setGradColor2(e.target.value)} />
                </div>

                {gradType === 'linear' && (
                    <div className={styles.row}>
                        <span className={styles.smallLabel}>Угол:</span>
                        <input 
                            type="range" 
                            min="0" max="360" 
                            value={gradAngle} 
                            onChange={(e) => setGradAngle(Number(e.target.value))} 
                        />
                        <span>{gradAngle}°</span>
                    </div>
                )}
                
                <button className={styles.applyBtn} onClick={handleGradientChange}>
                    Применить градиент
                </button>
            </div>

            <div className={styles.footer}>
                <button className={styles.clearBtn} onClick={handleClear}>
                    Убрать фон
                </button>
            </div>
        </div>
    )
}