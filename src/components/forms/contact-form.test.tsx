// contact-form.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './contact-form';
import { describe, it, expect, vi, test } from 'vitest';

describe('ContactForm Validation', () => {
  it('shows error when name is too short', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(nameInput, 'A'); // น้อยกว่า 2 ตัวอักษร
    await user.click(submitButton);

    expect(
      await screen.findByText(/name must be at least 2 characters/i)
    ).toBeInTheDocument();
  });

  test('shows error when email is invalid', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
  });

  test('shows error when message is too short', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await user.type(messageInput, 'Short'); // น้อยกว่า 10 ตัวอักษร
    await user.click(submitButton);

    expect(
      await screen.findByText(/message must be at least 10 characters/i)
    ).toBeInTheDocument();
  });

  test('clears errors when user corrects input', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // ใส่ค่าผิด
    await user.type(nameInput, 'A');
    await user.click(submitButton);

    expect(
      await screen.findByText(/name must be at least 2 characters/i)
    ).toBeInTheDocument();

    // แก้ไขให้ถูกต้อง
    await user.clear(nameInput);
    await user.type(nameInput, 'John Doe');

    expect(
      screen.queryByText(/name must be at least 2 characters/i)
    ).not.toBeInTheDocument();
  });
});
