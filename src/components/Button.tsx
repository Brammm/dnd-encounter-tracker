import {ReactNode} from 'react';
import {clsx} from 'clsx';

type Size = 'normal' | 'small';
type Impact = 'primary' | 'secondary';

type Props = {
    children: ReactNode;
    onClick?: () => void;
    submit?: boolean;
    size?: Size;
    impact?: Impact;
};

const sizeClasses: Record<Size, string> = {
    normal: 'px-3 py-2',
    small: 'px-2 py-0.5',
};
const impactClasses: Record<Impact, string> = {
    primary: 'border border-primary bg-primary hover:bg-highlight hover:border-highlight',
    secondary: 'border border-accent bg-accent hover:opacity-80',
};

export default function Button({children, impact = 'primary', onClick, size = 'normal', submit}: Props) {
    return (
        <button
            className={clsx(
                'h-min inline-flex items-center rounded gap-x-1.5 text-white ',
                sizeClasses[size],
                impactClasses[impact],
            )}
            type={submit ? 'submit' : 'button'}
            onClick={!submit && onClick ? onClick : undefined}
        >
            {children}
        </button>
    );
}
