import {clsx} from 'clsx';
import {defaultClassName} from './Input.tsx';
import React, {forwardRef} from 'react';

type Props = Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type' | 'className' | 'step' | 'min' | 'max'
>;

const InitiativeInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    return (
        <input
            type="number"
            className={clsx(defaultClassName, 'w-16')}
            step={1}
            min={1}
            max={30}
            {...props}
            ref={ref}
        />
    );
});

export default InitiativeInput;
