import {ReactNode} from 'react';
import {clsx} from 'clsx';

type Props = {
    active?: boolean;
    children: ReactNode;
    onClick: () => void;
};

export default function Tab({active = false, children, onClick}: Props) {
    return (
        <button
            className={clsx(
                'p-2',
                active ? 'border-b-2 border-primary text-primary' : 'hover:border-b-2 hover:border-gray-200',
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
