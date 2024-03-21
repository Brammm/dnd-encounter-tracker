import useApp, {Character} from '../hooks/useApp';
import {useState} from 'react';
import EditableText from './EditableText.tsx';
import {clsx} from 'clsx';
import {BugAntIcon, ChevronDownIcon, ChevronUpIcon, UserIcon} from '@heroicons/react/24/solid';

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
    const [showHistory, setShowHistory] = useState<boolean>(false);

    const handleModify = (multiplier: number = 1) => {
        modifyHp(encounterId, character.id, parseInt(amount) * multiplier);
    };

    const currentHp = hpChanges.length > 0 ? hpChanges.at(-1)!.changedHp : character.hp;

    let hpPercentage: number | undefined;
    if (character.hp !== undefined && currentHp !== undefined) {
        hpPercentage = (currentHp / character.hp) * 100;
    }

    return (
        <div className={clsx('mb-2 border rounded-lg', character.takingTurn ? 'border-cyan-400' : 'border-gray-200')}>
            <div className={clsx('flex')}>
                <div
                    className={clsx(
                        'flex flex-col p-2',
                        showHistory ? 'rounded-tl-lg' : 'rounded-l-lg',
                        character.takingTurn ? 'bg-cyan-400' : 'bg-gray-200',
                    )}
                >
                    <span>Initiative</span>
                    <EditableText
                        value={character.initiative.toString()}
                        onChange={(value) => updateInitiative(encounterId, character.id, parseInt(value))}
                    />
                </div>
                <div className="place-self-center px-4 flex">
                    {character.type === 'PC' && <UserIcon className="h-4 mr-2 text-gray-400 place-self-center" />}
                    {character.type === 'NPC' && <BugAntIcon className="h-4 mr-2 text-gray-400 place-self-center" />}
                    {character.name}
                </div>
                {character.hp !== undefined && (
                    <div
                        className={clsx(
                            'flex border-l p-2 place-items-center',
                            character.takingTurn ? 'border-cyan-400' : 'border-gray-200',
                        )}
                    >
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
                {hpChanges.length > 0 && (
                    <div className="flex ml-auto place-items-center border-l px-2">
                        <button onClick={() => setShowHistory(!showHistory)}>
                            {showHistory ? <ChevronUpIcon className="h-4" /> : <ChevronDownIcon className="h-4" />}
                        </button>
                    </div>
                )}
            </div>
            {showHistory && (
                <div className={clsx('border-t', character.takingTurn ? 'border-cyan-400' : 'border-gray-200')}>
                    <ul>
                        {hpChanges.map((change, i) => (
                            <li key={i}>
                                Turn {change.turn}: {change.amount}HP <small>({change.changedHp}HP)</small>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
