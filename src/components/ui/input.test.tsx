import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './input';

describe('TextInput Component', () => {
  it('renders the label and input field', () => {
    render(<TextInput label="Email" id="email" />);

    // Use getByLabelText for accessibility and to find the input associated with the label
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email');
  });

  it('renders with a placeholder', () => {
    render(
      <TextInput label="Email" id="email" placeholder="you@example.com" />
    );

    const input = screen.getByPlaceholderText('you@example.com');
    expect(input).toBeInTheDocument();
  });

  it('updates its value when the user types', async () => {
    const handleChange = vi.fn();
    render(<TextInput label="Name" id="name" onChange={handleChange} />);

    const input = screen.getByLabelText('Name');

    // Act: Simulate the user typing
    await userEvent.type(input, 'John Doe');

    // Assert: Check that the handler was called and the input has the correct value.
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('John Doe'); // This is a simpler, more direct check
  });

  it('displays an error message when the error prop is provided', () => {
    render(
      <TextInput
        label="Password"
        id="password"
        error="Password must be at least 8 characters."
      />
    );

    // Assert: Check for the error message
    const errorMessage = screen.getByText(
      'Password must be at least 8 characters.'
    );
    expect(errorMessage).toBeInTheDocument();

    // Assert: Check for accessibility attributes on the input
    const input = screen.getByLabelText('Password');

    expect(input).toBeInvalid(); // Checks for aria-invalid="true"
  });

  it('does not display an error message when the error prop is not provided', () => {
    render(<TextInput label="Password" id="password" />);

    // Assert: The error message should not be in the document
    const errorMessage = screen.queryByText(
      'Password must be at least 8 characters.'
    );
    expect(errorMessage).not.toBeInTheDocument();

    // Assert: The input should be valid
    const input = screen.getByLabelText('Password');
    expect(input).not.toBeInvalid();
  });
});
