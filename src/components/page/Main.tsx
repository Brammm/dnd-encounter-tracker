import useApp, {Encounter} from '../../hooks/useApp.tsx';
import AddCharacterForm from '../encounter/AddCharacterForm.tsx';
import Characters from '../encounter/Characters.tsx';
import Header from '../encounter/Header.tsx';
import {useState} from 'react';
import Button from '../Button.tsx';
import {
    ArrowDownIcon,
    ArrowUturnLeftIcon,
    DocumentDuplicateIcon,
    ForwardIcon,
    PlayIcon,
    PlusCircleIcon,
    TrashIcon,
} from '@heroicons/react/16/solid';
import {XMarkIcon} from '@heroicons/react/24/solid';

type Props = {
    encounter: Encounter;
};

export default function Main({encounter}: Props) {
    const {
        addCharacter,
        deleteEncounter,
        duplicateEncounter,
        nextCharacter,
        resetEncounter,
        sortOnInitiative,
        startEncounter,
    } = useApp();

    const [showAddCharacterForm, setShowAddCharacterForm] = useState(false);

    return (
        <main className="bg-gray-100 h-full flex flex-col">
            <Header encounter={encounter} />

            <div className="flex gap-x-4 bg-gray-200 px-6 py-4">
                <Button
                    disabled={showAddCharacterForm}
                    impact="secondary"
                    size="small"
                    onClick={() => {
                        setShowAddCharacterForm(true);
                    }}
                >
                    <PlusCircleIcon className="h-4" />
                    Add character
                </Button>
                {encounter.characters.length > 0 && (
                    <>
                        <Button impact="secondary" size="small" onClick={() => sortOnInitiative(encounter.id)}>
                            <ArrowDownIcon className="h-4" />
                            Sort on initiative
                        </Button>
                        {encounter.turn ? (
                            <>
                                <Button impact="secondary" size="small" onClick={() => nextCharacter(encounter.id)}>
                                    <ForwardIcon className="h-4" />
                                    Next character
                                </Button>
                                <Button impact="secondary" size="small" onClick={() => resetEncounter(encounter.id)}>
                                    <ArrowUturnLeftIcon className="h-4" />
                                    Reset encounter
                                </Button>
                            </>
                        ) : (
                            <Button impact="secondary" size="small" onClick={() => startEncounter(encounter.id)}>
                                <PlayIcon className="h-4" />
                                Start encounter
                            </Button>
                        )}
                        <Button
                            impact="secondary"
                            size="small"
                            onClick={() => {
                                duplicateEncounter(encounter.id);
                            }}
                        >
                            <DocumentDuplicateIcon className="h-4" />
                            Duplicate encounter
                        </Button>
                    </>
                )}
                <Button
                    impact="secondary"
                    size="small"
                    onClick={() => {
                        if (confirm('Are you sure?')) {
                            deleteEncounter(encounter.id);
                        }
                    }}
                >
                    <TrashIcon className="h-4" />
                    Delete encounter
                </Button>
            </div>

            <Characters encounter={encounter} />
            {showAddCharacterForm && (
                <div className="absolute top-0 bottom-0 right-0 bg-white shadow-xl p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-serif mb-2">Add character</h2>
                        <button
                            className="text-2xl text-gray-600 relative"
                            onClick={() => setShowAddCharacterForm(false)}
                        >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <AddCharacterForm
                        onAdd={(type, name, initiative, hp) => {
                            addCharacter(encounter.id, {type, name, initiative, hp});
                        }}
                    />
                </div>
            )}
        </main>
    );
}
