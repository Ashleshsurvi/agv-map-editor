import { render, screen } from '@testing-library/react';
import NodeDetailsPanel from '../NodeDetailsPanel';
import type { MapNode } from '../../types/types';

test('renders NodeDetailsPanel with node details', () => {
  const node: MapNode = {
    x: 100,
    y: 200,
    code: 1,
    directions: ['North'],
    name: 'Test Node',
  };

  render(
    <NodeDetailsPanel
      node={node}
      setNode={() => {}}
      onSave={() => {}}
      onDelete={() => {}}
    />
  );

  expect(screen.getByDisplayValue('Test Node')).toBeInTheDocument();
  expect(screen.getByText('Directions')).toBeInTheDocument();
});
