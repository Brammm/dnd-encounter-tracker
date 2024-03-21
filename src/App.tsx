import useApp from './hooks/useApp.tsx';
import {useState} from 'react';
import AddCharacterForm from './components/AddCharacterForm.tsx';
import EncounterView from './components/Encounter.tsx';
import {PlusIcon} from '@heroicons/react/24/solid';

export default function App() {
    const {addCharacter, addEncounter, encounters} = useApp();
    const [activeEncounterId, setActiveEncounterId] = useState<string>(Object.keys(encounters)[0]);
    const activeEncounter = encounters[activeEncounterId];

    return (
        <div className="max-w-screen-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">⚔️ DND Encounter tracker</h1>
            <div>
                <nav>
                    {Object.values(encounters).map((encounter) => (
                        <button key={`nav-${encounter.id}`} onClick={() => setActiveEncounterId(encounter.id)}>
                            {encounter.name}
                        </button>
                    ))}

                    <button onClick={() => addEncounter()}>
                        <PlusIcon className="h-4 w-4" />
                    </button>
                </nav>

                <main>
                    <AddCharacterForm
                        onAdd={(type, name, initiative, hp) => {
                            addCharacter(activeEncounterId, {type, name, initiative, hp});
                        }}
                    />

                    <EncounterView encounter={activeEncounter} />
                </main>
            </div>
        </div>
    );
}
