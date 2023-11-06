import {useEffect, useRef, useState} from 'react';

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export default function HiddenInput({onChange, value}: Props) {
    const [editing, setEditing] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing && ref.current) {
            ref.current.focus();
        }
    }, [editing]);

    if (!editing) {
        return <span onClick={() => setEditing(true)}>{value}</span>;
    }

    return (
        <input
            type="text"
            defaultValue={value}
            onBlur={(e) => {
                setEditing(false);
                onChange(e.currentTarget.value);
            }}
            ref={ref}
        />
    );
}
