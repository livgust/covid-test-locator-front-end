import React from 'react';
import {render, screen} from '@testing-library/react';
import PlacesList from '../PlacesList';
import {Place} from '../types';
import {format} from 'date-fns';

describe('basic display', () => {
  it('shows the name of each place', () => {
    const places = [
      {
        id: 1,
        name: 'Walgreens',
        reports: [],
      } as any as Place,
      {
        id: 2,
        name: 'CVS',
        reports: [],
      } as any as Place,
    ];
    render(<PlacesList places={places} />);
    expect(screen.queryByText('Walgreens')).toBeInTheDocument();
    expect(screen.queryByText('CVS')).toBeInTheDocument();
  });

  it('shows the short address', () => {
    const places = [
      {
        id: 1,
        name: 'Walgreens',
        vicinity: '123 Easy Street, Emerald City',
        reports: [],
      } as any as Place,
    ];
    render(<PlacesList places={places} />);
    expect(
      screen.queryByText('123 Easy Street, Emerald City')
    ).toBeInTheDocument();
  });
});

it('shows if there is availability', () => {
  const places = [
    {
      id: 1,
      name: 'Walgreens',
      reports: [{placeId: 1, available: true}],
    } as any as Place,
  ];
  render(<PlacesList places={places} />);
  expect(screen.queryByText('Tests available')).toBeInTheDocument();
});

it('shows if there is not availability', () => {
  const places = [
    {
      id: 2,
      name: 'CVS',
      reports: [{placeId: 2, available: false}],
    } as any as Place,
  ];
  render(<PlacesList places={places} />);
  expect(screen.queryByText('Tests not available')).toBeInTheDocument();
});

it('shows if no data is reported', () => {
  const places = [{id: 2, name: 'CVS', reports: []} as any as Place];
  render(<PlacesList places={places} />);
  expect(screen.queryByText('Test availability unknown')).toBeInTheDocument();
});

it('shows how stale the report is', () => {
  const places = [
    {
      id: 2,
      name: 'CVS',
      reports: [
        {
          placeId: 2,
          available: true,
          created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        },
      ],
    } as any as Place,
  ];
  render(<PlacesList places={places} />);
  expect(
    screen.queryByText('Reported less than a minute ago')
  ).toBeInTheDocument();
});

describe('validation logic', () => {
  it('shows how many validations the report received', () => {
    const places = [
      {
        id: 2,
        name: 'CVS',
        reports: [
          {
            placeId: 2,
            available: true,
            created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            validationCount: 3,
          },
        ],
      } as any as Place,
    ];
    render(<PlacesList places={places} />);
    expect(screen.queryByText('3 validation(s)')).toBeInTheDocument();
  });

  it('shows no-validation copy', () => {
    const places = [
      {
        id: 2,
        name: 'CVS',
        reports: [
          {
            placeId: 2,
            available: true,
            created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            validationCount: 0,
          },
        ],
      } as any as Place,
    ];
    render(<PlacesList places={places} />);
    expect(screen.queryByText('No validations yet')).toBeInTheDocument();
  });

  it('shows validate button if a report appears', () => {
    const places = [
      {
        id: 2,
        name: 'CVS',
        reports: [
          {
            placeId: 2,
            available: true,
            created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            validationCount: 0,
          },
        ],
      } as any as Place,
    ];
    render(<PlacesList places={places} />);
    expect(screen.queryByText('Validate Report')).toBeInTheDocument();
  });

  it('increases validation count after pressing button', () => {
    const places = [
      {
        id: 2,
        name: 'CVS',
        reports: [
          {
            placeId: 2,
            available: true,
            created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            validationCount: 0,
          },
        ],
      } as any as Place,
    ];
    render(<PlacesList places={places} />);
    screen.queryByText('Validate Report')?.click();
    expect(screen.queryByText('1 validation(s)')).toBeInTheDocument();
  });
});
