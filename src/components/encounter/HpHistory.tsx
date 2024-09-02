import useApp, {Character} from '../../hooks/useApp.tsx';
import {XMarkIcon} from '@heroicons/react/24/solid';

type Props = {character: Character};

export default function HpHistory({character}: Props) {
    const {deleteHpChange, encounterId} = useApp(({activeEncounterId, deleteHpChange}) => ({
        encounterId: activeEncounterId,
        deleteHpChange,
    }));

    return (
        <ul className="-mb-6">
            {character.hpChanges.map((change, i) => (
                <li key={i}>
                    <div className="relative pb-6">
                        {i !== character.hpChanges.length - 1 && (
                            <span
                                className="absolute left-3 top-3 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                            />
                        )}
                        <div className="relative flex justify-between">
                            <div className="relative flex space-x-3">
                                <div>
                                    <button
                                        className="group h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-gray-100 text-white"
                                        onClick={() => deleteHpChange(encounterId, character.id, i)}
                                    >
                                        <span className="inline group-hover:hidden">{change.turn}</span>
                                        <span className="hidden group-hover:inline">
                                            <XMarkIcon className="h-4" />
                                        </span>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-800 pt-0.5">
                                    {change.amount > 0 ? 'Healed' : 'Damaged'} {change.amount}HP
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
