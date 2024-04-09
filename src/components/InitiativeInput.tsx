import {clsx} from 'clsx';
import {defaultClassName} from './Input.tsx';
import React, {ChangeEvent, forwardRef} from 'react';

type Props = Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type' | 'className' | 'step' | 'min' | 'max' | 'onChange'
> & {onChange?: (value: string) => void};

const InitiativeInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const onChange = props.onChange;
    const handleChange = onChange ? (e: ChangeEvent<HTMLInputElement>) => onChange(e.currentTarget.value) : undefined;
    return (
        <input
            type="number"
            className={clsx(defaultClassName, 'w-16')}
            step={1}
            min={1}
            max={30}
            {...props}
            ref={ref}
            onChange={handleChange}
        />
    );
});

export default InitiativeInput;
