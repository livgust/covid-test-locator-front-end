import React from 'react';
import {render, screen} from '@testing-library/react';
import ValidateReport from './ValidateReport';
import {verifyReport} from '../api';
import {Report} from '../types';

jest.mock('../api');

it('says Validate Report', () => {
  render(<ValidateReport report={{} as Report} />);
  expect(screen.queryByText('Validate Report')).toBeInTheDocument();
});

describe('click behavior', () => {
  it('calls API on click', () => {
    render(<ValidateReport report={{} as Report} />);
    screen.queryByText('Validate Report')?.click();
    expect(verifyReport).toHaveBeenCalledWith({});
  });
  it('disables button on click', () => {
    render(<ValidateReport report={{} as Report} />);
    screen.queryByText('Validate Report')?.click();
    expect(screen.queryByText('Validated')?.closest('button')).toBeDisabled();
  });
  it('updates copy after successful return', () => {
    render(<ValidateReport report={{} as Report} />);
    screen.queryByText('Validate Report')?.click();
    expect(screen.queryByText('Validated')).toBeInTheDocument();
  });
  it('calls callback after click', () => {
    const onClick = jest.fn();
    render(<ValidateReport report={{} as Report} afterValidate={onClick} />);
    screen.queryByText('Validate Report')?.click();
    expect(onClick).toHaveBeenCalled();
  });
});
