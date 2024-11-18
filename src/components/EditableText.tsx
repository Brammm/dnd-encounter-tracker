import {
    type ChangeEvent,
    type KeyboardEvent,
    type ReactElement,
    type ReactNode,
    type RefObject,
    useRef,
    useState,
} from 'react';
import { flushSync } from 'react-dom';

type InputProps = {
    defaultValue: string;
    onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    ref: RefObject<HTMLInputElement>;
};

type Props = {
    value: string;
    renderValueAs?: ReactNode;
    onChange: (value: string) => void;
    children?: (props: InputProps) => ReactElement;
};

export default function EditableText({
    children,
    onChange,
    renderValueAs,
    value,
}: Props) {
    const [editing, setEditing] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const handleEdit = () => {
        flushSync(() => {
            setEditing(true);
        });
        ref.current?.select();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditing(false);
        onChange(e.currentTarget.value);
    };

    const handleSave = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Escape') {
            setEditing(false);
        }

        if (e.code === 'Enter') {
            setEditing(false);
            onChange(e.currentTarget.value);
        }
    };

    if (!editing) {
        return (
            <button onClick={handleEdit} type="button">
                {renderValueAs || value}
            </button>
        );
    }

    const inputProps: InputProps = {
        defaultValue: value,
        onBlur: handleChange,
        onKeyDown: handleSave,
        ref,
    };

    if (children) {
        return children(inputProps);
    }

    return (
        <input type="text" className="text-gray-800 rounded" {...inputProps} />
    );
}
