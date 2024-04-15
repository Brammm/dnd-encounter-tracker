import useApp, {Encounter} from '../../hooks/useApp.tsx';
import AddCharacterForm from '../encounter/AddCharacterForm.tsx';
import EncounterView from '../encounter/Encounter.tsx';
import Header from '../encounter/Header.tsx';

type Props = {
    encounter: Encounter;
};

export default function Main({encounter}: Props) {
    const {addCharacter} = useApp();

    return (
        <main className="bg-gray-100 h-full flex flex-col">
            <Header encounter={encounter} />
            <EncounterView encounter={encounter} />
            <div className="absolute top-0 bottom-0 right-0 bg-white shadow-xl p-6">
                <AddCharacterForm
                    onAdd={(type, name, initiative, hp) => {
                        addCharacter(encounter.id, {type, name, initiative, hp});
                    }}
                />
            </div>
        </main>
    );
}
