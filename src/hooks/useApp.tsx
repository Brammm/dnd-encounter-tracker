'use client';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {persist} from 'zustand/middleware';
import {ulid} from 'ulid';

export type EncounterId = string;
export type CharacterId = string;

export type Character = {
    id: CharacterId;
    type: 'PC' | 'NPC';
    name: string;
    initiative: number;
    hp?: number;
    takingTurn: boolean;
};

export type HpChange = {
    characterId: CharacterId;
    amount: number;
    changedHp: number;
    turn: number;
};

export type Encounter = {
    id: EncounterId;
    name: string;
    characters: Character[];
    hpChanges: HpChange[];
    turn?: number;
};

type State = {
    encounters: Record<EncounterId, Encounter>;
    settings: {
        multiplier: number;
        hpType: 'AVERAGE' | 'FORMULA';
    };
};

type Actions = {
    addEncounter: () => string;
    deleteEncounter: (encounterId: EncounterId) => void;
    renameEncounter: (encounterId: EncounterId, name: string) => void;
    addCharacter: (encounterId: EncounterId, character: Omit<Character, 'id' | 'takingTurn'>) => void;
    deleteCharacter: (encounterId: EncounterId, characterId: CharacterId) => void;
    renameCharacter: (encounterId: EncounterId, characterId: CharacterId, name: string) => void;
    modifyHp: (encounterId: EncounterId, characterId: CharacterId, amount: number) => void;
    updateInitiative: (encounterId: EncounterId, characterId: CharacterId, initiative: number) => void;
    sortOnInitiative: (encounterId: EncounterId) => void;
    startEncounter: (encounterId: EncounterId) => void;
    nextCharacter: (encounterId: EncounterId) => void;
    resetEncounter: (encounterId: EncounterId) => void;
    reset: () => void;
};

const defaultState: State = {
    encounters: {
        '1': {
            id: '1',
            name: 'Encounter 1',
            characters: [],
            hpChanges: [],
        },
    },
    settings: {
        multiplier: 1,
        hpType: 'AVERAGE',
    },
};

const useApp = create<State & Actions>()(
    persist(
        immer((set, get) => ({
            ...defaultState,
            reset: () => {
                set(defaultState);
            },
            addEncounter: () => {
                const nextId = ulid();
                set((state) => {
                    state.encounters[nextId] = {
                        id: nextId,
                        name: 'Encounter ' + (Object.values(state.encounters).length + 1).toString(),
                        characters: [],
                        hpChanges: [],
                    };
                });

                return nextId;
            },
            deleteEncounter: (encounterId) => {
                set((state) => {
                    delete state.encounters[encounterId];
                });
            },
            renameEncounter: (encounterId, name) => {
                set((state) => {
                    state.encounters[encounterId].name = name;
                });
            },
            addCharacter: (encounterId, character) => {
                set((state) => {
                    state.encounters[encounterId].characters.push({
                        ...character,
                        id: ulid(),
                        takingTurn: false,
                    });
                });
            },
            deleteCharacter: (encounterId, characterId) => {
                set((state) => {
                    state.encounters[encounterId].characters = state.encounters[encounterId].characters.filter(
                        (character) => character.id !== characterId,
                    );
                    state.encounters[encounterId].hpChanges = state.encounters[encounterId].hpChanges.filter(
                        (change) => change.characterId !== characterId,
                    );
                });
            },
            renameCharacter: (encounterId, characterId, name) => {
                set((state) => {
                    state.encounters[encounterId].characters = state.encounters[encounterId].characters.map(
                        (character) => {
                            if (character.id === characterId) {
                                character.name = name;
                            }

                            return character;
                        },
                    );
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
