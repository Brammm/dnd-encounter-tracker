import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    htmlFor: string;
};

export default function Label({ children, htmlFor }: Props) {
    return <label htmlFor={htmlFor}>{children}</label>;
}
