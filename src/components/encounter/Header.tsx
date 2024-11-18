import { CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import useApp, { type Encounter } from '../../hooks/useApp.tsx';

type Props = {
    encounter: Encounter;
};

export default function Header({ encounter }: Props) {
    const { renameEncounter } = useApp();
    const encounterNameRef = useRef<HTMLInputElement>(null);
    const [editingEncounterName, setEditingEncounterName] = useState(false);
    const [newEncounterName, setNewEncounterName] = useState(encounter.name);

    useEffect(() => {
        setNewEncounterName(encounter.name);
    }, [encounter.name]);

    const handleStartEncounterRename = () => {
        flushSync(() => {
            setEditingEncounterName(true);
        });
        encounterNameRef.current?.focus();
    };

    const handleFinishEncounterRename = () => {
        if (!newEncounterName.trim()) {
            alert('Encounter name cant be empty');
        }

        renameEncounter(encounter.id, newEncounterName);
        setEditingEncounterName(false);
    };

    return (
        <header className="py-4">
            {editingEncounterName ? (
                <form
                    className="flex items-center"
                    onSubmit={handleFinishEncounterRename}
                >
                    <input
                        className="border-0 text-3xl font-bold font-serif p-0 focus:ring-0"
                        ref={encounterNameRef}
                        value={newEncounterName}
                        onChange={(e) =>
                            setNewEncounterName(e.currentTarget.value)
                        }
                        style={{ width: `${newEncounterName.length}ch` }}
                    />
                    <button
                        type="submit"
                        className="ml-4 text-gray-400 hover:text-gray-800"
                    >
                        <CheckIcon className="h-5" />
                    </button>
                </form>
            ) : (
                <h1 className="text-3xl font-bold font-serif flex items-center">
                    {encounter.name}
                    <button
                        onClick={handleStartEncounterRename}
                        className="ml-4 text-gray-400 hover:text-gray-800"
                        type="button"
                    >
                        <PencilIcon className="h-5" />
                    </button>
                </h1>
            )}
        </header>
    );
}
