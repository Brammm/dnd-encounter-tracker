import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';

describe.sequential('App', () => {
    test('Should render with one initial encounter', async () => {
        renderApp();

        expect(await screen.findByRole('button', {name: /encounter 1/i})).toBeInTheDocument();
        expect(await screen.findByRole('heading', {name: /encounter 1/i})).toBeInTheDocument();
    });

    test('Adds and immediately selects a new encounter', async () => {
        const user = userEvent.setup();
        renderApp();

        await act(async () => {
            await user.click(await screen.findByRole('button', {name: /add encounter/i}));
        });

        expect(await screen.findByRole('button', {name: /encounter 2/i})).toBeInTheDocument();
        expect(await screen.findByRole('heading', {name: /encounter 2/i})).toBeInTheDocument();
    });
});

const renderApp = () => render(<App />);
