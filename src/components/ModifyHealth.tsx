import useApp, {CharacterId, EncounterId} from '../hooks/useApp.tsx';
import {useState} from 'react';

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
        <div className="shadow-sm rounded">
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
                className="p-2 border-y border-gray-300 bg-gray-100 hover:opacity-80"
                type="button"
                onClick={() => handleModify()}
            >
                Heal
            </button>
            <button
                className="p-2 border border-gray-300 bg-gray-100 hover:opacity-80 rounded-r"
                type="button"
                onClick={() => handleModify(-1)}
            >
                Damage
            </button>
        </div>
    );
}
