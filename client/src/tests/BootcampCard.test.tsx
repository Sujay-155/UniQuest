import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BootcampCard } from '../components/BootcampCard';
import { Bootcamp } from '../types/bootcamp';

const mockBootcamp: Bootcamp = {
  id: 'b1_test_id',
  name: 'Full Stack Web Development & DevOps',
  provider: '100xDevs',
  tech_stack: ['React', 'Next.js', 'TypeScript', 'Docker'],
  price_inr: 8499,
  placement_guarantee: false,
  isa_available: false,
  alumni_rating: 4.9,
  affiliate_url: 'https://100xdevs.com/?ref=uniquest',
  duration_weeks: 24,
  description: 'Production-grade engineering bootcamp',
};

describe('BootcampCard Component', () => {
  it('renders bootcamp details accurately', () => {
    const onToggleCompare = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <BootcampCard
        bootcamp={mockBootcamp}
        isSelectedForCompare={false}
        onToggleCompare={onToggleCompare}
        onViewDetails={onViewDetails}
      />
    );

    expect(screen.getByText('100xDevs')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Web Development & DevOps')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('24 Weeks')).toBeInTheDocument();
    expect(screen.getByText('Apply Now')).toBeInTheDocument();
  });

  it('renders placement guarantee badge when true', () => {
    const guaranteeBootcamp: Bootcamp = {
      ...mockBootcamp,
      placement_guarantee: true,
      isa_available: true,
    };

    render(
      <BootcampCard
        bootcamp={guaranteeBootcamp}
        isSelectedForCompare={false}
        onToggleCompare={vi.fn()}
        onViewDetails={vi.fn()}
      />
    );

    expect(screen.getByText('Job Guarantee')).toBeInTheDocument();
    expect(screen.getByText('ISA / Pay After Placement')).toBeInTheDocument();
  });

  it('triggers onToggleCompare callback on checkbox toggle', () => {
    const onToggleCompare = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <BootcampCard
        bootcamp={mockBootcamp}
        isSelectedForCompare={false}
        onToggleCompare={onToggleCompare}
        onViewDetails={onViewDetails}
      />
    );

    const compareCheckbox = screen.getByRole('checkbox');
    expect(compareCheckbox).not.toBeChecked();

    fireEvent.click(compareCheckbox);
    expect(onToggleCompare).toHaveBeenCalledTimes(1);
    expect(onToggleCompare).toHaveBeenCalledWith(mockBootcamp);
  });

  it('triggers onViewDetails callback on title or Details button click', () => {
    const onViewDetails = vi.fn();

    render(
      <BootcampCard
        bootcamp={mockBootcamp}
        isSelectedForCompare={false}
        onToggleCompare={vi.fn()}
        onViewDetails={onViewDetails}
      />
    );

    const detailsButton = screen.getByText('Details');
    fireEvent.click(detailsButton);
    expect(onViewDetails).toHaveBeenCalledWith('b1_test_id');
  });
});
