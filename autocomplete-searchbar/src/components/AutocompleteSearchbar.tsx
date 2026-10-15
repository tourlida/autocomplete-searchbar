import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { fetchClinicalMockData } from "../services/mock-clinical-data-service";

type ClinicalResults = Awaited<ReturnType<typeof fetchClinicalMockData>>;
type ClinicalItem = ClinicalResults[number];

function AutocompleteSearchbar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<ClinicalResults>([]);

    // 1. Νέα states για τον έλεγχο του πληκτρολογίου και του popup
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Ref για να ανιχνεύουμε κλικ εκτός του component
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            setIsLoading(false);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        const controller = new AbortController();

        const loadData = async () => {
            try {
                const data = await fetchClinicalMockData(searchTerm, controller.signal);
                setResults(data);
                setIsOpen(data.length > 0 || data.length === 0);
                setActiveIndex(-1); // Reset του focus όταν έρχονται νέα αποτελέσματα
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Real network error:', error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            controller.abort();
        };
    }, [searchTerm]);

    // 2. Κλείσιμο του dropdown αν ο χρήστης κάνει κλικ εκτός του component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectOption = (item: ClinicalItem) => {
        setSearchTerm(item.term);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    // 3. Η Μηχανή Κατάστασης του Πληκτρολογίου (Keyboard Event Handler)
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Αν το popup είναι κλειστό και ο χρήστης πατήσει το κάτω βέλος, το ανοίγουμε
        if (!isOpen && e.key === 'ArrowDown') {
            setIsOpen(true);
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault(); // Αποφυγή μετακίνησης του κέρσορα στο input
                if (results.length > 0) {
                    setActiveIndex(prev => (prev + 1 >= results.length ? 0 : prev + 1));
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (results.length > 0) {
                    setActiveIndex(prev => (prev - 1 < 0 ? results.length - 1 : prev - 1));
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (isOpen && activeIndex >= 0 && activeIndex < results.length) {
                    handleSelectOption(results[activeIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setActiveIndex(-1);
                break;
            case 'Tab':
                // Αν ο χρήστης πατήσει Tab, κλείνουμε απλά το dropdown
                setIsOpen(false);
                break;
        }
    };

    return (
        <div ref={containerRef} className="autocomplete">
            <input
                className="autocomplete__input"
                placeholder="Try a biomarker, event, or clinical term..."
                aria-label="Search clinical concepts"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown} // 4. Σύνδεση των keyboard events

                // 5. WAI-ARIA Attributes για Προσβασιμότητα
                type="text"
                role="combobox"
                aria-expanded={isOpen}
                aria-autocomplete="list"
                aria-controls="clinical-autocomplete-list"
                aria-activedescendant={activeIndex >= 0 ? `suggestion-item-${activeIndex}` : undefined}
            />
            {/* Εμφάνιση του Popup */}
            {isOpen && searchTerm.trim() && (
                <ul
                    className="autocomplete__list"
                    id="clinical-autocomplete-list"
                    role="listbox"
                >
                    {isLoading && (
                        <li className="autocomplete__message" role="status">
                            Loading metrics...
                        </li>
                    )}

                    {!isLoading && results.length === 0 && (
                        <li className="autocomplete__message">
                            No matching clinical records found.
                        </li>
                    )}

                    {!isLoading && results.map((item, index) => {
                        const isHoveredOrFocused = index === activeIndex;
                        return (
                            <li
                                key={item.id}
                                className="autocomplete__option"
                                id={`suggestion-item-${index}`}
                                role="option"
                                aria-selected={isHoveredOrFocused}
                                onClick={() => handleSelectOption(item)}
                                // Συγχρονισμός του ποντικιού με το activeIndex
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <span className="autocomplete__result-icon" aria-hidden="true">
                                    <svg viewBox="0 0 20 20" fill="none">
                                        <path d="M2.5 10h4l2-5 3.5 10 2.5-6 1.5 1H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="autocomplete__result-copy">
                                    <strong>{item.term}</strong>
                                    <span>{item.activePatientCount.toLocaleString()} active patients</span>
                                </span>
                                <span className="autocomplete__category">{item.category.replace(/([a-z])([A-Z])/g, '$1 $2')}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default AutocompleteSearchbar;