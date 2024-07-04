import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Acept from './Acept';
import Modal from 'react-modal';

Modal.setAppElement(document.createElement('div')); // Required for React Modal

describe('Acept', () => {
  test('renderiza correctamente cuando ViewModalOpen es verdadero', () => {
    render(<Acept viewModalOpen={true} closeModal={() => {}} />);

    // Check if the modal is rendered
    expect(screen.getByText('¡Registro exitoso!')).toBeInTheDocument();
    expect(screen.getByText('El registro se realizó correctamente.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entendido' })).toBeInTheDocument();
  });

  test('no se muestra cuando viewModalOpen es falso', () => {
    render(<Acept viewModalOpen={false} closeModal={() => {}} />);

    // Check if the modal is not rendered
    expect(screen.queryByText('¡Registro exitoso!')).not.toBeInTheDocument();
  });

  test('llama a closeModal cuando se pulsa el botón de cierre', () => {
    const closeModalMock = jest.fn();
    render(<Acept viewModalOpen={true} closeModal={closeModalMock} />);

    // Find the button and cli  ck it
    fireEvent.click(screen.getByRole('button', { name: 'Entendido' }));

    // Check if closeModal was called
    expect(closeModalMock).toHaveBeenCalledTimes(1);
  });
});
