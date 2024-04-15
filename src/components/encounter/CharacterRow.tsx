import useApp, {Character} from '../../hooks/useApp.tsx';
import {useState} from 'react';
import EditableText from '../EditableText.tsx';
import {clsx} from 'clsx';
import {BugAntIcon, ChevronDownIcon, ChevronUpIcon, UserIcon, XMarkIcon} from '@heroicons/react/24/solid';
import ModifyHealth from './ModifyHealth.tsx';
import InitiativeInput from '../InitiativeInput.tsx';
import HpHistory from './HpHistory.tsx';
import calculateCurrentHp from '../../util/currentHp.ts';

type Props = {
    character: Character;
    encounterId: string;
};

export function CharacterRow({character, encounterId}: Props) {
    const {deleteCharacter, encounterStarted, renameCharacter, updateInitiative} = useApp(
        ({deleteCharacter, encounters, renameCharacter, updateInitiative}) => ({
            deleteCharacter,
            renameCharacter,
            updateInitiative,
            encounterStarted: encounters[encounterId].turn !== undefined,
        }),
    );
    const [showHistory, setShowHistory] = useState<boolean>(false);

    const currentHp = calculateCurrentHp(character);

    let hpPercentage: number | undefined;
    if (character.hp !== undefined && currentHp !== undefined) {
        hpPercentage = (currentHp / character.hp) * 100;
    }

    const CharacterIcon = character.type === 'PC' ? UserIcon : BugAntIcon;

    const handleDelete = () => {
        if (!confirm('Are you sure you wish to delete this character?')) {
            return;
        }

        deleteCharacter(encounterId, character.id);
    };

    const handleRename = (value: string) => {
        if (!value.trim()) {
            alert('Name cant be empty!');
            return;
        }

        renameCharacter(encounterId, character.id, value.trim());
    };

    return (
        <div className={clsx('border rounded-lg', character.takingTurn ? 'border-primary' : 'border-gray-200')}>
            <div className={clsx('flex')}>
                <div
                    className={clsx(
                        'flex flex-col p-2',
                        showHistory ? 'rounded-tl-lg' : 'rounded-l-lg',
                        character.takingTurn ? 'bg-primary text-white' : 'bg-gray-200',
                    )}
                >
                    <span>Initiative</span>
                    <EditableText
                        value={character.initiative.toString()}
                        onChange={(value) => updateInitiative(encounterId, character.id, parseInt(value))}
                    >
                        {(props) => <InitiativeInput {...props} />}
                    </EditableText>
                </div>
                <div className="group place-self-center px-4 flex">
                    <button onClick={handleDelete} type="button">
                        <CharacterIcon className="h-4 mr-2 text-gray-400 place-self-center group-hover:hidden" />
                        <XMarkIcon className="h-4 mr-2 text-gray-400 place-self-center hidden group-hover:inline-block" />
                    </button>
                    <EditableText value={character.name} onChange={handleRename} />
                </div>
                {character.hp !== undefined && (
                    <div
                        className={clsx(
                            'flex border-l p-2 place-items-center gap-x-4',
                            character.takingTurn ? 'border-primary' : 'border-gray-200',
                        )}
                    >
                        <div className="flex relative h-full items-center">
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
                        {encounterStarted && <ModifyHealth characterId={character.id} encounterId={encounterId} />}
                    </div>
                )}
                {character.hpChanges.length > 0 && (
                    <div className="flex ml-auto place-items-center border-l px-2">
                        <button onClick={() => setShowHistory(!showHistory)}>
                            {showHistory ? <ChevronUpIcon className="h-4" /> : <ChevronDownIcon className="h-4" />}
                        </button>
                    </div>
                )}
            </div>
            {showHistory && (
                <div className={clsx('border-t p-4', character.takingTurn ? 'border-primary' : 'border-gray-200')}>
                    <HpHistory hpChanges={character.hpChanges} />
                </div>
            )}
        </div>
    );
}
