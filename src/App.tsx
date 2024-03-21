import useApp from './hooks/useApp.tsx';
import {useState} from 'react';
import AddCharacterForm from './components/AddCharacterForm.tsx';
import EncounterView from './components/Encounter.tsx';
import {PlusCircleIcon} from '@heroicons/react/24/solid';
import Tab from './components/Tab.tsx';
import Button from './components/Button.tsx';

export default function App() {
    const {addCharacter, addEncounter, encounters} = useApp();
    const [activeEncounterId, setActiveEncounterId] = useState<string>(Object.keys(encounters)[0]);
    const activeEncounter = encounters[activeEncounterId];

    return (
        <div className="max-w-screen-md mx-auto">
            <h1 className="text-3xl font-bold mb-6">⚔️ DND Encounter tracker</h1>
            <div>
                <nav className={'border-b gap-x-4 flex'}>
                    {Object.values(encounters).map((encounter) => (
                        <Tab
                            active={activeEncounterId === encounter.id}
                            key={`nav-${encounter.id}`}
                            onClick={() => setActiveEncounterId(encounter.id)}
                        >
                            {encounter.name}
                        </Tab>
                    ))}

                    <Button onClick={() => addEncounter()}>
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

                    <EncounterView encounter={activeEncounter} />
                </main>
            </div>
        </div>
    );
}
