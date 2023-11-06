'use client';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {persist} from 'zustand/middleware';

export type Character = {
    id: string;
    type: 'PC' | 'NPC';
    name: string;
    initiative: number;
    hp?: number;
};

export type HpChange = {
    characterId: string;
    amount: number;
    changedHp: number;
};

export type Encounter = {
    id: string;
    name: string;
    characters: Character[];
    hpChanges: HpChange[];
};

type State = {
    encounters: Record<string, Encounter>;
};

type Actions = {
    addCharacter: (encounterId: string, character: Omit<Character, 'id'>) => void;
    modifyHp: (encounterId: string, characterId: string, amount: number) => void;
};

const useApp = create<State & Actions>()(
    persist(
        immer((set) => ({
            encounters: {
                '1': {
                    id: '1',
                    name: 'Encounter 1',
                    characters: [],
                    hpChanges: [],
                },
            },
            addCharacter: (encounterId, character) => {
                set((draft) => {
                    const nextId =
                        Object.values(draft.encounters).reduce(
                            (total, encounter) => total + encounter.characters.length,
                            0,
                        ) + 1;

                    draft.encounters[encounterId].characters.push({
                        ...character,
                        id: nextId.toString(),
                    });
                });
            },
            modifyHp: (encounterId, characterId, amount) => {
                set((draft) => {
                    const character = draft.encounters[encounterId].characters.find(
                        (character) => character.id === characterId,
                    );
                    if (!character || !character.hp) {
                        throw new Error('Cannot modify character HP');
                    }
                    const hpChanges = draft.encounters[encounterId].hpChanges;

                    const changedHp = Math.max(
                        0,
                        Math.min(character.hp, (hpChanges.at(-1)?.changedHp || character.hp) + amount),
                    );

                    hpChanges.push({characterId, amount, changedHp});
                });
            },
        })),
        {name: 'dnd-encounter-tracker'},
    ),
);

export default useApp;
