import {FormEvent, useState} from 'react';
import Button from '../Button.tsx';
import RadioButton from '../RadioButton.tsx';
import InputGroup from '../InputGroup.tsx';
import InitiativeInput from '../InitiativeInput.tsx';
import HpInput from '../HpInput.tsx';
import NameComboBox, {CharacterData} from '../NameComboBox.tsx';
import Input from '../Input.tsx';
import {calculateMaximum} from '../../util/calculator.ts';
import useApp from '../../hooks/useApp.tsx';

type CharacterType = 'PC' | 'NPC';

type Props = {
    onAdd: (type: CharacterType, amount: number, name: string, initiative: number, hp?: number) => void;
};

type FormState = {
    type: CharacterType;
    name: string;
    hp: string;
    initiative: string;
    amount: number;
};

export default function AddCharacterForm({onAdd}: Props) {
    const {settings, updateSettings} = useApp();
    const [state, setState] = useState<FormState>({
        type: 'NPC',
        name: '',
        hp: '',
        initiative: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (state.name.trim() === '') {
            alert('Name cant be empty!');
            return;
        }

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

        onAdd(state.type, state.amount, state.name.trim(), initiative, hp);
    }

    function handleCharacterSelect(data: CharacterData) {
        setState((prevState) => {
            prevState.name = data.name;
            if (!data.custom && data.hp) {
                const baseHp =
                    settings.hpType === 'AVERAGE' ? parseInt(data.hp.average) : calculateMaximum(data.hp.formula);

                prevState.hp = Math.floor(baseHp * settings.multiplier).toString();
            }

            return {...prevState};
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <div>
                    <p>Character type</p>
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
                </div>
                <InputGroup id="name" label="Name">
                    <NameComboBox
                        onChange={handleCharacterSelect}
                        value={{name: state.name, hp: {average: '', formula: ''}, custom: false}}
                    />
                </InputGroup>
                <div className="flex gap-x-4">
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
                </div>
                <div>
                    <Button submit>Add</Button>
                    <div className="w-16">
                        <Input
                            name="amount"
                            type="number"
                            step={1}
                            value={state.amount.toString()}
                            onChange={(value) =>
                                setState((prevState) => ({
                                    ...prevState,
                                    amount: isNaN(parseInt(value)) ? 1 : parseInt(value),
                                }))
                            }
                        />
                    </div>
                </div>
            </div>
            <hr className="my-8" />
            <h2 className="text-xl font-serif mb-2">Settings</h2>
            <div className={'flex flex-col gap-4'}>
                <div>
                    <p>Set HP to:</p>
                    <p className="flex flex-col justify-end">
                        <RadioButton
                            checked={settings.hpType === 'AVERAGE'}
                            id="hp-type-AVERAGE"
                            label="Average"
                            name="hp-type"
                            value="AVERAGE"
                            onChange={(value) => updateSettings(settings.multiplier, value as 'AVERAGE' | 'FORMULA')}
                        />
                        <RadioButton
                            checked={settings.hpType === 'FORMULA'}
                            id="hp-type-FORMULA"
                            label="Max of formula (e.g. 2d4 = 8)"
                            name="hp-type"
                            value="FORMULA"
                            onChange={(value) => updateSettings(settings.multiplier, value as 'AVERAGE' | 'FORMULA')}
                        />
                    </p>
                </div>
                <InputGroup id="multiplier" label="Multiplier">
                    <Input
                        type="number"
                        name="multiplier"
                        onChange={(value) => updateSettings(parseFloat(value), settings.hpType)}
                        step={0.1}
                        value={settings.multiplier.toString()}
                    />
                </InputGroup>
            </div>
        </form>
    );
}
