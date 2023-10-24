import {CharacterRow} from './CharacterRow';
import {Encounter} from '../hooks/useApp';

type Props = {
    encounter: Encounter;
};

export default function EncounterView({encounter}: Props) {
    return (
        <div>
            <div>
                {encounter.characters.map((character) => {
                    return <CharacterRow character={character} encounterId={encounter.id} key={character.id} />;
                })}
            </div>
        </div>
    );
}
