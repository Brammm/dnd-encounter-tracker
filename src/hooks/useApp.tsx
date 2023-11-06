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
    updateInitiative: (encounterId: string, characterId: string, initiative: number) => void;
    sortOnInitiative: (encounterId: string) => void;
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
                set((state) => {
                    const nextId =
                        Object.values(state.encounters).reduce(
                            (total, encounter) => total + encounter.characters.length,
                            0,
                        ) + 1;

                    state.encounters[encounterId].characters.push({
                        ...character,
                        id: nextId.toString(),
                    });
                });
            },
            modifyHp: (encounterId, characterId, amount) => {
                set((state) => {
                    const character = state.encounters[encounterId].characters.find(
                        (character) => character.id === characterId,
                    );
                    if (!character || !character.hp) {
                        throw new Error('Cannot modify character HP');
                    }
                    const hpChanges = state.encounters[encounterId].hpChanges;

                    const changedHp = Math.max(
                        0,
                        Math.min(character.hp, (hpChanges.at(-1)?.changedHp || character.hp) + amount),
                    );

                    hpChanges.push({characterId, amount, changedHp});
                });
            },
            updateInitiative: (encounterId, characterId, initiative) => {
                set((state) => {
                    const character = state.encounters[encounterId].characters.find(
                        (character) => character.id === characterId,
                    );
                    if (!character) {
                        throw new Error('Cannot modify character initiative');
                    }

                    character.initiative = initiative;
                });
            },
            sortOnInitiative: (encounterId) => {
                set((state) => {
                    state.encounters[encounterId].characters.sort((a, b) => b.initiative - a.initiative);
                });
            },
        })),
        {name: 'dnd-encounter-tracker'},
    ),
);

export default useApp;
