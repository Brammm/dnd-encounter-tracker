import useApp, { Character } from '../../hooks/useApp.tsx';
import { useEffect, useState } from 'react';
import EditableText from '../EditableText.tsx';
import { clsx } from 'clsx';
import { BugAntIcon, ChevronDownIcon, ChevronUpIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/solid';
import ModifyHealth from './ModifyHealth.tsx';
import InitiativeInput from '../InitiativeInput.tsx';
import HpHistory from './HpHistory.tsx';
import calculateCurrentHp from '../../util/currentHp.ts';

type Props = {
    character: Character;
    encounterId: string;
};

export function CharacterRow({character, encounterId}: Props) {
    const {
        characterIsActive,
        deleteCharacter,
        encounterStarted,
        modifyBaseHp,
        renameCharacter,
        updateInitiative,
    } = useApp(
        ({deleteCharacter, encounters, modifyBaseHp, renameCharacter, updateInitiative}) => ({
            deleteCharacter,
            modifyBaseHp,
            renameCharacter,
            updateInitiative,
            encounterStarted: encounters[encounterId].turn !== undefined,
            characterIsActive: encounters[encounterId].activeCharacter === character.id,
        }),
    );
    const [ showHistory, setShowHistory ] = useState<boolean>(false);

    useEffect(() => {
        if (character.hpChanges.length === 0) {
            setShowHistory(false);
        }
    }, [ character.hpChanges ]);

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
            return alert('Name cant be empty!');
        }

        renameCharacter(encounterId, character.id, value.trim());
    };

    const handleHpChange = (value: string) => {
        const hp = parseInt(value);
        if (Number.isNaN(hp) || hp <= 0) {
            return alert('Starting HP must be higher than 0!');
        }

        modifyBaseHp(encounterId, character.id, parseInt(value.trim()));
    };

    return (
        <div
            className={ clsx(
                'col-span-5 grid grid-cols-subgrid overflow-clip border rounded-lg',
                characterIsActive ? 'border-primary' : 'border-gray-200',
            ) }
        >
            <div className={ clsx('flex flex-col p-1', characterIsActive ? 'bg-primary text-white' : 'bg-gray-200') }>
                <span>Initiative</span>
                <EditableText
                    value={ character.initiative.toString() }
                    onChange={ (value) => updateInitiative(encounterId, character.id, parseInt(value)) }
                >
                    { (props) => (
                        <div className="w-16">
                            <InitiativeInput { ...props } />
                        </div>
                    ) }
                </EditableText>
            </div>
            <div className="px-4 group content-center">
                <button onClick={ handleDelete } type="button">
                    <CharacterIcon className="h-4 mr-2 text-gray-400 place-self-center group-hover:hidden" />
                    <XMarkIcon className="h-4 mr-2 text-gray-400 place-self-center hidden group-hover:inline-block" />
                </button>
                <EditableText value={ character.name } onChange={ handleRename } />
            </div>
            { character.hp !== undefined && (
                <>
                    <div
                        className={ clsx(
                            'border-l p-2 content-center gap-x-4',
                            characterIsActive ? 'border-primary' : 'border-gray-200',
                        ) }
                    >
                        <div className="relative h-full content-center">
                            <span>
                                <EditableText renderValueAs={ <>
                                    <abbr title={ character.hp.toString() }>{ currentHp }</abbr> HP</> }
                                              value={ character.hp.toString() }
                                              onChange={ handleHpChange } />
                            </span>
                            { hpPercentage !== undefined && (
                                <div
                                    className={ clsx(
                                        'absolute bottom-0 w-full rounded-full h-1.5',
                                        hpPercentage === 0 ? 'bg-black' : 'bg-gray-500',
                                    ) }
                                >
                                    <div
                                        className={ clsx(
                                            'h-1.5 rounded-full',
                                            hpPercentage >= 60
                                                ? 'bg-green-600'
                                                : hpPercentage >= 30
                                                    ? 'bg-orange-400'
                                                    : 'bg-red-500',
                                        ) }
                                        style={ {width: `${ hpPercentage }%`} }
                                    ></div>
                                </div>
                            ) }
                        </div>
                    </div>
                    <div className="content-center p-2">
                        { encounterStarted &&
                            <ModifyHealth characterId={ character.id } encounterId={ encounterId } /> }
                    </div>
                </>
            ) }
            { character.hpChanges.length > 0 && (
                <div className="content-center border-l px-2">
                    <button onClick={ () => setShowHistory(!showHistory) }>
                        { showHistory ? <ChevronUpIcon className="h-4" /> : <ChevronDownIcon className="h-4" /> }
                    </button>
                </div>
            ) }
            { showHistory && (
                <div
                    className={ clsx(
                        'border-t p-4 col-span-5',
                        characterIsActive ? 'border-primary' : 'border-gray-200',
                    ) }
                >
                    <HpHistory character={ character } />
                </div>
            ) }
        </div>
        // </div>
    );
}
