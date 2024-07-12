import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Login from './Login';

// Mocks
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );


    expect(screen.getByPlaceholderText(/Nombre de usuario/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Contrasenia/i)).toBeTruthy();
  });

  it('shows validation errors when form is submitted with empty fields', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Iniciar sesión');

    fireEvent.click(submitButton);
    
    
    expect(await screen.findByText(/Por favor proporcione una contraseña/i)).toBeTruthy();
  });

  it('shows wrong credentials message when login fails', async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 401,
      },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    userEvent.type(screen.getByPlaceholderText(/Nombre de usuario/i), 'testuser');
    userEvent.type(screen.getByPlaceholderText(/Contrasenia/i), 'wrongpassword');

    fireEvent.click(screen.getByText('Iniciar sesión'));

    expect(await screen.findByText(/Las credenciales proporcionadas son erradas/i)).toBeTruthy();
  });

});
