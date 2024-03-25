type Props = {
    id: string;
    label: string;
    name: string;
    value: string;
};

export default function RadioButton({id, label, name, value}: Props) {
    return (
        <p>
            <label htmlFor={id} className="flex flex-row items-center">
                <input id={id} name={name} type="radio" value={value} className="mr-2" />
                {label}
            </label>
        </p>
    );
}
