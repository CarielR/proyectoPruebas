import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Register from './Register';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders register form and submits successfully', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
    const passwordInput = screen.getByPlaceholderText('******************');
    const fullNameInput = screen.getByPlaceholderText('Nombre completo');
    const roleSelect = screen.getByRole('combobox');
    const submitButton = screen.getByText('Registrar');

    userEvent.type(usernameInput, 'testUser');
    userEvent.type(passwordInput, 'Test@1234');
    userEvent.type(fullNameInput, 'Test User');
    userEvent.selectOptions(roleSelect, 'admin');

    axios.post.mockResolvedValueOnce({});

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Usuario registrado con éxito.')).toBeTruthy();
    });

    expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/register', {
      userName: 'testUser',
      password: 'Test@1234',
      full_name: 'Test User',
      role_user: 'admin',
    });
  });

  it('shows validation errors for invalid inputs', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Registrar');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Porfavor proporcione un usuario que cumpla lo siguiente:')).toBeTruthy();
    });

    expect(screen.getByText('Porfavor proporcione una contraseña que cumpla con lo siguiente:')).toBeTruthy();
    expect(screen.getByText('Porfavor proporcione un nombre.')).toBeTruthy();
    expect(screen.getByText('Porfavor proporcione un rol.')).toBeTruthy();
  });

  it('handles registration error', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
    const passwordInput = screen.getByPlaceholderText('******************');
    const fullNameInput = screen.getByPlaceholderText('Nombre completo');
    const roleSelect = screen.getByRole('combobox');
    const submitButton = screen.getByText('Registrar');

    userEvent.type(usernameInput, 'testUser');
    userEvent.type(passwordInput, 'Test@1234');
    userEvent.type(fullNameInput, 'Test User');
    userEvent.selectOptions(roleSelect, 'admin');

    axios.post.mockRejectedValueOnce(new Error('Registration failed'));

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Ooops, un error ha ocurrido.')).toBeTruthy();
    });
  });
});