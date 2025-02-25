import { clsx } from 'clsx';
import type { ReactNode } from 'react';

type Props = {
    active?: boolean;
    children: ReactNode;
    onClick: () => void;
};

export default function NavItem({ active = false, children, onClick }: Props) {
    return (
        <button
            className={clsx(
                'w-full text-left px-4 py-1 rounded-sm',
                active
                    ? 'bg-highlight text-white'
                    : 'text-highlight hover:bg-primary hover:text-white',
            )}
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            type="button"
        >
            {children}
        </button>
    );
}
