import {CharacterRow} from './CharacterRow';
import useApp, {Encounter} from '../hooks/useApp';

type Props = {
    encounter: Encounter;
};

export default function EncounterView({encounter}: Props) {
    const {nextCharacter, resetEncounter, sortOnInitiative, startEncounter} = useApp();

    return (
        <div>
            {encounter.turn && <p>Turn {encounter.turn}</p>}

            <div>
                {encounter.characters.map((character) => {
                    return <CharacterRow character={character} encounterId={encounter.id} key={character.id} />;
                })}
            </div>

            <button onClick={() => sortOnInitiative(encounter.id)}>Sort</button>
            {encounter.turn ? (
                <>
                    <button onClick={() => nextCharacter(encounter.id)}>Next character</button>
                    <button onClick={() => resetEncounter(encounter.id)}>Reset encounter</button>
                </>
            ) : (
                <button onClick={() => startEncounter(encounter.id)}>Start encounter</button>
            )}
        </div>
    );
}
