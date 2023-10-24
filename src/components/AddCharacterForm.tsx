import {FormEvent} from 'react';

type Props = {
  onAdd: (type: 'PC' | 'NPC', name: string, initiative: number, hp?: number) => void;
};

interface FormElements extends HTMLFormControlsCollection {
  'type-PC': HTMLInputElement;
  'type-NPC': HTMLInputElement;
  name: HTMLInputElement;
  initiative: HTMLInputElement;
  hp: HTMLInputElement;
}
interface AddPlayerFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function AddCharacterForm({onAdd}: Props) {
  function handleSubmit(e: FormEvent<AddPlayerFormElement>) {
    e.preventDefault();
    const elements = e.currentTarget.elements;

    let initiative = parseInt(elements.initiative.value);
    if (isNaN(initiative)) {
      initiative = 0;
    }

    let hp: number | string | undefined = elements.hp.value;
    if (!hp) {
      hp = undefined;
    } else {
      hp = parseInt(hp);
      if (isNaN(hp)) {
        hp = 0;
      }
    }

    onAdd(elements['type-PC'].checked ? 'PC' : 'NPC', elements.name.value, initiative, hp);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <input id="type-PC" name="type" type="radio" value="PC" />
        <label htmlFor="type-PC">PC</label>
      </p>
      <p>
        <input id="type-NPC" name="type" type="radio" value="NPC" />
        <label htmlFor="type-NPC">NPC</label>
      </p>
      <p>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" />
      </p>
      <p>
        <label htmlFor="initiative">Initiative</label>
        <input defaultValue={0} id="initiative" min={0} name="initiative" step={1} type="number" />
      </p>
      <p>
        <label htmlFor="name">HP</label>
        <input id="hp" min={0} name="hp" step={1} type="number" />
      </p>
      <button type="submit">Add</button>
    </form>
  );
}
