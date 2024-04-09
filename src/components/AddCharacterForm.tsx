import {FormEvent, useState} from 'react';
import Button from './Button.tsx';
import RadioButton from './RadioButton.tsx';
import InputGroup from './InputGroup.tsx';
import InitiativeInput from './InitiativeInput.tsx';
import HpInput from './HpInput.tsx';
import NameComboBox, {CharacterData} from './NameComboBox.tsx';
import Input from './Input.tsx';

type CharacterType = 'PC' | 'NPC';

type Props = {
    onAdd: (type: CharacterType, name: string, initiative: number, hp?: number) => void;
};

type FormState = {type: CharacterType; name: string; hp: string; initiative: string; settings: {multiplier: number}};

export default function AddCharacterForm({onAdd}: Props) {
    const [state, setState] = useState<FormState>({
        type: 'NPC',
        name: '',
        hp: '',
        initiative: '',
        settings: {
            multiplier: 1,
        },
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        let initiative = parseInt(state.initiative);
        if (isNaN(initiative)) {
            initiative = 0;
        }

        let hp: number | string | undefined = state.hp;
        if (!hp) {
            hp = undefined;
        } else {
            hp = parseInt(hp);
            if (isNaN(hp)) {
                hp = 0;
            }
        }

        onAdd(state.type, state.name, initiative, hp);
    }

    function handleCharacterSelect(data: CharacterData) {
        setState((prevState) => {
            prevState.name = data.name;
            if (!data.custom) {
                prevState.hp = Math.floor(parseInt(data.hp.average) * state.settings.multiplier).toString();
            }

            return {...prevState};
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={'flex gap-x-4 my-6'}>
                <p className="flex flex-col justify-end">
                    <RadioButton
                        checked={state.type === 'NPC'}
                        id="type-NPC"
                        label="NPC"
                        name="type"
                        value="NPC"
                        onChange={(value) => setState((prevState) => ({...prevState, type: value as 'PC' | 'NPC'}))}
                    />
                    <RadioButton
                        checked={state.type === 'PC'}
                        id="type-PC"
                        label="PC"
                        name="type"
                        value="PC"
                        onChange={(value) => setState((prevState) => ({...prevState, type: value as 'PC' | 'NPC'}))}
                    />
                </p>
                <InputGroup id="name" label="Name">
                    <NameComboBox
                        onChange={handleCharacterSelect}
                        value={{name: state.name, hp: {average: '', formula: ''}, custom: false}}
                    />
                </InputGroup>
                <InputGroup id="hp" label="HP">
                    <HpInput
                        name="hp"
                        value={state.hp}
                        onChange={(value) => setState((prevState) => ({...prevState, hp: value}))}
                    />
                </InputGroup>
                <InputGroup id="initiative" label="Initiative">
                    <InitiativeInput
                        name="initiative"
                        onChange={(value) => setState((prevState) => ({...prevState, initiative: value}))}
                    />
                </InputGroup>
                <div className="flex flex-col justify-end">
                    <Button submit>Add</Button>
                </div>
            </div>
            <div>
                <InputGroup id="multiplier" label="Multiplier">
                    <Input
                        type="number"
                        name="multiplier"
                        onChange={(value) =>
                            setState((prevState) => ({
                                ...prevState,
                                settings: {...prevState.settings, multiplier: parseFloat(value)},
                            }))
                        }
                        step={0.1}
                        value={state.settings.multiplier.toString()}
                    />
                </InputGroup>
            </div>
        </form>
    );
}
