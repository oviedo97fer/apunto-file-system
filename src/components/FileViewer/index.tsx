import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    Button,
    ButtonGroup,
    CssBaseline,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { Document, Page, pdfjs } from 'react-pdf';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import usePdfNavigation from '../../hooks/usePdfNavigation';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import useResizeObserver from '@react-hook/resize-observer';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export type FileViewerProps = {
    file: File | string | Uint8Array | ArrayBuffer | Blob | null | undefined;
    searchText?: string;
    // text?: string;
    // disabled?: boolean;
    // size?: 'small' | 'medium' | 'large';
    // onClick?: MouseEventHandler<HTMLButtonElement>;
};
/**
 * 1. View a PDF File
 */

function highlightPattern(text: string, pattern: string) {
    return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}

const FileViewer: React.FC<FileViewerProps> = ({ file, searchText = '' }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const pdfWrapperRef = useRef<HTMLDivElement | null>(null);
    const [pageWidth, setPageWidth] = useState(0);

    const { pageNumber, goToPage } = usePdfNavigation(pdfWrapperRef, numPages);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        const textLayers = document.querySelectorAll(
            '.react-pdf__Page__textContent'
        );
        textLayers.forEach((layer: Element) => {
            const { style } = layer as HTMLElement;
            style.top = '0';
            style.left = '0';
            style.transform = '';
        });
        setNumPages(numPages);
    }

    function changePage(offset: number) {
        goToPage(pageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    const textRenderer = useCallback(
        (textItem: any) => highlightPattern(textItem.str, searchText),
        [searchText]
    );

    useEffect(() => {
        console.log('FileViewer mounted', file);
    }, []);

    const handleResize = (entry: any) => {
        const { width } = entry.contentRect;
        const margin = 2; // Adjust this margin as necessary
        setPageWidth(width - margin);
    };

    useResizeObserver(pdfWrapperRef, handleResize);

    return (
        <Grid
            container
            borderRadius={2}
            height={'100%'}
            width={'100%'}
            p={1}
            position="relative"
            alignItems="center"
            justifyContent="center"
            sx={{
                background: grey[300],
                '& canvas': {
                    borderRadius: 1
                },
                '& .react-pdf__Page': {
                    marginBottom: 2
                }
            }}
        >
            <CssBaseline />
            <Grid
                item
                xs={12}
                height="100%"
                overflow="auto"
                justifyContent="center"
                alignItems="center"
            >
                <Paper
                    ref={pdfWrapperRef}
                    elevation={0}
                    sx={{
                        border: '1px solid red',
                        borderRadius: 2,
                        p: 1
                    }}
                >
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onError={(error) => {
                            console.log(error);
                        }}
                    >
                        {Array.from(new Array(numPages), (_, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                customTextRenderer={textRenderer}
                                width={pageWidth}
                            />
                        ))}
                    </Document>
                </Paper>
                <Stack
                    position="absolute"
                    bottom={20}
                    width={'100%'}
                    alignItems="center"
                    zIndex={15}
                    sx={{
                        pointerEvents: 'none'
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={3}
                        component={(props) => (
                            <Paper
                                elevation={0}
                                variant="outlined"
                                sx={{
                                    borderRadius: '8px',
                                    backgroundColor: '#F8F6F8',
                                    px: 2,
                                    py: 1.5
                                }}
                                {...props}
                            />
                        )}
                        sx={{
                            pointerEvents: 'all'
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                userSelect: 'none'
                            }}
                        >
                            Page {pageNumber} of {numPages}
                        </Typography>
                        <ButtonGroup
                            disableElevation
                            variant="contained"
                            aria-label="Disabled button group"
                        >
                            <IconButton
                                onClick={previousPage}
                                disabled={pageNumber <= 1}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton
                                onClick={nextPage}
                                disabled={pageNumber >= numPages}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        </ButtonGroup>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default FileViewer;
