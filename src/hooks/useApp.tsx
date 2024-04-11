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
    hpChanges: HpChange[];
};

export type HpChange = {
    amount: number;
    turn: number;
};

export type Encounter = {
    id: EncounterId;
    name: string;
    characters: Character[];
    turn?: number;
};

export type State = {
    activeEncounterId: EncounterId;
    encounters: Record<EncounterId, Encounter>;
    settings: {
        multiplier: number;
        hpType: 'AVERAGE' | 'FORMULA';
    };
};

type Actions = {
    selectActiveEncounter: (encounterId: EncounterId) => void;
    updateSettings: (multiplier: number, hpType: State['settings']['hpType']) => void;
    addEncounter: () => void;
    duplicateEncounter: (encounterId: EncounterId) => void;
    deleteEncounter: (encounterId: EncounterId) => void;
    renameEncounter: (encounterId: EncounterId, name: string) => void;
    addCharacter: (encounterId: EncounterId, character: Pick<Character, 'type' | 'name' | 'hp' | 'initiative'>) => void;
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
    activeEncounterId: '11b7ef78-073e-485e-9984-5e287eb361cc',
    encounters: {
        '11b7ef78-073e-485e-9984-5e287eb361cc': {
            id: '11b7ef78-073e-485e-9984-5e287eb361cc',
            name: 'Encounter 1',
            characters: [],
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
            selectActiveEncounter: (encounterId) => {
                set((state) => {
                    if (!(encounterId in get().encounters)) {
                        return;
                    }

                    state.activeEncounterId = encounterId;
                });
            },
            updateSettings: (multiplier, hpType) => {
                set({
                    settings: {multiplier, hpType},
                });
            },
            addEncounter: () => {
                const nextId = ulid();
                set((state) => {
                    state.encounters[nextId] = {
                        id: nextId,
                        name: 'Encounter ' + (Object.values(state.encounters).length + 1).toString(),
                        characters: [],
                    };
                    state.activeEncounterId = nextId;
                });
            },
            duplicateEncounter: (encounterId) => {
                const nextId = ulid();

                const characters = get().encounters[encounterId].characters.map((char) => ({...char, hpChanges: []}));

                set((state) => {
                    state.encounters[nextId] = {
                        id: nextId,
                        name: 'Encounter ' + (Object.values(state.encounters).length + 1).toString(),
                        characters,
                    };
                    state.activeEncounterId = nextId;
                });
            },
            deleteEncounter: (encounterId) => {
                set((state) => {
                    delete state.encounters[encounterId];
                    if (Object.values(state.encounters).length === 0) {
                        state.encounters = defaultState.encounters;
                    }
                    if (encounterId === state.activeEncounterId) {
                        console.log('test');
                        state.activeEncounterId = Object.keys(state.encounters)[0];
                    }
                });
            },
            renameEncounter: (encounterId, name) => {
                set((state) => {
                    state.encounters[encounterId].name = name;
                });
            },
            addCharacter: (encounterId, character) => {
                if (!character.name) {
                    return;
                }

                set((state) => {
                    state.encounters[encounterId].characters.push({
                        ...character,
                        id: ulid(),
                        takingTurn: false,
                        hpChanges: [],
                    });
                });
            },
            deleteCharacter: (encounterId, characterId) => {
                set((state) => {
                    state.encounters[encounterId].characters = state.encounters[encounterId].characters.filter(
                        (character) => character.id !== characterId,
                    );
                });
            },
            renameCharacter: (encounterId, characterId, name) => {
                if (!name) {
                    return;
                }

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

                    character.hpChanges.push({amount, turn: encounters[encounterId].turn || 1});
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
                    encounters[encounterId].turn = undefined;
                    encounters[encounterId].characters.forEach((character) => {
                        character.takingTurn = false;
                        character.hpChanges = [];
                    });
                });
            },
            reset: () => {
                set(defaultState);
            },
        })),
        {name: 'dnd-encounter-tracker', version: 2},
    ),
);

export default useApp;
