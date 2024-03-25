import {FormEvent} from 'react';
import Button from './Button.tsx';
import RadioButton from './RadioButton.tsx';
import InputGroup from './InputGroup.tsx';
import Input from './Input.tsx';
import InitiativeInput from './InitiativeInput.tsx';
import HpInput from './HpInput.tsx';

type Props = {
    onAdd: (type: 'PC' | 'NPC', name: string, initiative: number, hp?: number) => void;
};

interface FormElements extends HTMLFormControlsCollection {
    'type-PC': HTMLInputElement;
    'type-NPC': HTMLInputElement;
    name: HTMLInputElement;
    initiative: HTMLInputElement;
    hp: HTMLInputElement;
}
interface AddPlayerFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

export default function AddCharacterForm({onAdd}: Props) {
    function handleSubmit(e: FormEvent<AddPlayerFormElement>) {
        e.preventDefault();
        const elements = e.currentTarget.elements;

        let initiative = parseInt(elements.initiative.value);
        if (isNaN(initiative)) {
            initiative = 0;
        }

        let hp: number | string | undefined = elements.hp.value;
        if (!hp) {
            hp = undefined;
        } else {
            hp = parseInt(hp);
            if (isNaN(hp)) {
                hp = 0;
            }
        }

        onAdd(elements['type-PC'].checked ? 'PC' : 'NPC', elements.name.value, initiative, hp);
    }

    return (
        <form onSubmit={handleSubmit} className={'flex gap-x-4 my-6'}>
            <p className="flex flex-col justify-end">
                <RadioButton id="type-PC" label="PC" name="type" value="PC" />
                <RadioButton id="type-NPC" label="NPC" name="type" value="NPC" />
            </p>
            <InputGroup id="name" label="Name">
                <Input name="name" />
            </InputGroup>
            <InputGroup id="hp" label="HP">
                <HpInput name="hp" />
            </InputGroup>
            <InputGroup id="initiative" label="Initiative">
                <InitiativeInput name="initiative" />
            </InputGroup>
            <div className="flex flex-col justify-end">
                <Button submit>Add</Button>
            </div>
        </form>
    );
}
