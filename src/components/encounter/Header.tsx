import useApp, {Encounter} from '../../hooks/useApp.tsx';
import {CheckIcon, PencilIcon} from '@heroicons/react/24/outline';
import {useRef, useState} from 'react';
import {flushSync} from 'react-dom';

type Props = {
    encounter: Encounter;
};

export default function Header({encounter}: Props) {
    const {renameEncounter} = useApp();
    const encounterNameRef = useRef<HTMLInputElement>(null);
    const [editingEncounterName, setEditingEncounterName] = useState(false);
    const [newEncounterName, setNewEncounterName] = useState(encounter.name);

    const handleStartEncounterRename = () => {
        flushSync(() => {
            setEditingEncounterName(true);
        });
        encounterNameRef.current?.focus();
    };

    const handleFinishEncounterRename = () => {
        renameEncounter(encounter.id, newEncounterName);
        setEditingEncounterName(false);
    };
    return (
        <header className="p-4 bg-gray-100">
            {editingEncounterName ? (
                <form className="flex items-center" onSubmit={handleFinishEncounterRename}>
                    <input
                        className="bg-gray-100 border-0 text-3xl font-bold font-serif p-0 outline-0"
                        ref={encounterNameRef}
                        value={newEncounterName}
                        onChange={(e) => setNewEncounterName(e.currentTarget.value)}
                        style={{width: newEncounterName.length + 'ch'}}
                    />
                    <button type="submit" className="ml-4 text-gray-400 hover:text-gray-800">
                        <CheckIcon className="h-5" />
                    </button>
                </form>
            ) : (
                <h1 className="text-3xl font-bold font-serif flex items-center">
                    {encounter.name}
                    <button onClick={handleStartEncounterRename} className="ml-4 text-gray-400 hover:text-gray-800">
                        <PencilIcon className="h-5" />
                    </button>
                </h1>
            )}
        </header>
    );
}
