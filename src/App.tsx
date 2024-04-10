import useApp from './hooks/useApp.tsx';
import {useState} from 'react';
import {PlusCircleIcon, TrashIcon} from '@heroicons/react/24/solid';
import NavItem from './components/page/NavItem.tsx';
import Button from './components/Button.tsx';
import Logo from './components/page/Logo.tsx';
import Footer from './components/page/Footer.tsx';
import Main from './components/page/Main.tsx';

export default function App() {
    const {addEncounter, encounters, reset} = useApp();
    const [activeEncounterId, setActiveEncounterId] = useState<string>(Object.keys(encounters)[0]);
    const activeEncounter = encounters[activeEncounterId];

    const handleReset = () => {
        if (confirm('Are you sure? This will wipe everything.')) {
            reset();
        }
    };

    const handleAddEncounter = () => {
        const id = addEncounter();
        setActiveEncounterId(id);
    };

    return (
        <div className="w-screen h-screen flex">
            <nav className={'w-64 bg-dark flex flex-col justify-between p-4 overflow-y-auto'}>
                <div className="flex flex-col items-start gap-y-4">
                    <Logo />
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
                    <Button onClick={handleAddEncounter} size="small">
                        <PlusCircleIcon className="h-5 w-5" />
                        Add encounter
                    </Button>
                    <Button onClick={handleReset} size="small">
                        <TrashIcon className="h-5 w-5" />
                        Reset everything
                    </Button>
                </div>

                <Footer />
            </nav>
            <Main encounter={activeEncounter} />
        </div>
    );
}
