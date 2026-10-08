import styles from './ColorPicker.module.css';

type ColorPickerProps = {
    value: string;
    onChange: (value: string) => void;
    className?: string;
};

function ColorPicker({ value, onChange, className = '' }: ColorPickerProps) {
    return (
        <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${styles.colorInput} ${className}`}
        />
    );
}

export { ColorPicker };