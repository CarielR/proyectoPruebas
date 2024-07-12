import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Modal from 'react-modal';
import AddContent from './AddContents';

// Configurar Modal para las pruebas
Modal.setAppElement(document.createElement('div'));

// Mocks
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
jest.mock('../../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);

describe('AddContent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders content form and submits successfully', async () => {
    render(
      <MemoryRouter>
        <AddContent />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText('Contenido...');
    const descriptionInput = screen.getByPlaceholderText('Descripción...');
    const submitButton = screen.getByText('Registrar Contenido');

    userEvent.type(nameInput, 'Nuevo Contenido');
    userEvent.type(descriptionInput, 'Descripción de prueba');

    axios.post.mockResolvedValueOnce({ data: {} });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('¡Registro exitoso!')).toBeTruthy();
    });

    const confirmButton = screen.getByText('Entendido');
    fireEvent.click(confirmButton);

    expect(screen.getByText('Agregar un nuevo contenido')).toBeTruthy();
  });

  it('renders error modal on submission failure', async () => {
    render(
      <MemoryRouter>
        <AddContent />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText('Contenido...');
    const descriptionInput = screen.getByPlaceholderText('Descripción...');
    const submitButton = screen.getByText('Registrar Contenido');

    userEvent.type(nameInput, 'Nuevo Contenido');
    userEvent.type(descriptionInput, 'Descripción de prueba');

    axios.post.mockRejectedValueOnce(new Error('Error al registrar contenido'));

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al Registrar')).toBeTruthy();
    });

    expect(screen.getByText('Error: Hubo un error registrando el contenido.')).toBeTruthy();

    const errorModalButton = screen.getByText('Entendido');
    fireEvent.click(errorModalButton);

    expect(screen.getByText('Agregar un nuevo contenido')).toBeTruthy();
  });

  it('shows validation errors when form is submitted with empty fields', async () => {
    render(
      <MemoryRouter>
        <AddContent />
      </MemoryRouter>
    );

    const submitButton = screen.getByText('Registrar Contenido');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Este campo es obligatorio')).toBeTruthy();
    });
  });
});