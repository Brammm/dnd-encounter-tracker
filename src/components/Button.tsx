import {ReactNode} from 'react';
import {clsx} from 'clsx';

type Props = {
    children: ReactNode;
    onClick: () => void;
};

export default function Button({children, onClick}: Props) {
    return (
        <button
            className={clsx(
                'h-min inline-flex items-center bg-primary rounded px-2.5 py-1.5 gap-x-1.5 text-white hover:opacity-70',
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
