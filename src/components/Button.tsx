import {ReactNode} from 'react';
import {clsx} from 'clsx';

type Size = 'normal' | 'small';
type Impact = 'primary' | 'secondary';

type Props = {
    children: ReactNode;
    disabled?: boolean;
    impact?: Impact;
    onClick?: () => void;
    size?: Size;
    submit?: boolean;
};

const sizeClasses: Record<Size, string> = {
    normal: 'px-3 py-2',
    small: 'px-2 py-0.5',
};
const impactClasses: Record<Impact, string> = {
    primary: 'border border-primary bg-primary hover:bg-highlight hover:border-highlight',
    secondary: 'border border-accent bg-accent hover:opacity-80 disabled:opacity-80',
};

export default function Button({
    children,
    disabled = false,
    impact = 'primary',
    onClick,
    size = 'normal',
    submit,
}: Props) {
    return (
        <button
            className={clsx(
                'h-min inline-flex items-center rounded gap-x-1.5 text-white ',
                sizeClasses[size],
                impactClasses[impact],
            )}
            disabled={disabled}
            type={submit ? 'submit' : 'button'}
            onClick={!submit && onClick ? onClick : undefined}
        >
            {children}
        </button>
    );
}
