import React from 'react';
import {render, screen} from '@testing-library/react';
import ValidateReport from './ValidateReport';
import {verifyReport} from '../api';
import {Report} from '../types';

jest.mock('../api');

it('says "This is Right"', () => {
  render(<ValidateReport report={{} as Report} />);
  expect(screen.queryByText('I agree')).toBeInTheDocument();
});

describe('click behavior', () => {
  it('calls API on click', () => {
    render(<ValidateReport report={{} as Report} />);
    screen.queryByText('I agree')?.click();
    expect(verifyReport).toHaveBeenCalledWith({});
  });
  it('disables button on click', () => {
    render(<ValidateReport report={{} as Report} />);
    screen.queryByText('I agree')?.click();
    expect(
      screen.queryByText('Report confirmed')?.closest('button')
    ).toBeDisabled();
  });
  it('updates copy after successful return', () => {
    render(<ValidateReport report={{} as Report} />);
    screen.queryByText('I agree')?.click();
    expect(screen.queryByText('Report confirmed')).toBeInTheDocument();
  });
  it('calls callback after click', () => {
    const onClick = jest.fn();
    render(<ValidateReport report={{} as Report} afterValidate={onClick} />);
    screen.queryByText('I agree')?.click();
    expect(onClick).toHaveBeenCalled();
  });
});
