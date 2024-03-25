import {ReactNode} from 'react';
import {clsx} from 'clsx';

type Props = {
    children: ReactNode;
    onClick?: () => void;
    submit?: boolean;
    size?: 'small' | 'normal';
};

export default function Button({children, onClick, size = 'normal', submit}: Props) {
    return (
        <button
            className={clsx(
                'border border-primary h-min inline-flex items-center bg-primary rounded gap-x-1.5 text-white hover:opacity-70',
                size === 'normal' ? 'px-3 py-2' : 'px-2 py-0.5',
            )}
            type={submit ? 'submit' : 'button'}
            onClick={!submit && onClick ? onClick : undefined}
        >
            {children}
        </button>
    );
}
