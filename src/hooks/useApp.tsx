'use client';
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {persist} from 'zustand/middleware';
import {ulid} from 'ulid';
import calculateCurrentHp from '../util/currentHp.ts';

export type EncounterId = string;
export type CharacterId = string;

export type Character = {
    id: CharacterId;
    type: 'PC' | 'NPC';
    name: string;
    initiative: number;
    hp?: number;
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
    activeCharacter?: string;
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
    addCharacter: (
        encounterId: EncounterId,
        character: Pick<Character, 'type' | 'name' | 'hp' | 'initiative'>,
        amount: number,
    ) => void;
    deleteCharacter: (encounterId: EncounterId, characterId: CharacterId) => void;
    renameCharacter: (encounterId: EncounterId, characterId: CharacterId, name: string) => void;
    modifyBaseHp: (encounterId: EncounterId, characterId: CharacterId, amount: number) => void;
    modifyHp: (encounterId: EncounterId, characterId: CharacterId, amount: number) => void;
    deleteHpChange: (encounterId: EncounterId, characterId: CharacterId, index: number) => void;
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
                if (!name) {
                    return;
                }

                set((state) => {
                    state.encounters[encounterId].name = name;
                });
            },
            addCharacter: (encounterId, character, amount) => {
                if (!character.name.trim()) {
                    return;
                }

                set((state) => {
                    for (let i = 1; i <= amount; i++) {
                        const name = amount > 1 ? character.name + ' ' + i : character.name;

                        state.encounters[encounterId].characters.push({
                            ...character,
                            name,
                            id: ulid(),
                            hpChanges: [],
                        });
                    }
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
                if (!name.trim()) {
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
            modifyBaseHp: (encounterId, characterId, amount) => {
                set(({encounters}) => {
                    const character = encounters[encounterId].characters.find(
                        (character) => character.id === characterId,
                    );

                    if (!character) {
                        throw new Error('Cannot modify character HP');
                    }

                    character.hp = amount;
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
            deleteHpChange: (encounterId, characterId, index) => {
                set(({encounters}) => {
                    const character = encounters[encounterId].characters.find(
                        (character) => character.id === characterId,
                    );

                    if (!character || !character.hp) {
                        throw new Error('Cannot modify character HP');
                    }

                    character.hpChanges.splice(index, 1);
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
                        encounters[encounterId].activeCharacter = encounters[encounterId].characters[0].id;
                    }
                });
            },
            nextCharacter: (encounterId) => {
                const encounter = get().encounters[encounterId];

                // Game hasn't started yet, so don't do anything
                if (!encounter.activeCharacter || !encounter.turn) {
                    return;
                }

                const availableCharacters = encounter.characters.filter((character) => {
                    // Current character is always available
                    if (character.id === encounter.activeCharacter) {
                        return true;
                    }

                    const currentHp = calculateCurrentHp(character);

                    return currentHp !== 0;
                });

                const activeCharacterIndex = availableCharacters.findIndex(
                    (character) => character.id === encounter.activeCharacter,
                );
                const nextCharacterIndex =
                    activeCharacterIndex === availableCharacters.length - 1 ? 0 : activeCharacterIndex + 1;

                const nextCharacter = availableCharacters[nextCharacterIndex];

                set(({encounters}) => {
                    encounters[encounterId].activeCharacter = nextCharacter.id;
                    if (nextCharacterIndex === 0) {
                        encounters[encounterId].turn!++;
                    }
                });
            },
            resetEncounter: (encounterId) => {
                set(({encounters}) => {
                    encounters[encounterId].turn = undefined;
                    encounters[encounterId].activeCharacter = undefined;
                    encounters[encounterId].characters.forEach((character) => {
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
