import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import useApp from '../../store/useApp.tsx';
import Button from '../Button.tsx';
import Footer from './Footer.tsx';
import Logo from './Logo.tsx';
import NavItem from './NavItem.tsx';

export default function Nav() {
    const {
        activeEncounterId,
        addEncounter,
        encounters,
        reset,
        selectActiveEncounter,
    } = useApp();

    const handleReset = () => {
        if (confirm('Are you sure? This will wipe everything.')) {
            reset();
        }
    };

    const handleAddEncounter = () => {
        addEncounter();
    };

    return (
        <nav className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark p-4 justify-between">
            <div className="flex flex-col items-start gap-y-4">
                <Logo />
                <div className="flex flex-col gap-y-2 w-full">
                    {Object.values(encounters).map((encounter) => (
                        <NavItem
                            active={activeEncounterId === encounter.id}
                            key={`nav-${encounter.id}`}
                            onClick={() => selectActiveEncounter(encounter.id)}
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
    );
}
