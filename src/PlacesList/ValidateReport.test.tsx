import React from 'react';
import {render, screen} from '@testing-library/react';
import ValidateReport from './ValidateReport';
import {verifyReport} from '../api';

jest.mock('../api');

it('says Validate Report', () => {
  render(<ValidateReport reportId={1} />);
  expect(screen.queryByText('Validate Report')).toBeInTheDocument();
});

describe('click behavior', () => {
  it('calls API on click', () => {
    render(<ValidateReport reportId={1} />);
    screen.queryByText('Validate Report')?.click();
    expect(verifyReport).toHaveBeenCalledWith(1);
  });
  it('disables button on click', () => {
    render(<ValidateReport reportId={1} />);
    screen.queryByText('Validate Report')?.click();
    expect(screen.queryByText('Validated')?.closest('button')).toBeDisabled();
  });
  it('updates copy after successful return', () => {
    render(<ValidateReport reportId={1} />);
    screen.queryByText('Validate Report')?.click();
    expect(screen.queryByText('Validated')).toBeInTheDocument();
  });
  it('calls callback after click', () => {
    const onClick = jest.fn();
    render(<ValidateReport reportId={1} afterValidate={onClick} />);
    screen.queryByText('Validate Report')?.click();
    expect(onClick).toHaveBeenCalled();
  });
});
