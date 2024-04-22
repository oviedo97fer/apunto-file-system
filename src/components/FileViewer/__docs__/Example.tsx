import React, { ChangeEvent, FC, useState } from 'react';
import FileViewer, { FileViewerProps } from '../../FileViewer';
import { Box, Stack, TextField } from '@mui/material';

const fileExample =
    'https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK';

const Example: FC<FileViewerProps> = ({ file = fileExample }) => {
    const [searchText, setSearchText] = useState('');

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        setSearchText(event.target.value);
    }

    return (
        <Stack height="80vh">
            <Box py={1}>
                <TextField
                    size="small"
                    label="Search"
                    variant="outlined"
                    value={searchText}
                    onChange={onChange}
                />
            </Box>

            <FileViewer file={file} searchText={searchText} />
        </Stack>
    );
};

export default Example;
