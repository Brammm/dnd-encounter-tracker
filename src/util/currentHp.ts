import {Character} from '../hooks/useApp.tsx';

export default function calculateCurrentHp(char: Character) {
    const totalHp = char.hp;

    if (!totalHp) {
        return undefined;
    }

    return char.hpChanges.reduce<number>((current, change) => {
        return Math.min(totalHp, Math.max(0, current + change.amount));
    }, totalHp);
}
