import {PropsWithChildren} from 'react';

type Props = {
    type: 'skull' | 'player';
    className?: string;
};

export default function Icon({className, type}: Props) {
    const Svg = ({children, viewBox}: PropsWithChildren<{viewBox: string}>) => (
        <svg className={className} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
            {children}
        </svg>
    );

    switch (type) {
        case 'player':
            return (
                <Svg viewBox="0 0 448 512">
                    <path
                        d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                        fill="currentColor"
                    />
                </Svg>
            );
        case 'skull':
            return (
                <Svg viewBox="0 0 512 512">
                    <path
                        d="M416 398.9c58.5-41.1 96-104.1 96-174.9C512 100.3 397.4 0 256 0S0 100.3 0 224c0 70.7 37.5 133.8 96 174.9c0 .4 0 .7 0 1.1v64c0 26.5 21.5 48 48 48h48V464c0-8.8 7.2-16 16-16s16 7.2 16 16v48h64V464c0-8.8 7.2-16 16-16s16 7.2 16 16v48h48c26.5 0 48-21.5 48-48V400c0-.4 0-.7 0-1.1zM96 256a64 64 0 1 1 128 0A64 64 0 1 1 96 256zm256-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                        fill="currentColor"
                    />
                </Svg>
            );
    }
}
