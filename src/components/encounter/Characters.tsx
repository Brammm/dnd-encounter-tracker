import {CharacterRow} from './CharacterRow.tsx';
import {Encounter} from '../../hooks/useApp.tsx';

type Props = {
    encounter: Encounter;
};

export default function Characters({encounter}: Props) {
    return (
        <div>
            <div className="p-8 flex flex-col w-fit">
                {encounter.characters.length > 0 ? (
                    <>
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Turn: {encounter.turn || 0}</h2>
                        <div className="grid grid-cols-[auto,1fr,auto,auto,auto] gap-y-4">
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
                    </>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 p-6 w-80 text-center rounded-lg">
                        Add a character first
                    </div>
                )}
            </div>
        </div>
    );
}
