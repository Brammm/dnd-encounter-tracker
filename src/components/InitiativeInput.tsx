import {clsx} from 'clsx';
import {defaultClassName} from './Input.tsx';

type Props = {
    id?: string;
    name: string;
};

export default function InitiativeInput({id, name}: Props) {
    return (
        <input id={id} name={name} type="number" className={clsx(defaultClassName, 'w-16')} step={1} min={1} max={30} />
    );
}
