import React from 'react';
import {render, screen} from '@testing-library/react';
import ValidateReport from './ValidateReport';
import {verifyReport} from '../api';
import {Report} from '../types';

jest.mock('../api');

it('says "This is Right"', () => {
  render(<ValidateReport report={{} as Report} />);
  expect(screen.queryByText('This is right')).toBeInTheDocument();
});

describe('click behavior', () => {
  it('calls API on click', () => {
    render(<ValidateReport report={{} as Report} />);
    screen.queryByText('This is right')?.click();
    expect(verifyReport).toHaveBeenCalledWith({});
  });
  it('disables button on click', () => {
    render(<ValidateReport report={{} as Report} />);
    screen.queryByText('This is right')?.click();
    expect(
      screen.queryByText('Report confirmed')?.closest('button')
    ).toBeDisabled();
  });
  it('updates copy after successful return', () => {
    render(<ValidateReport report={{} as Report} />);
    screen.queryByText('This is right')?.click();
    expect(screen.queryByText('Report confirmed')).toBeInTheDocument();
  });
  it('calls callback after click', () => {
    const onClick = jest.fn();
    render(<ValidateReport report={{} as Report} afterValidate={onClick} />);
    screen.queryByText('This is right')?.click();
    expect(onClick).toHaveBeenCalled();
  });
});
