import { useState, useEffect, RefObject } from 'react';

const usePdfNavigation = (
    pdfWrapperRef: RefObject<HTMLDivElement>,
    numPages: number
) => {
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        function detectCurrentPage() {
            const wrapper = pdfWrapperRef.current;
            if (wrapper) {
                const pageElements =
                    wrapper.getElementsByClassName('react-pdf__Page');
                for (let i = 0; i < pageElements.length; i++) {
                    const rect = pageElements[i].getBoundingClientRect();
                    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                        return i + 1;
                    }
                }
            }
            return 1;
        }

        function handleScroll() {
            const currentPage = detectCurrentPage();
            setPageNumber(currentPage);
        }

        const wrapper = pdfWrapperRef.current;
        if (wrapper) {
            wrapper.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (wrapper) {
                wrapper.removeEventListener('scroll', handleScroll);
            }
        };
    }, [pdfWrapperRef]);

    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= numPages) {
            setPageNumber(newPage);
            const wrapper = pdfWrapperRef.current;
            if (wrapper) {
                const pageElement = wrapper.querySelector(
                    `.react-pdf__Page[data-page-number="${newPage}"]`
                );
                if (pageElement) {
                    pageElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    };

    return { pageNumber, goToPage };
};

export default usePdfNavigation;
