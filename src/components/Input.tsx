import React from 'react';
import {clsx} from 'clsx';

export type InputProps = {
    id?: string;
    name: string;
    type?: 'text' | 'number';
};

export const defaultClassName = 'border-gray-500 rounded';

export default function Input({id, name, type = 'text'}: InputProps) {
    const extraProps: React.InputHTMLAttributes<HTMLInputElement> = type === 'number' ? {step: 1, min: 0} : {};

    return <input id={id} name={name} type={type} className={clsx(defaultClassName, 'w-56')} {...extraProps} />;
}
