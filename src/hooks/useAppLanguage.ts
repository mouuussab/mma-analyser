import { useEffect, useState } from 'react';

export type AppLanguage = 'en' | 'fr';

export const useAppLanguage = (): AppLanguage => {
    const readLanguage = (): AppLanguage => {
        if (typeof document === 'undefined') return 'en';
        return document.body?.getAttribute('data-language') === 'fr' ? 'fr' : 'en';
    };

    const [language, setLanguage] = useState<AppLanguage>(readLanguage);

    useEffect(() => {
        if (typeof document === 'undefined') return;

        setLanguage(readLanguage());

        const observer = new MutationObserver(() => {
            setLanguage(readLanguage());
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-language'],
        });

        return () => observer.disconnect();
    }, []);

    return language;
};

