import {CharacterRow} from './CharacterRow';
import useApp, {Encounter} from '../hooks/useApp';
import Button from './Button.tsx';

type Props = {
    encounter: Encounter;
};

export default function EncounterView({encounter}: Props) {
    const {nextCharacter, resetEncounter, sortOnInitiative, startEncounter} = useApp();

    return (
        <div>
            {encounter.turn && <p>Turn {encounter.turn}</p>}

            <div className="flex flex-col gap-y-4 mb-4">
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

            <div className="flex gap-x-4">
                <Button onClick={() => sortOnInitiative(encounter.id)}>Sort</Button>
                {encounter.turn ? (
                    <>
                        <Button onClick={() => nextCharacter(encounter.id)}>Next character</Button>
                        <Button onClick={() => resetEncounter(encounter.id)}>Reset encounter</Button>
                    </>
                ) : (
                    <Button onClick={() => startEncounter(encounter.id)}>Start encounter</Button>
                )}
            </div>
        </div>
    );
}
