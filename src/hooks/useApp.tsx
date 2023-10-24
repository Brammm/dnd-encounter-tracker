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

export type Encounter = {
  id: string;
  name: string;
  characters: Character[];
};

type State = {
  encounters: Record<string, Encounter>;
};

type Actions = {
  addCharacter: (encounterId: string, character: Omit<Character, 'id'>) => void;
};

const useApp = create<State & Actions>()(
  persist(
    immer((set) => ({
      encounters: {
        '1': {
          id: '1',
          name: 'Encounter 1',
          characters: [],
        },
      },
      addCharacter: (encounterId, character) => {
        set((draft) => {
          const nextId =
            Object.values(draft.encounters).reduce((total, encounter) => total + encounter.characters.length, 0) + 1;

          draft.encounters[encounterId].characters.push({
            ...character,
            id: nextId.toString(),
          });
        });
      },
    })),
    {name: 'dnd-encounter-tracker'},
  ),
);

export default useApp;
