import {KeyboardEvent, ChangeEvent, useRef, useState} from 'react';
import {flushSync} from 'react-dom';

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export default function EditableText({onChange, value}: Props) {
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

    return <input type="text" defaultValue={value} onBlur={handleChange} ref={ref} onKeyDown={handleSave} />;
}
