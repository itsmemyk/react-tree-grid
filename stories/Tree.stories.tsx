import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tree } from '../src/tree'
import type { TreeNode } from '../src/tree'

const data: TreeNode[] = [
  {
    id: 'docs',
    value: 'Documents',
    $opened: true,
    items: [
      {
        id: 'work',
        value: 'Work',
        items: [
          { id: 'report', value: 'Q1 Report.pdf' },
          { id: 'slides', value: 'Presentation.pptx' },
        ],
      },
      {
        id: 'personal',
        value: 'Personal',
        items: [
          { id: 'resume', value: 'Resume.docx' },
          { id: 'cover', value: 'Cover Letter.docx' },
        ],
      },
    ],
  },
  {
    id: 'media',
    value: 'Media',
    items: [
      { id: 'photos', value: 'Photos' },
      { id: 'videos', value: 'Videos' },
    ],
  },
  {
    id: 'downloads',
    value: 'Downloads',
    items: [
      { id: 'archives', value: 'Archives' },
      { id: 'installers', value: 'Installers' },
    ],
  },
]

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Tree>

export const Basic: Story = {
  args: { data },
}

export const WithCheckboxes: Story = {
  args: { data, checkbox: true },
}

export const Editable: Story = {
  args: { data, editable: true },
}

export const Draggable: Story = {
  args: { data, dragItem: 'both' },
}
