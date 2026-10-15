
export interface ClinicalSearchEntity {
    id: string;
    term: string;
    category: 'Biomarker' | 'AdverseEvent' | 'ConMed' | 'ProtocolCriteria';
    activePatientCount: number;
}

const MOCK_CLINICAL_DATA: ClinicalSearchEntity[] = [
    { id: '1', term: 'Alanine Aminotransferase (ALT) Elevation', category: 'Biomarker', activePatientCount: 142 },
    { id: '2', term: 'Aspartate Aminotransferase (AST) Spike', category: 'Biomarker', activePatientCount: 98 },
    { id: '3', term: 'Maculopapular Rash (Infusion Reaction)', category: 'AdverseEvent', activePatientCount: 34 }
];

export const fetchClinicalMockData = (query: string, signal: AbortSignal): Promise<ClinicalSearchEntity[]> => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            if (signal.aborted) {
                reject(new DOMException('Aborted by the user', 'AbortError'));
            } else {
                const filtered = MOCK_CLINICAL_DATA.filter(item =>
                    item.term.toLowerCase().includes(query.toLowerCase())
                );
                resolve(filtered);
            }
        }, 400);

        signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(new DOMException('Aborted by the user', 'AbortError'));
        });
    });
};