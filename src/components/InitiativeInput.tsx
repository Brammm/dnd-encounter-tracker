import type React from 'react';
import { type ChangeEvent, forwardRef } from 'react';
import { defaultInputClassName } from './Input.tsx';

type Props = Omit<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
    'type' | 'className' | 'step' | 'min' | 'max' | 'onChange'
> & { onChange?: (value: string) => void };

const InitiativeInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const onChange = props.onChange;
    const handleChange = onChange
        ? (e: ChangeEvent<HTMLInputElement>) => onChange(e.currentTarget.value)
        : undefined;
    return (
        <input
            type="number"
            className={defaultInputClassName}
            step={1}
            min={1}
            max={60}
            {...props}
            ref={ref}
            onChange={handleChange}
        />
    );
});

export default InitiativeInput;
