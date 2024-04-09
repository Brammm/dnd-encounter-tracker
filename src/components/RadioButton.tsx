import {ChangeEvent} from 'react';

type Props = {
    id: string;
    label: string;
    name: string;
    value: string;
    checked?: boolean;
    onChange?: (value: string) => void;
};

export default function RadioButton({checked, id, label, name, onChange, value}: Props) {
    const handleChange = onChange ? (e: ChangeEvent<HTMLInputElement>) => onChange(e.currentTarget.value) : undefined;

    return (
        <label htmlFor={id} className="flex flex-row items-center">
            <input
                id={id}
                name={name}
                type="radio"
                value={value}
                className="mr-2"
                onChange={handleChange}
                checked={checked}
            />
            {label}
        </label>
    );
}
