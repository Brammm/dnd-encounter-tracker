import { act, render, screen } from '@testing-library/react';

import useApp, { type State } from '../../store/useApp.tsx';
import Main from './Main.tsx';

describe('Characters component', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('Can start encounter', async () => {
        renderComponent({
            activeEncounterId: 'foo',
            encounters: {
                foo: {
                    id: 'foo',
                    name: 'Encounter 1',
                    characters: [
                        {
                            id: 'char1',
                            type: 'PC',
                            name: 'Character 1',
                            initiative: 12,
                            hp: 40,
                            hpChanges: [],
                        },
                        {
                            id: 'char2',
                            type: 'PC',
                            name: 'Character 2',
                            initiative: 16,
                            hp: 40,
                            hpChanges: [],
                        },
                    ],
                },
            },
        });

        const startButton = screen.getByRole('button', { name: /start/i });
        expect(startButton).toBeInTheDocument();
    });
});

const renderComponent = (initialState: Partial<State>) => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const encounter = initialState.encounters![initialState.activeEncounterId!];

    render(<Main encounter={encounter} />);
    if (initialState) {
        act(() => useApp.setState(initialState));
    }
};
