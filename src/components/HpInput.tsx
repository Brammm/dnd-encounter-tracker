import {clsx} from 'clsx';
import {defaultClassName} from './Input.tsx';

type Props = {
    id?: string;
    name: string;
};

export default function HpInput({id, name}: Props) {
    return <input id={id} name={name} type="number" className={clsx(defaultClassName, 'w-16')} step={1} min={0} />;
}
