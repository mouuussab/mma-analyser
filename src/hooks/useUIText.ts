// Hook to get UI text translations throughout the app
import { useEffect, useState } from 'react';

type AppLanguage = "en" | "fr";

export const useUIText = () => {
    const [language, setLanguage] = useState<AppLanguage>("en");

    useEffect(() => {
        const lang = document.body.getAttribute('data-language') as AppLanguage;
        if (lang) setLanguage(lang);

        const handleLanguageChange = () => {
            const newLang = document.body.getAttribute('data-language') as AppLanguage;
            if (newLang) setLanguage(newLang);
        };

        const observer = new MutationObserver(handleLanguageChange);
        observer.observe(document.body, { attributes: true, attributeFilter: ['data-language'] });

        return () => observer.disconnect();
    }, []);

    const translations = {
        en: {
            generateChartFromDescription: "Generate chart from description",
            stopGeneration: "Stop generation",
            showFewerConcepts: "Show fewer concepts",
            showAllConcepts: "Show all concepts",
            selectModel: "Select a model",
            removeTable: "Remove table",
            pasteData: "Paste Data",
            uploadFile: "Upload File",
            fromURL: "From URL",
            pasteDataPlaceholder: "Paste your data here (CSV, TSV, or JSON format)",
            loadURLPlaceholder: "Load a CSV, TSV, or JSON file from a URL, e.g. https://example.com/data.json",
            deleteReport: "Delete report",
            createChartifact: "Create Chartifact report",
            shareReport: "Share report as image",
            downloadCSV: "Download as CSV",
            regenerateIdeas: "Regenerate ideas",
            clearIdeas: "Clear ideas",
            replyToAgent: "Reply to agent's question...",
            askAgentExplore: "Ask agent to explore a new direction",
            addMoreData: "Add more data to the workspace",
            getIdeaSuggestions: "Get idea suggestions",
            endConversation: "End conversation",
            explore: "Explore",
            send: "Send",
            likeIt: "I like it!",
            notAnymore: "Not anymore",
            resetExtraction: "Reset extraction",
            attachmentPlaceholder: "Attach additional contexts or guidance so that AI agents can better understand and process the data.",
            agentMessage: "Agent",
            dataView: "Data View",
            visualization: "Visualization",
            chartBuilder: "Chart Builder",
            ideaGeneration: "Idea Generation",
            dataTransformation: "Data Transformation",
            noData: "No data available",
            loading: "Loading...",
            error: "Error",
            success: "Success",
            refreshIdeas: "Refresh ideas",
            getIdeas: "Get ideas",
        },
        fr: {
            generateChartFromDescription: "Generer un graphique a partir de la description",
            stopGeneration: "Arreter la generation",
            showFewerConcepts: "Afficher moins de concepts",
            showAllConcepts: "Afficher tous les concepts",
            selectModel: "Selectionner un modele",
            removeTable: "Supprimer la table",
            pasteData: "Coller les donnees",
            uploadFile: "Telecharger un fichier",
            fromURL: "Depuis une URL",
            pasteDataPlaceholder: "Collez vos donnees ici (format CSV, TSV ou JSON)",
            loadURLPlaceholder: "Chargez un fichier CSV, TSV ou JSON depuis une URL, par ex. https://example.com/data.json",
            deleteReport: "Supprimer le rapport",
            createChartifact: "Creer un rapport Chartifact",
            shareReport: "Partager le rapport en tant qu'image",
            downloadCSV: "Telecharger en CSV",
            regenerateIdeas: "Regenerer les idees",
            clearIdeas: "Effacer les idees",
            replyToAgent: "Repondre a la question de l'agent...",
            askAgentExplore: "Demander a l'agent d'explorer une nouvelle direction",
            addMoreData: "Ajouter plus de donnees a l'espace de travail",
            getIdeaSuggestions: "Obtenir des suggestions d'idees",
            endConversation: "Terminer la conversation",
            explore: "Explorer",
            send: "Envoyer",
            likeIt: "J'aime bien!",
            notAnymore: "Plus maintenant",
            resetExtraction: "Reinitialiser l'extraction",
            attachmentPlaceholder: "Joignez des contextes ou des conseils supplementaires pour que les agents IA comprennent et traitent mieux les donnees.",
            agentMessage: "Agent",
            dataView: "Vue des donnees",
            visualization: "Visualisation",
            chartBuilder: "Constructeur de graphiques",
            ideaGeneration: "Generation d'idees",
            dataTransformation: "Transformation des donnees",
            noData: "Aucune donnee disponible",
            loading: "Chargement...",
            error: "Erreur",
            success: "Succes",
            refreshIdeas: "Actualiser les idees",
            getIdeas: "Obtenir des idees",
        }
    };

    return translations[language];
};
