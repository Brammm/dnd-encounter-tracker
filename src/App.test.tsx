import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import useApp, {State} from './hooks/useApp.tsx';

const user = userEvent.setup();

describe('App', () => {
    test('Should render with one initial encounter', async () => {
        renderApp();

        expect(await screen.findByRole('button', {name: /encounter 1/i})).toBeInTheDocument();
        expect(await screen.findByRole('heading', {name: /encounter 1/i})).toBeInTheDocument();
    });

    test('Adds and immediately selects a new encounter', async () => {
        renderApp();

        await act(async () => {
            await user.click(await screen.findByRole('button', {name: /add encounter/i}));
        });

        expect(await screen.findByRole('button', {name: /encounter 2/i})).toBeInTheDocument();
        expect(await screen.findByRole('heading', {name: /encounter 2/i})).toBeInTheDocument();
    });

    test('Allows navigating to other encounter', async () => {
        renderApp({
            activeEncounterId: 'foo',
            encounters: {
                foo: {name: 'Foo', characters: [], id: 'foo'},
                bar: {name: 'Bar', characters: [], id: 'bar'},
            },
        });

        expect(await screen.findByRole('heading', {name: /foo/i})).toBeInTheDocument();
        await act(async () => {
            await user.click(await screen.findByRole('button', {name: /bar/i}));
        });
        expect(await screen.findByRole('heading', {name: /bar/i})).toBeInTheDocument();
    });
});

const renderApp = (initialState?: Partial<State>) => {
    render(<App />);
    if (initialState) {
        act(() => useApp.setState(initialState));
    }
};
