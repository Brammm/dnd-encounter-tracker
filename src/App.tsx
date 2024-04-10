import useApp from './hooks/useApp.tsx';
import {useState} from 'react';
import AddCharacterForm from './components/AddCharacterForm.tsx';
import EncounterView from './components/Encounter.tsx';
import {PlusCircleIcon, TrashIcon} from '@heroicons/react/24/solid';
import NavItem from './components/NavItem.tsx';
import Button from './components/Button.tsx';

export default function App() {
    const {addCharacter, addEncounter, encounters, reset} = useApp();
    const [activeEncounterId, setActiveEncounterId] = useState<string>(Object.keys(encounters)[0]);
    const activeEncounter = encounters[activeEncounterId];

    const handleReset = () => {
        if (confirm('Are you sure? This will wipe everything.')) {
            reset();
        }
    };

    return (
        <div className="w-screen h-screen flex">
            <nav className={'w-64 bg-dark flex flex-col justify-between p-4 overflow-y-auto'}>
                <div className="flex flex-col items-start gap-y-4">
                    <h1 className="text-7xl text-center w-full">⚔️</h1>
                    <h2 className="text-3xl text-center w-full font-serif text-white mb-4">Renkonti</h2>
                    <div className="flex flex-col gap-y-2 w-full">
                        {Object.values(encounters).map((encounter) => (
                            <NavItem
                                active={activeEncounterId === encounter.id}
                                key={`nav-${encounter.id}`}
                                onClick={() => setActiveEncounterId(encounter.id)}
                            >
                                {encounter.name}
                            </NavItem>
                        ))}
                    </div>
                    <Button onClick={() => addEncounter()} size="small">
                        <PlusCircleIcon className="h-5 w-5" />
                        Add encounter
                    </Button>
                    <Button onClick={handleReset} size="small">
                        <TrashIcon className="h-5 w-5" />
                        Reset everything
                    </Button>
                </div>

                <small className="text-sm ml-2 text-white font-normal flex items-center">
                    By
                    <a
                        className="text-highlight flex items-center hover:underline"
                        href="https://github.com/Brammm/dnd-encounter-tracker"
                    >
                        <svg
                            className="mx-1 text-highlight h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                            />
                        </svg>
                        Brammm
                    </a>
                </small>
            </nav>
            <div className="bg-gray-100 h-full w-full flex flex-col">
                <header className="p-4 bg-gray-100">
                    <h1 className="text-3xl font-bold font-serif">{activeEncounter.name}</h1>
                </header>

                <main className="bg-gray-100 border-t border-gray-200 p-8">
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
