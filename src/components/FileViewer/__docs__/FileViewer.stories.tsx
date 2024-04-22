import type { Meta, StoryObj } from '@storybook/react';
import Example from './Example';

const meta: Meta<typeof Example> = {
    title: 'FileViewer',
    component: Example
};

export default meta;
type Story = StoryObj<typeof Example>;

export const Primary: Story = {
    args: {
        text: 'FileViewer',
        disabled: false,
        onClick: () => console.log('FileViewer')
    }
};
export const Secondary: Story = {
    args: {
        text: 'FileViewer',
        primary: false,
        disabled: false,
        size: 'small',
        onClick: () => console.log('FileViewer')
    }
};
