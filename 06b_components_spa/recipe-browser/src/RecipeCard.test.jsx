import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import RecipeCard from './RecipeCard';

test('the cooked counter increases when clicked', async () => {
    render(
        <MemoryRouter>
            <RecipeCard recipe={{id: '1', title: 'Carbonara', category: 'Pasta', area: 'Italian'}} />
        </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /cooked 0/i }));
    expect(screen.getByRole('button', { name: /cooked 1/i })).toBeTruthy();
});