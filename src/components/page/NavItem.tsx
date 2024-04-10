import {ReactNode} from 'react';
import {clsx} from 'clsx';

type Props = {
    active?: boolean;
    children: ReactNode;
    onClick: () => void;
};

export default function NavItem({active = false, children, onClick}: Props) {
    return (
        <button
            className={clsx(
                'w-full text-left px-4 py-1 rounded',
                active ? 'bg-highlight text-white' : 'text-highlight hover:bg-primary hover:text-white',
            )}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
