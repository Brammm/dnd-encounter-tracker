import type React from 'react';
import type { ChangeEvent } from 'react';

export type InputProps = {
    id?: string;
    name: string;
    type?: 'text' | 'number';
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    step?: number;
};

export const defaultInputClassName =
    'border-gray-400 shadow-xs rounded-sm w-full';

export default function Input({
    id,
    name,
    onChange,
    required,
    step = 1,
    type = 'text',
    value,
}: InputProps) {
    const extraProps: React.InputHTMLAttributes<HTMLInputElement> =
        type === 'number' ? { step, min: 0 } : {};

    const handleChange = onChange
        ? (e: ChangeEvent<HTMLInputElement>) => onChange(e.currentTarget.value)
        : undefined;

    return (
        <input
            id={id}
            name={name}
            type={type}
            className={defaultInputClassName}
            value={value}
            onChange={handleChange}
            required={required}
            {...extraProps}
        />
    );
}
