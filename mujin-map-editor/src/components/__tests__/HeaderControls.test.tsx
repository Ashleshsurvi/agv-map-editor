import { render, screen } from '@testing-library/react';
import HeaderControls from '../HeaderControls';
import type { MapNode } from '../../types/types';
import '@testing-library/jest-dom';

test('renders HeaderControls with Add Node button and Export button', () => {
  const nodes: MapNode[] = [];
  const setNodes = jest.fn();
  const setSelectedNode = jest.fn();
  const setZoom = jest.fn();
  const setOffset = jest.fn();

  render(
    <HeaderControls
      nodes={nodes}
      savedNodes={[]}
      setNodes={setNodes}
      setSelectedNode={setSelectedNode}
      zoom={1}
      setZoom={setZoom}
      setOffset={setOffset}
    />
  );

  expect(screen.getByText('+ Add Node')).toBeInTheDocument();
  expect(screen.getByText('Export JSON')).toBeInTheDocument();
});
