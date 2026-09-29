import styles from './TextInput.module.css';

type TextInputProps = {
    value: string
    placeHolder?: string;
    type?: 'text' | 'color' | 'number'
    onChange?: (value: string) => void
    className?: string
}

function TextInput({value, placeHolder, type = 'text', onChange, className = ''}: TextInputProps) {
    return (
        <input
            type={type}
            value={value}
            placeholder={placeHolder}
            className={`${styles.input} ${className}`}
            onChange={(e) => {
                if (onChange) {
                    onChange(e.target.value)
                }
            }}
        />
    )
}

export { TextInput }