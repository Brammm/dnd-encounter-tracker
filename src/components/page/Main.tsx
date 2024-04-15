import useApp, {Encounter} from '../../hooks/useApp.tsx';
import AddCharacterForm from '../encounter/AddCharacterForm.tsx';
import Characters from '../encounter/Characters.tsx';
import Header from '../encounter/Header.tsx';
import {Fragment, useState} from 'react';
import Button from '../Button.tsx';
import {
    ArrowDownIcon,
    ArrowUturnLeftIcon,
    DocumentDuplicateIcon,
    ForwardIcon,
    PlayIcon,
    PlusCircleIcon,
    TrashIcon,
} from '@heroicons/react/16/solid';
import {XMarkIcon} from '@heroicons/react/24/solid';
import {Dialog, Transition} from '@headlessui/react';

type Props = {
    encounter: Encounter;
};

export default function Main({encounter}: Props) {
    const {
        addCharacter,
        deleteEncounter,
        duplicateEncounter,
        nextCharacter,
        resetEncounter,
        sortOnInitiative,
        startEncounter,
    } = useApp();

    const [showAddCharacterForm, setShowAddCharacterForm] = useState(false);

    return (
        <main className="bg-gray-100 h-full flex flex-col">
            <Transition.Root show={showAddCharacterForm} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setShowAddCharacterForm}>
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600/30" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="font-serif font-semibold leading-6 text-gray-900">
                                                        Add character
                                                    </Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                            onClick={() => setShowAddCharacterForm(false)}
                                                        >
                                                            <span className="absolute -inset-2.5" />
                                                            <span className="sr-only">Close panel</span>
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                                <AddCharacterForm
                                                    onAdd={(type, name, initiative, hp) => {
                                                        addCharacter(encounter.id, {type, name, initiative, hp});
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <Header encounter={encounter} />

            <div className="flex gap-x-4 bg-gray-200 px-6 py-4">
                <Button
                    disabled={showAddCharacterForm}
                    impact="secondary"
                    size="small"
                    onClick={() => {
                        setShowAddCharacterForm(true);
                    }}
                >
                    <PlusCircleIcon className="h-4" />
                    Add character
                </Button>
                {encounter.characters.length > 0 && (
                    <>
                        <Button impact="secondary" size="small" onClick={() => sortOnInitiative(encounter.id)}>
                            <ArrowDownIcon className="h-4" />
                            Sort on initiative
                        </Button>
                        {encounter.turn ? (
                            <>
                                <Button impact="secondary" size="small" onClick={() => nextCharacter(encounter.id)}>
                                    <ForwardIcon className="h-4" />
                                    Next character
                                </Button>
                                <Button impact="secondary" size="small" onClick={() => resetEncounter(encounter.id)}>
                                    <ArrowUturnLeftIcon className="h-4" />
                                    Reset encounter
                                </Button>
                            </>
                        ) : (
                            <Button impact="secondary" size="small" onClick={() => startEncounter(encounter.id)}>
                                <PlayIcon className="h-4" />
                                Start encounter
                            </Button>
                        )}
                        <Button
                            impact="secondary"
                            size="small"
                            onClick={() => {
                                duplicateEncounter(encounter.id);
                            }}
                        >
                            <DocumentDuplicateIcon className="h-4" />
                            Duplicate encounter
                        </Button>
                    </>
                )}
                <Button
                    impact="secondary"
                    size="small"
                    onClick={() => {
                        if (confirm('Are you sure?')) {
                            deleteEncounter(encounter.id);
                        }
                    }}
                >
                    <TrashIcon className="h-4" />
                    Delete encounter
                </Button>
            </div>

            <Characters encounter={encounter} />
        </main>
    );
}
