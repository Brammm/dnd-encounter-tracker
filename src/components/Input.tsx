import React, {ChangeEvent} from 'react';
import {clsx} from 'clsx';

export type InputProps = {
    id?: string;
    name: string;
    type?: 'text' | 'number';
    value?: string;
    onChange?: (value: string) => void;
    step?: number;
};

export const defaultClassName = 'border-gray-400 shadow-sm rounded w-full';

export default function Input({id, name, onChange, step = 1, type = 'text', value}: InputProps) {
    const extraProps: React.InputHTMLAttributes<HTMLInputElement> = type === 'number' ? {step, min: 0} : {};

    const handleChange = onChange ? (e: ChangeEvent<HTMLInputElement>) => onChange(e.currentTarget.value) : undefined;

    return (
        <input
            id={id}
            name={name}
            type={type}
            className={clsx(defaultClassName, 'w-56')}
            value={value}
            onChange={handleChange}
            {...extraProps}
        />
    );
}
