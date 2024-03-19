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
    takingTurn: boolean;
};

export type HpChange = {
    characterId: string;
    amount: number;
    changedHp: number;
    turn: number;
};

export type Encounter = {
    id: string;
    name: string;
    characters: Character[];
    hpChanges: HpChange[];
    turn?: number;
};

type State = {
    encounters: Record<string, Encounter>;
};

type Actions = {
    addCharacter: (encounterId: string, character: Omit<Character, 'id' | 'takingTurn'>) => void;
    modifyHp: (encounterId: string, characterId: string, amount: number) => void;
    updateInitiative: (encounterId: string, characterId: string, initiative: number) => void;
    sortOnInitiative: (encounterId: string) => void;
    startEncounter: (encounterId: string) => void;
    nextCharacter: (encounterId: string) => void;
    resetEncounter: (encounterId: string) => void;
};

const useApp = create<State & Actions>()(
    persist(
        immer((set, get) => ({
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
                        takingTurn: false,
                    });
                });
            },
            modifyHp: (encounterId, characterId, amount) => {
                set(({encounters}) => {
                    const character = encounters[encounterId].characters.find(
                        (character) => character.id === characterId,
                    );
                    if (!character || !character.hp) {
                        throw new Error('Cannot modify character HP');
                    }
                    const hpChanges = encounters[encounterId].hpChanges;

                    const changedHp = Math.max(
                        0,
                        Math.min(character.hp, (hpChanges.at(-1)?.changedHp || character.hp) + amount),
                    );

                    hpChanges.push({characterId, amount, changedHp, turn: encounters[encounterId].turn || 1});
                });
            },
            updateInitiative: (encounterId, characterId, initiative) => {
                set(({encounters}) => {
                    const character = encounters[encounterId].characters.find(
                        (character) => character.id === characterId,
                    );
                    if (!character) {
                        throw new Error('Cannot modify character initiative');
                    }

                    character.initiative = initiative;
                });
            },
            sortOnInitiative: (encounterId) => {
                set(({encounters}) => {
                    encounters[encounterId].characters.sort((a, b) => b.initiative - a.initiative);
                });
            },
            startEncounter: (encounterId) => {
                if (get().encounters[encounterId].turn) {
                    return;
                }

                set(({encounters}) => {
                    encounters[encounterId].turn = 1;
                    if (encounters[encounterId].characters[0]) {
                        encounters[encounterId].characters[0].takingTurn = true;
                    }
                });
            },
            nextCharacter: (encounterId) => {
                const characters = get().encounters[encounterId].characters;
                const characterTakingTurnIndex = characters.findIndex((character) => character.takingTurn);

                if (characterTakingTurnIndex === -1 || !get().encounters[encounterId].turn) {
                    return;
                }

                const nextRoundIndex =
                    characterTakingTurnIndex === characters.length - 1 ? 0 : characterTakingTurnIndex + 1;

                set(({encounters}) => {
                    encounters[encounterId].characters[characterTakingTurnIndex].takingTurn = false;
                    encounters[encounterId].characters[nextRoundIndex].takingTurn = true;
                    if (nextRoundIndex === 0) {
                        encounters[encounterId].turn!++;
                    }
                });
            },
            resetEncounter: (encounterId) => {
                set(({encounters}) => {
                    encounters[encounterId].hpChanges = [];
                    encounters[encounterId].turn = undefined;
                    encounters[encounterId].characters.forEach((character) => {
                        character.takingTurn = false;
                    });
                });
            },
        })),
        {name: 'dnd-encounter-tracker'},
    ),
);

export default useApp;
