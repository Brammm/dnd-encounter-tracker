import {KeyboardEvent, ChangeEvent, useRef, useState, RefObject, ReactElement} from 'react';
import {flushSync} from 'react-dom';

type InputProps = {
    defaultValue: string;
    onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    ref: RefObject<HTMLInputElement>;
};

type Props = {
    value: string;
    onChange: (value: string) => void;
    children?: (props: InputProps) => ReactElement;
};

export default function EditableText({children, onChange, value}: Props) {
    const [editing, setEditing] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const handleEdit = () => {
        flushSync(() => {
            setEditing(true);
        });
        ref.current?.select();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditing(false);
        onChange(e.currentTarget.value);
    };

    const handleSave = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Escape') {
            setEditing(false);
        }

        if (e.code === 'Enter') {
            setEditing(false);
            onChange(e.currentTarget.value);
        }
    };

    if (!editing) {
        return <button onClick={handleEdit}>{value}</button>;
    }

    const inputProps: InputProps = {
        defaultValue: value,
        onBlur: handleChange,
        onKeyDown: handleSave,
        ref,
    };

    if (children) {
        return children(inputProps);
    }

    return <input type="text" className="text-gray-800 rounded" {...inputProps} />;
}
