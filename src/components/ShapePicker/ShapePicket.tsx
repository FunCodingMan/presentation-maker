import React from 'react';
import styles from './ShapePicker.module.css';

type ShapePickerProps = {
    onChange: (shape: 'rectangle' | 'circle' | 'triangle') => void;
    className?: string;
};

const SHAPES = [
    { label: '🟩 Фигура...', value: '' },
    { label: '▭ Прямоугольник', value: 'rectangle' },
    { label: '◯ Круг', value: 'circle' },
    { label: '△ Треугольник', value: 'triangle' }
];

function ShapePicker({ onChange, className = '' }: ShapePickerProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as 'rectangle' | 'circle' | 'triangle' | '';
        
        if (value !== '') {
            onChange(value);
            e.target.value = ''; 
        }
    };

    return (
        <select
            className={`${styles.shapeSelect}`}
            onChange={handleChange}
            defaultValue=''
        >
            {SHAPES.map((shape, idx) => (
                <option
                    key={idx}
                    value={shape.value}
                    hidden={shape.value === ''}
                >
                    {shape.label}
                </option>
            ))}
        </select>
    )
}

export { ShapePicker }