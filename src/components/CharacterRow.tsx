import Icon from './Icon';
import useApp, {Character} from '../hooks/useApp';
import {useState} from 'react';
import HiddenInput from './HiddenInput.tsx';

type Props = {
    character: Character;
    encounterId: string;
};

export function CharacterRow({character, encounterId}: Props) {
    const {hpChanges, modifyHp, updateInitiative} = useApp(({encounters, modifyHp, updateInitiative}) => ({
        modifyHp,
        updateInitiative,
        hpChanges: encounters[encounterId].hpChanges.filter((hpChange) => hpChange.characterId === character.id),
    }));
    const [amount, setAmount] = useState<string>('');

    const handleModify = (multiplier: number = 1) => {
        modifyHp(encounterId, character.id, parseInt(amount) * multiplier);
    };

    const currentHp = hpChanges.length > 0 ? hpChanges.at(-1)!.changedHp : character.hp;

    return (
        <div className="flex border rounded-lg mb-2 border-gray-200">
            <div className="flex flex-col bg-gray-200 p-2">
                <span>Initiative</span>
                <HiddenInput
                    value={character.initiative.toString()}
                    onChange={(value) => updateInitiative(encounterId, character.id, parseInt(value))}
                />
            </div>
            <div className="place-self-center px-4 flex">
                {character.type === 'PC' && <Icon className="h-4 mr-2 text-gray-400 place-self-center" type="player" />}
                {character.type === 'NPC' && <Icon className="h-4 mr-2 text-gray-400 place-self-center" type="skull" />}
                {character.name}
            </div>
            {character.hp !== undefined && (
                <div className="flex border-l p-2 place-self-center">
                    <div className="flex flex-col">
                        <span>HP</span>
                        <span>
                            <abbr title={character.hp.toString()}>{currentHp}</abbr>
                        </span>
                    </div>
                    <div>
                        <input
                            type="number"
                            name={`character-hp-${character.id}`}
                            value={amount}
                            onChange={(e) => setAmount(e.currentTarget.value)}
                        />
                        <button type="button" onClick={() => handleModify()}>
                            Heal
                        </button>
                        <button type="button" onClick={() => handleModify(-1)}>
                            Damage
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
