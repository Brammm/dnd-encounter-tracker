import {CharacterRow} from './CharacterRow.tsx';
import useApp, {Encounter} from '../../hooks/useApp.tsx';
import Button from '../Button.tsx';

type Props = {
    encounter: Encounter;
};

export default function EncounterView({encounter}: Props) {
    const {deleteEncounter, nextCharacter, resetEncounter, sortOnInitiative, startEncounter} = useApp();

    return (
        <div className="mt-4">
            {encounter.turn && <h2 className="text-xl font-bold text-gray-700 my-4">Turn {encounter.turn}</h2>}

            {encounter.characters.length > 0 && (
                <div className="flex gap-x-4 mb-4">
                    {encounter.turn ? (
                        <>
                            <Button onClick={() => nextCharacter(encounter.id)}>Next character</Button>
                            <Button onClick={() => resetEncounter(encounter.id)}>Reset encounter</Button>
                        </>
                    ) : (
                        <Button onClick={() => startEncounter(encounter.id)}>Start encounter</Button>
                    )}
                    <Button onClick={() => sortOnInitiative(encounter.id)}>Sort on initiative</Button>
                    <Button
                        onClick={() => {
                            if (confirm('Are you sure?')) {
                                deleteEncounter(encounter.id);
                            }
                        }}
                    >
                        Delete encounter
                    </Button>
                </div>
            )}

            <div className="flex flex-col gap-y-4">
                {encounter.characters.map((character) => {
                    return (
                        <CharacterRow
                            character={character}
                            encounterId={encounter.id}
                            key={`${encounter.id}-${character.id}`}
                        />
                    );
                })}
            </div>
        </div>
    );
}
