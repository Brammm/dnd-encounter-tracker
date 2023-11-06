import {CharacterRow} from './CharacterRow';
import useApp, {Encounter} from '../hooks/useApp';

type Props = {
    encounter: Encounter;
};

export default function EncounterView({encounter}: Props) {
    const {sortOnInitiative} = useApp();

    return (
        <div>
            <div>
                {encounter.characters.map((character) => {
                    return <CharacterRow character={character} encounterId={encounter.id} key={character.id} />;
                })}
            </div>

            <button onClick={() => sortOnInitiative(encounter.id)}>Sort</button>
        </div>
    );
}
