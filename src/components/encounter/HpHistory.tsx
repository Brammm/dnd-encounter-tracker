import useApp, {Character} from '../../hooks/useApp.tsx';

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
                        <div className="relative flex justify-between hover:bg-gray-50">
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className="h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-gray-100 text-white">
                                        {change.turn}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800 pt-0.5">
                                    {change.amount > 0 ? 'Healed' : 'Damaged'} {change.amount}HP
                                </p>
                            </div>
                            <button
                                className="h-5 w-5 mr-1 text-gray-300"
                                onClick={() => deleteHpChange(encounterId, character.id, i)}
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
