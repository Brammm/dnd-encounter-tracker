import {defaultInputClassName} from './Input.tsx';
import {ChangeEvent} from 'react';

type Props = {
    id?: string;
    name: string;
    value?: string;
    onChange?: (value: string) => void;
};

export default function HpInput({id, name, onChange, value}: Props) {
    const handleChange = onChange ? (e: ChangeEvent<HTMLInputElement>) => onChange(e.currentTarget.value) : undefined;

    return (
        <input
            id={id}
            name={name}
            type="number"
            className={defaultInputClassName}
            step={1}
            min={1}
            value={value}
            onChange={handleChange}
        />
    );
}
