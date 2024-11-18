import { Combobox } from '@headlessui/react';
import { useState } from 'react';
import data from '../data/combined.json';
import { defaultInputClassName } from './Input.tsx';

export type CharacterData = {
    custom: boolean;
    name: string;
    hp: { average: string; formula: string } | null;
};

type Props = {
    onChange: (character: CharacterData) => void;
    value: CharacterData;
};

export default function NameComboBox({ onChange, value }: Props) {
    const [query, setQuery] = useState('');

    const filteredCharacters = query.length
        ? data.filter((row) =>
              row.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
          )
        : [];

    return (
        <Combobox value={value} onChange={onChange}>
            <div className="relative">
                <Combobox.Input
                    className={defaultInputClassName}
                    onChange={(e) => setQuery(e.target.value)}
                    displayValue={(char: CharacterData) => char.name}
                    required
                />
                <Combobox.Options className="absolute mt-1 bg-white rounded py-4 z-10 w-full shadow-xl">
                    {query.length > 0 && (
                        <Combobox.Option
                            value={{ name: query, hp: '', custom: true }}
                            className={({ active }) =>
                                `py-2 px-4 ${active && 'bg-primary text-white'}`
                            }
                        >
                            Custom character "{query}"
                        </Combobox.Option>
                    )}
                    {filteredCharacters.slice(0, 100).map((char) => (
                        <Combobox.Option
                            key={char.name}
                            value={{ ...char, custom: false }}
                            className={({ active }) =>
                                `py-2 px-4 ${active && 'bg-primary text-white'}`
                            }
                        >
                            {char.name}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    );
}
