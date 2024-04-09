import useApp, {EncounterId} from './hooks/useApp.tsx';
import {MouseEvent, useState} from 'react';
import AddCharacterForm from './components/AddCharacterForm.tsx';
import EncounterView from './components/Encounter.tsx';
import {PlusCircleIcon} from '@heroicons/react/24/solid';
import Tab from './components/Tab.tsx';
import Button from './components/Button.tsx';

export default function App() {
    const {addCharacter, addEncounter, deleteEncounter, encounters} = useApp();
    const [activeEncounterId, setActiveEncounterId] = useState<string>(Object.keys(encounters)[0]);
    const activeEncounter = encounters[activeEncounterId];

    const handleDelete = (e: MouseEvent<HTMLButtonElement>, encounterId: EncounterId) => {
        e.stopPropagation();
        if (confirm('Are you sure?')) {
            deleteEncounter(encounterId);
        }
    };

    return (
        <div className="max-w-screen-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">⚔️ DND Encounter tracker</h1>
            <div>
                <nav className={'border-b gap-x-4 flex'}>
                    <div className="flex gap-x-4 max-w-4xl overflow-x-auto">
                        {Object.values(encounters).map((encounter) => (
                            <Tab
                                active={activeEncounterId === encounter.id}
                                key={`nav-${encounter.id}`}
                                onClick={() => setActiveEncounterId(encounter.id)}
                            >
                                {encounter.name}
                                <button
                                    className="ml-1 hover:bg-gray-200 px-1 rounded"
                                    onClick={(e) => handleDelete(e, encounter.id)}
                                >
                                    &times;
                                </button>
                            </Tab>
                        ))}
                    </div>

                    <Button onClick={() => addEncounter()} size="small">
                        <PlusCircleIcon className="h-5 w-5" />
                        Add
                    </Button>
                </nav>

                <main>
                    <AddCharacterForm
                        onAdd={(type, name, initiative, hp) => {
                            addCharacter(activeEncounterId, {type, name, initiative, hp});
                        }}
                    />
                    <hr />
                    <EncounterView encounter={activeEncounter} />
                </main>
            </div>
        </div>
    );
}
