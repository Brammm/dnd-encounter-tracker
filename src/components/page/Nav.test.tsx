import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useApp, { type State } from '../../store/useApp.tsx';
import Nav from './Nav.tsx';

const user = userEvent.setup();

describe('Nav component', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('Should render with one initial encounter', async () => {
        renderComponent();

        const navButton = screen.getByRole('button', { name: /encounter 1/i });
        expect(navButton).toBeInTheDocument();
        expect(navButton).toHaveAttribute('aria-current', 'page');
    });

    test('Adds and immediately selects a new encounter', async () => {
        renderComponent();

        await act(async () => {
            await user.click(
                screen.getByRole('button', { name: /add encounter/i }),
            );
        });

        const navButton = screen.getByRole('button', { name: /encounter 2/i });
        expect(navButton).toBeInTheDocument();
        expect(navButton).toHaveAttribute('aria-current', 'page');
    });

    test('Allows navigating to other encounter', async () => {
        renderComponent({
            activeEncounterId: 'foo',
            encounters: {
                foo: { name: 'Foo', characters: [], id: 'foo' },
                bar: { name: 'Bar', characters: [], id: 'bar' },
            },
        });

        const fooNav = screen.getByRole('button', { name: /foo/i });
        const barNav = screen.getByRole('button', { name: /bar/i });
        expect(fooNav).toHaveAttribute('aria-current', 'page');
        expect(barNav).not.toHaveAttribute('aria-current', 'page');
        await act(async () => {
            await user.click(barNav);
        });
        expect(fooNav).not.toHaveAttribute('aria-current', 'page');
        expect(barNav).toHaveAttribute('aria-current', 'page');
    });

    test('Does not reset if confirm is cancelled', async () => {
        vi.spyOn(window, 'confirm').mockImplementation(() => false);
        renderComponent({
            activeEncounterId: 'foo',
            encounters: {
                foo: { name: 'Foo', characters: [], id: 'foo' },
                bar: { name: 'Bar', characters: [], id: 'bar' },
            },
        });

        const resetButton = screen.getByRole('button', { name: /reset/i });
        await act(async () => {
            await user.click(resetButton);
        });

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(4);
    });

    test('Can reset everything', async () => {
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
        renderComponent({
            activeEncounterId: 'foo',
            encounters: {
                foo: { name: 'Foo', characters: [], id: 'foo' },
                bar: { name: 'Bar', characters: [], id: 'bar' },
            },
        });

        const resetButton = screen.getByRole('button', { name: /reset/i });
        await act(async () => {
            await user.click(resetButton);
        });

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBe(3);
    });
});

const renderComponent = (initialState?: Partial<State>) => {
    render(<Nav />);
    if (initialState) {
        act(() => useApp.setState(initialState));
    }
};
