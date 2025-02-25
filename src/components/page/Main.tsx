import { Dialog, Transition } from '@headlessui/react';
import {
    ArrowUturnLeftIcon,
    BarsArrowDownIcon,
    DocumentDuplicateIcon,
    ForwardIcon,
    PlayIcon,
    PlusCircleIcon,
    TrashIcon,
    XMarkIcon,
} from '@heroicons/react/16/solid';
import { Fragment, useState } from 'react';
import useApp, { type Encounter } from '../../store/useApp.tsx';
import Button from '../Button.tsx';
import AddCharacterForm from '../encounter/AddCharacterForm.tsx';
import Characters from '../encounter/Characters.tsx';

type Props = {
    encounter: Encounter;
};

export default function Main({ encounter }: Props) {
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
        <main>
            <Transition.Root show={showAddCharacterForm} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={setShowAddCharacterForm}
                >
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
                                                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                            onClick={() =>
                                                                setShowAddCharacterForm(
                                                                    false,
                                                                )
                                                            }
                                                        >
                                                            <span className="absolute -inset-2.5" />
                                                            <span className="sr-only">
                                                                Close panel
                                                            </span>
                                                            <XMarkIcon
                                                                className="h-6 w-6"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                                <AddCharacterForm
                                                    onAdd={(
                                                        type,
                                                        amount,
                                                        name,
                                                        initiative,
                                                        hp,
                                                    ) => {
                                                        addCharacter(
                                                            encounter.id,
                                                            {
                                                                type,
                                                                name,
                                                                initiative,
                                                                hp,
                                                            },
                                                            amount,
                                                        );
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

            <div className="flex gap-x-4 bg-gray-200 px-8 py-4 shadow-xs sticky top-0">
                <Button
                    disabled={showAddCharacterForm}
                    impact="secondary"
                    size="small"
                    onClick={() => {
                        setShowAddCharacterForm(true);
                    }}
                >
                    <PlusCircleIcon className="h-4" />
                    <span title="Add character" className="hidden lg:inline">
                        Add character
                    </span>
                </Button>
                {encounter.characters.length > 0 && (
                    <>
                        <Button
                            impact="secondary"
                            size="small"
                            onClick={() => sortOnInitiative(encounter.id)}
                        >
                            <BarsArrowDownIcon className="h-4" />
                            <span
                                title="Sort on initiative"
                                className="hidden lg:inline"
                            >
                                Sort on initiative
                            </span>
                        </Button>
                        {encounter.turn ? (
                            <>
                                <Button
                                    impact="secondary"
                                    size="small"
                                    onClick={() => nextCharacter(encounter.id)}
                                >
                                    <ForwardIcon className="h-4" />
                                    <span
                                        title="Next character"
                                        className="hidden lg:inline"
                                    >
                                        Next character
                                    </span>
                                </Button>
                                <Button
                                    impact="secondary"
                                    size="small"
                                    onClick={() => resetEncounter(encounter.id)}
                                >
                                    <ArrowUturnLeftIcon className="h-4" />
                                    <span
                                        title="Reset"
                                        className="hidden lg:inline"
                                    >
                                        Reset
                                    </span>
                                </Button>
                            </>
                        ) : (
                            <Button
                                impact="secondary"
                                size="small"
                                onClick={() => startEncounter(encounter.id)}
                            >
                                <PlayIcon className="h-4" />
                                <span
                                    title="Start"
                                    className="hidden lg:inline"
                                >
                                    Start
                                </span>
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
                            <span
                                title="Duplicate"
                                className="hidden lg:inline"
                            >
                                Duplicate
                            </span>
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
                    <span title="Delete" className="hidden lg:inline">
                        Delete
                    </span>
                </Button>
            </div>

            <Characters encounter={encounter} />
        </main>
    );
}
