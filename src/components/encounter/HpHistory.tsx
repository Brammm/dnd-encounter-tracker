import { XMarkIcon } from '@heroicons/react/24/solid';
import useApp, { type Character } from '../../store/useApp.tsx';

type Props = { character: Character };

export default function HpHistory({ character }: Props) {
    const { deleteHpChange, activeEncounterId } = useApp();

    const totalDamage = Math.min(
        0,
        character.hpChanges.reduce((total, change) => total + change.amount, 0),
    );

    return (
        <ul>
            {character.hpChanges.map((change, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <li key={i} className="p-4 -mb-6 group">
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
                                        className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-gray-100 text-white"
                                        onClick={() =>
                                            deleteHpChange(
                                                activeEncounterId,
                                                character.id,
                                                i,
                                            )
                                        }
                                        type="button"
                                        title="Remove"
                                    >
                                        <span className="inline group-hover:hidden">
                                            {change.turn}
                                        </span>
                                        <span className="hidden group-hover:inline">
                                            <XMarkIcon className="h-4" />
                                        </span>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-800 pt-0.5">
                                    {change.amount > 0 ? 'Healed' : 'Damaged'}{' '}
                                    {change.amount}HP
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
            <li className="border-t p-4 text-sm">
                Total damage taken: {totalDamage} HP
            </li>
        </ul>
    );
}
