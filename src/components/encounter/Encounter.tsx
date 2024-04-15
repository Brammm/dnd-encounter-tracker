import {CharacterRow} from './CharacterRow.tsx';
import useApp, {Encounter} from '../../hooks/useApp.tsx';
import Button from '../Button.tsx';
import {
    ArrowDownIcon,
    ArrowUturnLeftIcon,
    DocumentDuplicateIcon,
    ForwardIcon,
    PlayIcon,
    TrashIcon,
} from '@heroicons/react/16/solid';

type Props = {
    encounter: Encounter;
};

export default function EncounterView({encounter}: Props) {
    const {deleteEncounter, duplicateEncounter, nextCharacter, resetEncounter, sortOnInitiative, startEncounter} =
        useApp();

    return (
        <div>
            <div className="flex gap-x-4 bg-gray-200 px-6 py-4">
                {encounter.characters.length > 0 && (
                    <>
                        <Button impact="secondary" size="small" onClick={() => sortOnInitiative(encounter.id)}>
                            <ArrowDownIcon className="h-4" />
                            Sort on initiative
                        </Button>
                        {encounter.turn ? (
                            <>
                                <Button impact="secondary" size="small" onClick={() => nextCharacter(encounter.id)}>
                                    <ForwardIcon className="h-4" />
                                    Next character
                                </Button>
                                <Button impact="secondary" size="small" onClick={() => resetEncounter(encounter.id)}>
                                    <ArrowUturnLeftIcon className="h-4" />
                                    Reset encounter
                                </Button>
                            </>
                        ) : (
                            <Button impact="secondary" size="small" onClick={() => startEncounter(encounter.id)}>
                                <PlayIcon className="h-4" />
                                Start encounter
                            </Button>
                        )}
                        <Button
                            impact="secondary"
                            size="small"
                            onClick={() => {
                                duplicateEncounter(encounter.id);
                            }}
                        >
                            <DocumentDuplicateIcon className="h-4" />
                            Duplicate encounter
                        </Button>
                    </>
                )}
                <Button
                    impact="secondary"
                    size="small"
                    onClick={() => {
                        if (confirm('Are you sure?')) {
                            deleteEncounter(encounter.id);
                        }
                    }}
                >
                    <TrashIcon className="h-4" />
                    Delete encounter
                </Button>
            </div>

            <div className="p-6 flex flex-col w-fit">
                {encounter.characters.length > 0 ? (
                    <>
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Turn: {encounter.turn || 0}</h2>
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
