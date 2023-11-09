import Icon from './Icon';
import useApp, {Character} from '../hooks/useApp';
import {useState} from 'react';
import EditableText from './EditableText.tsx';
import {clsx} from 'clsx';

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

    let hpPercentage: number | undefined;
    if (character.hp !== undefined && currentHp !== undefined) {
        hpPercentage = (currentHp / character.hp) * 100;
    }

    return (
        <div
            className={clsx(
                'flex border rounded-lg mb-2',
                character.takingTurn ? 'border-cyan-400' : 'border-gray-200',
            )}
        >
            <div className={clsx('flex flex-col p-2 rounded-l', character.takingTurn ? 'bg-cyan-400' : 'bg-gray-200')}>
                <span>Initiative</span>
                <EditableText
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
                <div className="flex border-l p-2 place-items-center">
                    <div className="relative">
                        <span>
                            <abbr title={character.hp.toString()}>{currentHp}</abbr> HP
                        </span>
                        {hpPercentage !== undefined && (
                            <div
                                className={clsx(
                                    'absolute bottom-0 w-full rounded-full h-1.5',
                                    hpPercentage === 0 ? 'bg-black' : 'bg-gray-500',
                                )}
                            >
                                <div
                                    className={clsx(
                                        'h-1.5 rounded-full',
                                        hpPercentage >= 60
                                            ? 'bg-green-600'
                                            : hpPercentage >= 30
                                            ? 'bg-orange-400'
                                            : 'bg-red-500',
                                    )}
                                    style={{width: `${hpPercentage}%`}}
                                ></div>
                            </div>
                        )}
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
