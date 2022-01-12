import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import ReportForm from './ReportForm';
import {addReport} from '../api';
import {Place} from '../types';

jest.mock('../api');

const onBack = () => {};

describe('form logic', () => {
  it('requires availability', () => {
    render(<ReportForm place={{} as Place} onBack={onBack} />);
    expect(screen.getByText('Submit')).toHaveAttribute('disabled');
    screen.getByLabelText('No tests available').click();
    expect(screen.getByText('Submit')).not.toHaveAttribute('disabled');
  });

  it('disables limit if no tests available', () => {
    render(<ReportForm place={{} as Place} onBack={onBack} />);
    screen.getByLabelText('No tests available').click();
    expect(screen.getByLabelText('Limit per customer')).toHaveAttribute(
      'disabled'
    );
    screen.getByLabelText('Tests available').click();
    expect(screen.getByLabelText('Limit per customer')).not.toHaveAttribute(
      'disabled'
    );
  });

  it('clears limit if no tests available', () => {
    render(<ReportForm place={{} as Place} onBack={onBack} />);
    const limitInput = screen.getByLabelText(
      'Limit per customer'
    ) as HTMLInputElement;
    screen.getByLabelText('Tests available').click();
    fireEvent.change(limitInput, {target: {value: '1'}});
    expect(limitInput.value).toBe('1');
    screen.getByLabelText('No tests available').click();
    expect(limitInput.value).toBe('');
  });

  it('fills out and submits report, then calls handler', async () => {
    (addReport as jest.Mock).mockImplementation(() => Promise.resolve());
    const onSubmission = jest.fn();
    render(
      <ReportForm
        place={{id: 1} as Place}
        onBack={onBack}
        onSubmission={onSubmission}
      />
    );
    screen.getByLabelText('Tests available').click();
    fireEvent.change(screen.getByLabelText('Limit per customer'), {
      target: {value: '1'},
    });
    act(() => screen.getByText('Submit').click());
    expect(addReport).toHaveBeenCalledWith({
      placeId: 1,
      available: true,
      type: 'at-home rapid antigen test',
      limit: 1,
    });
    await waitFor(() => expect(onSubmission).toHaveBeenCalled());
  });
});
