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
            <h1 className="text-3xl font-bold my-6">
                ⚔️ DND Encounter tracker
                <small className="text-sm ml-2 text-gray-500 font-normal">
                    by{' '}
                    <a className="text-primary hover:underline" href="https://github.com/Brammm/dnd-encounter-tracker">
                        Brammm
                    </a>
                </small>
            </h1>
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
