import {CharacterRow} from './CharacterRow';
import {Encounter} from '../hooks/useApp';

type Props = {
  encounter: Encounter;
};

export default function EncounterView({encounter}: Props) {
  return (
    <div>
      <div>
        {encounter.characters.map((character) => (
          <CharacterRow character={character} key={character.id} />
        ))}
      </div>
    </div>
  );
}
