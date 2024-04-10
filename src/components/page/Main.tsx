import useApp, {Encounter} from '../../hooks/useApp.tsx';
import AddCharacterForm from '../encounter/AddCharacterForm.tsx';
import EncounterView from '../encounter/Encounter.tsx';

type Props = {
    encounter: Encounter;
};

export default function Main({encounter}: Props) {
    const {addCharacter} = useApp();
    return (
        <main className="bg-gray-100 h-full w-full flex flex-col">
            <header className="p-4 bg-gray-100">
                <h1 className="text-3xl font-bold font-serif">{encounter.name}</h1>
            </header>

            <div className="bg-gray-100 border-t border-gray-200 p-8">
                <AddCharacterForm
                    onAdd={(type, name, initiative, hp) => {
                        addCharacter(encounter.id, {type, name, initiative, hp});
                    }}
                />
                <hr />
                <EncounterView encounter={encounter} />
            </div>
        </main>
    );
}
