import styles from './TextInput.module.css';

type TextInputProps = {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeHolder?: string;
    style?: React.CSSProperties;
    readonly?: boolean;
};

function TextInput({ value, onChange, className = '', placeHolder = '', style, readonly = false }: TextInputProps) {
    const handleSave = (e: React.SyntheticEvent<HTMLDivElement>) => {
        if (readonly) return
        
        const newText = (e.currentTarget as HTMLElement).innerText || '';

        if (newText !== value) {
            onChange(newText);
        }
    };


    return (
        <div
            contentEditable={!readonly}
            className={`${styles.contentEditableDiv} ${className}`}
            style={{
                ...style,
                cursor: readonly ? 'default' : 'text',
            }}
            data-placeholder={readonly ? '' : placeHolder}
            onBlur={handleSave}
            onKeyDown={(e) => {
                if (readonly) return;
                if (e.key === 'Escape' || (e.key === 'Enter' && !e.shiftKey)) {
                    e.preventDefault();
                    e.currentTarget.blur(); 
                }
            }}
        >
            {value}
        </div>
    );
}

export { TextInput }