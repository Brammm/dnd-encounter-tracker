import useApp, {CharacterId, EncounterId} from '../../hooks/useApp.tsx';
import {useState} from 'react';
import {BeakerIcon, BoltIcon} from '@heroicons/react/16/solid';

type Props = {
    characterId: CharacterId;
    encounterId: EncounterId;
};

export default function ModifyHealth({characterId, encounterId}: Props) {
    const {modifyHp} = useApp(({modifyHp}) => ({modifyHp}));
    const [amount, setAmount] = useState<string>('');

    const handleModify = (multiplier: number = 1) => {
        modifyHp(encounterId, characterId, parseInt(amount) * multiplier);
        setAmount('');
    };

    return (
        <div className="shadow-sm rounded inline-flex">
            <input
                id={`character-hp-${characterId}`}
                name={`character-hp-${characterId}`}
                type="number"
                className="w-20 rounded-l border border-gray-300"
                step={1}
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.currentTarget.value)}
            />
            <button
                className="py-2 px-3 border-y border-gray-300 bg-gray-100 hover:opacity-80 hover:bg-green-200"
                type="button"
                onClick={() => handleModify()}
                title="Heal"
            >
                <BeakerIcon className="h-4 text-gray-500" />
            </button>
            <button
                className="py-2 px-3 border border-gray-300 bg-gray-100 hover:opacity-80 hover:bg-red-200 rounded-r"
                type="button"
                onClick={() => handleModify(-1)}
                title="Damage"
            >
                <BoltIcon className="h-4 text-gray-500" />
            </button>
        </div>
    );
}
