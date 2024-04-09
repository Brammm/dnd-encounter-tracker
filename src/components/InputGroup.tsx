import React, {ReactElement} from 'react';
import {InputProps} from './Input.tsx';
import Label from './Label.tsx';

type Props = {
    children: ReactElement<InputProps>;
    id: string;
    label: string;
};

export default function InputGroup({children, id, label}: Props) {
    const input = React.cloneElement(children, {id});

    return (
        <div className="flex flex-col">
            <Label htmlFor={id}>{label}</Label>
            {input}
        </div>
    );
}
