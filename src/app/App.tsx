// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { FC, useCallback, useEffect, useState } from 'react';
import '../scss/App.scss';

import { useDispatch, useSelector } from "react-redux";
import {
    DataFormulatorState,
    dfActions,
    dfSelectors,
    fetchAvailableModels,
} from './dfSlice'
import { getBrowserId } from './identity';

import { red, purple, blue, brown, yellow, orange, } from '@mui/material/colors';
import { palettes, defaultPaletteKey, paletteKeys, bgAlpha } from './tokens';

import _ from 'lodash';

import {
    Button,
    Tooltip,
    Typography,
    CssBaseline,
    Box,
    Toolbar,
    Divider,
    DialogTitle,
    Dialog,
    DialogContent,
    Link,
    DialogContentText,
    DialogActions,
    ToggleButtonGroup,
    ToggleButton,
    Menu,
    MenuItem,
    TextField,
    IconButton,
    Select,
    FormControl,
    InputLabel,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    LinearProgress,
} from '@mui/material';


import MuiAppBar from '@mui/material/AppBar';
import { alpha, createTheme, styled, ThemeProvider } from '@mui/material/styles';

import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ClearIcon from '@mui/icons-material/Clear';

import { DataFormulatorFC } from '../views/DataFormulator';

import SettingsIcon from '@mui/icons-material/Settings';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { MessageSnackbar } from '../views/MessageSnackbar';
import { ChartRenderService } from '../views/ChartRenderService';
import { DictTable } from '../components/ComponentType';
import { AppDispatch } from './store';
import { ModelSelectionButton } from '../views/ModelSelectionDialog';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getUrls, fetchWithIdentity } from './utils';
import { persistor } from './store';
import { UnifiedDataUploadDialog } from '../views/UnifiedDataUploadDialog';
import ChatIcon from '@mui/icons-material/Chat';
import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import TranslateIcon from '@mui/icons-material/Translate';
import { useAppLanguage } from '../hooks/useAppLanguage';

const AppBar = styled(MuiAppBar)(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.background.paper, 0.75),
    backdropFilter: "blur(6px)",
    //borderBottom: "1px solid #C3C3C3",
    boxShadow: "none",
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
}));

declare module '@mui/material/styles' {
    interface PaletteColor {
        bgcolor?: string;
        textColor?: string;
    }
    interface SimplePaletteColorOptions {
        bgcolor?: string;
        textColor?: string;
    }
    interface Palette {
        derived: Palette['primary'];
        custom: Palette['primary'];
    }
    interface PaletteOptions {
        derived: PaletteOptions['primary'];
        custom: PaletteOptions['primary'];
    }
}

export const toolName = "RIVUS"
type AppLanguage = "en" | "fr";

const appText: Record<AppLanguage, {
    app: string;
    data: string;
    session: string;
    theme: string;
    language: string;
    explore: string;
    reports: string;
    saveSession: string;
    sessionName: string;
    tablesWillBeSaved: (count: number) => string;
    cancel: string;
    save: string;
    saving: string;
    loadSession: string;
    loadingSessions: string;
    noSavedSessions: string;
    delete: string;
    close: string;
    refreshSessions: string;
    saveSessionMenu: string;
    openSessionMenu: string;
    quickResume: string;
    exporting: string;
    exportToFile: string;
    importFromFile: string;
    installLocallyFeature: string;
    rivusResearch: string;
    settings: string;
    colorTheme: string;
    frontend: string;
    backend: string;
    resetToDefault: string;
    apply: string;
    exit: string;
    exitSessionTitle: string;
    exitSession: string;
    exitWarning: string;
    cleaningWorkspace: string;
    defaultChartWidth: string;
    defaultChartHeight: string;
    localOnlyRowLimit: string;
    maxChartStretchFactor: string;
    formulateTimeoutSeconds: string;
    valueMustBe100To1000Pixels: string;
    valueMustBe100To1000000Rows: string;
    valueMustBe1To5: string;
    valueMustBe1To3600Seconds: string;
    localOnlyRowLimitHint: string;
    maxStretchFactorHint: string;
    formulateTimeoutHint: string;
}> = {
    en: {
        app: "App",
        data: "Data",
        session: "Session",
        theme: "Theme",
        language: "Language",
        explore: "Explore",
        reports: "Reports",
        saveSession: "Save Session",
        sessionName: "Session name",
        tablesWillBeSaved: (count: number) => `${count} table(s) will be saved`,
        cancel: "Cancel",
        save: "Save",
        saving: "Saving...",
        loadSession: "Load Session",
        loadingSessions: "Loading sessions...",
        noSavedSessions: "No saved sessions found.",
        delete: "Delete",
        close: "Close",
        refreshSessions: "Refresh session list",
        saveSessionMenu: "Save session",
        openSessionMenu: "Open session...",
        quickResume: "Quick resume",
        exporting: "Exporting...",
        exportToFile: "Export to file",
        importFromFile: "Import from file",
        installLocallyFeature: "Install locally to use this feature",
        rivusResearch: "RIVUS Research",
        settings: "Settings",
        colorTheme: "Color Theme",
        frontend: "Frontend",
        backend: "Backend",
        resetToDefault: "Reset to default",
        apply: "Apply",
        exit: "Exit",
        exitSessionTitle: "Exit Session?",
        exitSession: "Exit session",
        exitWarning: "All unsaved content (data, charts, reports) will be lost. Make sure to save your session before exiting.",
        cleaningWorkspace: "Cleaning workspace...",
        defaultChartWidth: "default chart width",
        defaultChartHeight: "default chart height",
        localOnlyRowLimit: "local-only row limit",
        maxChartStretchFactor: "max chart stretch factor",
        formulateTimeoutSeconds: "formulate timeout (seconds)",
        valueMustBe100To1000Pixels: "Value must be between 100 and 1000 pixels",
        valueMustBe100To1000000Rows: "Value must be between 100 and 1,000,000 rows",
        valueMustBe1To5: "Value must be between 1.0 and 5.0",
        valueMustBe1To3600Seconds: "Value must be between 1 and 3600 seconds",
        localOnlyRowLimitHint: "Maximum number of rows kept when loading data locally (not stored on server).",
        maxStretchFactorHint: "How much charts can grow beyond the base size (1.0 = no stretch, 2.0 = up to 2x).",
        formulateTimeoutHint: "Maximum time allowed for the formulation process before timing out.",
        // UI Component Translations
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
    },
    fr: {
        app: "Application",
        data: "Donnees",
        session: "Session",
        theme: "Theme",
        language: "Langue",
        explore: "Explorer",
        reports: "Rapports",
        saveSession: "Enregistrer la session",
        sessionName: "Nom de session",
        tablesWillBeSaved: (count: number) => `${count} table(s) seront enregistrees`,
        cancel: "Annuler",
        save: "Enregistrer",
        saving: "Enregistrement...",
        loadSession: "Charger la session",
        loadingSessions: "Chargement des sessions...",
        noSavedSessions: "Aucune session enregistree.",
        delete: "Supprimer",
        close: "Fermer",
        refreshSessions: "Rafraichir la liste des sessions",
        saveSessionMenu: "Enregistrer la session",
        openSessionMenu: "Ouvrir une session...",
        quickResume: "Reprise rapide",
        exporting: "Export en cours...",
        exportToFile: "Exporter vers un fichier",
        importFromFile: "Importer depuis un fichier",
        installLocallyFeature: "Installez localement pour utiliser cette fonctionnalite",
        rivusResearch: "RIVUS Research",
        settings: "Parametres",
        colorTheme: "Theme de couleur",
        frontend: "Interface",
        backend: "Backend",
        resetToDefault: "Reinitialiser",
        apply: "Appliquer",
        exit: "Quitter",
        exitSessionTitle: "Quitter la session ?",
        exitSession: "Quitter la session",
        exitWarning: "Tout contenu non enregistre (donnees, graphiques, rapports) sera perdu. Pensez a enregistrer votre session avant de quitter.",
        cleaningWorkspace: "Nettoyage de l'espace de travail...",
        defaultChartWidth: "largeur de graphique par defaut",
        defaultChartHeight: "hauteur de graphique par defaut",
        localOnlyRowLimit: "limite de lignes locale uniquement",
        maxChartStretchFactor: "facteur d'etirement maximal du graphique",
        formulateTimeoutSeconds: "delai de formulation (secondes)",
        valueMustBe100To1000Pixels: "La valeur doit etre comprise entre 100 et 1000 pixels",
        valueMustBe100To1000000Rows: "La valeur doit etre comprise entre 100 et 1 000 000 lignes",
        valueMustBe1To5: "La valeur doit etre comprise entre 1.0 et 5.0",
        valueMustBe1To3600Seconds: "La valeur doit etre comprise entre 1 et 3600 secondes",
        localOnlyRowLimitHint: "Nombre maximal de lignes conservees lors du chargement local des donnees (non stockees sur le serveur).",
        maxStretchFactorHint: "De combien les graphiques peuvent depasser la taille de base (1.0 = pas d'etirement, 2.0 = jusqu'a 2x).",
        formulateTimeoutHint: "Temps maximal autorise pour le processus de formulation avant expiration.",
        // UI Component Translations
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
    },
};

export interface AppFCProps {
}

// Extract menu components into separate components to prevent full app re-renders
const TableMenu: React.FC<{label: string}> = ({ label }) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    
    return (
        <>
            <Button
                variant="text"
                onClick={() => setDialogOpen(true)}
                sx={{ textTransform: 'none' }}
            >
                {label}
            </Button>
            
            {/* Unified Data Upload Dialog */}
            <UnifiedDataUploadDialog 
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                initialTab="menu"
            />
        </>
    );
};

const SaveSessionDialog: React.FC<{open: boolean, onClose: () => void, text: typeof appText.en}> = ({open, onClose, text}) => {
    const [sessionName, setSessionName] = useState('');
    const [saving, setSaving] = useState(false);
    const dispatch = useDispatch();
    const tables = useSelector((state: DataFormulatorState) => state.tables);

    const fullState = useSelector((state: DataFormulatorState) => {
        const excludedFields = new Set([
            'models', 'selectedModelId', 'testedModels',
            'dataLoaderConnectParams', 'identity', 'agentRules', 'serverConfig',
        ]);
        const stateToSerialize: any = {};
        for (const [key, value] of Object.entries(state)) {
            if (!excludedFields.has(key)) {
                stateToSerialize[key] = value;
            }
        }
        return stateToSerialize;
    });

    const handleSave = async () => {
        if (!sessionName.trim()) return;
        setSaving(true);
        try {
            const res = await fetchWithIdentity(getUrls().SESSION_SAVE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: sessionName.trim(), state: fullState }),
            });
            const data = await res.json();
            if (data.status === 'ok') {
                dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "success", value: `Session "${sessionName}" saved` }));
                onClose();
            } else {
                dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "error", value: data.message || 'Save failed' }));
            }
        } catch (e) {
            dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "error", value: 'Failed to save session' }));
        }
        setSaving(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>{text.saveSession}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus fullWidth margin="dense" label={text.sessionName}
                    value={sessionName} onChange={(e) => setSessionName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                    helperText={text.tablesWillBeSaved(tables.length)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{text.cancel}</Button>
                <Button onClick={handleSave} disabled={!sessionName.trim() || saving}>
                    {saving ? text.saving : text.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const LoadSessionDialog: React.FC<{open: boolean, onClose: () => void, text: typeof appText.en}> = ({open, onClose, text}) => {
    const [sessions, setSessions] = useState<{name: string, saved_at: string}[]>([]);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const dispatch = useDispatch();

    const fetchSessions = useCallback(async () => {
        setListLoading(true);
        try {
            const res = await fetchWithIdentity(getUrls().SESSION_LIST);
            const data = await res.json();
            if (data.status === 'ok') setSessions(data.sessions);
        } catch (e) { /* ignore */ }
        setListLoading(false);
    }, []);

    useEffect(() => {
        if (!open) return;
        fetchSessions();
    }, [open, fetchSessions]);

    const handleLoad = async (name: string) => {
        setLoading(true);
        dispatch(dfActions.setSessionLoading({ loading: true, label: `Loading session "${name}"...` }));
        onClose();
        try {
            const res = await fetchWithIdentity(getUrls().SESSION_LOAD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (data.status === 'ok') {
                dispatch(dfActions.loadState(data.state));
                dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "success", value: `Session "${name}" loaded` }));
            } else {
                dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "error", value: data.message || 'Load failed' }));
            }
        } catch (e) {
            dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "error", value: 'Failed to load session' }));
        }
        setLoading(false);
        dispatch(dfActions.setSessionLoading({ loading: false }));
    };

    const handleDelete = async (name: string) => {
        try {
            const res = await fetchWithIdentity(getUrls().SESSION_DELETE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (data.status === 'ok') {
                setSessions(prev => prev.filter(s => s.name !== name));
                dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "success", value: `Session "${name}" deleted` }));
            }
        } catch (e) { /* ignore */ }
        setConfirmDelete(null);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {text.loadSession}
                <Tooltip title={text.refreshSessions}>
                    <IconButton size="small" onClick={fetchSessions} disabled={listLoading}>
                        {listLoading ? <CircularProgress size={18} /> : <RefreshIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </DialogTitle>
            <DialogContent sx={{ px: 1 }}>
                {listLoading && sessions.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 1.5 }}>
                        <CircularProgress size={28} />
                        <Typography variant="body2" color="text.secondary">{text.loadingSessions}</Typography>
                    </Box>
                ) : sessions.length === 0 ? (
                    <DialogContentText sx={{ px: 1 }}>{text.noSavedSessions}</DialogContentText>
                ) : (
                    sessions.map(s => (
                        <Box
                            key={s.name}
                            sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                px: 1.5, py: 1, mx: 0, my: 0.5, borderRadius: 1, cursor: 'pointer',
                                '&:hover': { backgroundColor: 'action.hover' },
                                transition: 'background-color 0.15s',
                            }}
                            onClick={() => handleLoad(s.name)}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" fontWeight="bold" noWrap>{s.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(s.saved_at).toLocaleString()}
                                </Typography>
                            </Box>
                            {confirmDelete === s.name ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} onClick={e => e.stopPropagation()}>
                                    <Button size="small" color="error" sx={{ minWidth: 0, fontSize: 11, textTransform: 'none' }}
                                        onClick={() => handleDelete(s.name)}>{text.delete.toLowerCase()}</Button>
                                    <Button size="small" sx={{ minWidth: 0, fontSize: 11, textTransform: 'none' }}
                                        onClick={() => setConfirmDelete(null)}>{text.cancel.toLowerCase()}</Button>
                                </Box>
                            ) : (
                                <Tooltip title={text.delete}>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmDelete(s.name); }}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    ))
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{text.close}</Button>
            </DialogActions>
        </Dialog>
    );
};

const SessionMenu: React.FC<{label: string, text: typeof appText.en}> = ({ label, text }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [loadDialogOpen, setLoadDialogOpen] = useState(false);
    const [recentSessions, setRecentSessions] = useState<{name: string, saved_at: string}[]>([]);
    const [exporting, setExporting] = useState(false);
    const importRef = React.useRef<HTMLInputElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch();
    const serverConfig = useSelector((state: DataFormulatorState) => state.serverConfig);
    const diskPersistenceDisabled = serverConfig.DISABLE_DATABASE;

    const fullState = useSelector((state: DataFormulatorState) => {
        const excludedFields = new Set([
            'models', 'selectedModelId', 'testedModels',
            'dataLoaderConnectParams', 'identity', 'agentRules', 'serverConfig',
        ]);
        const obj: any = {};
        for (const [key, value] of Object.entries(state)) {
            if (!excludedFields.has(key)) obj[key] = value;
        }
        return obj;
    });

    // Fetch recent sessions when the menu opens
    useEffect(() => {
        if (!open || diskPersistenceDisabled) return;
        (async () => {
            try {
                const res = await fetchWithIdentity(getUrls().SESSION_LIST);
                const data = await res.json();
                if (data.status === 'ok') setRecentSessions(data.sessions.slice(0, 3));
            } catch (e) { /* ignore */ }
        })();
    }, [open]);

    const closeMenu = () => setAnchorEl(null);

    const handleLoadSession = async (name: string) => {
        closeMenu();
        dispatch(dfActions.setSessionLoading({ loading: true, label: `Loading session "${name}"...` }));
        try {
            const res = await fetchWithIdentity(getUrls().SESSION_LOAD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (data.status === 'ok') {
                dispatch(dfActions.loadState(data.state));
                dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "success", value: `Session "${name}" loaded` }));
            } else {
                dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "error", value: data.message || 'Load failed' }));
            }
        } catch (e) {
            dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "error", value: 'Failed to load session' }));
        }
        dispatch(dfActions.setSessionLoading({ loading: false }));
    };

    const handleExport = async () => {
        closeMenu();
        setExporting(true);
        try {
            const res = await fetchWithIdentity(getUrls().SESSION_EXPORT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: fullState }),
            });
            if (!res.ok) throw new Error('Export failed');
            const blob = await res.blob();
            const disposition = res.headers.get('content-disposition');
            const match = disposition?.match(/filename="?(.+?)"?$/);
            const filename = match?.[1] || 'session.dfsession';
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
            dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "success", value: "Session exported" }));
        } catch (e) {
            dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "error", value: 'Failed to export session' }));
        }
        setExporting(false);
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        closeMenu();
        dispatch(dfActions.setSessionLoading({ loading: true, label: `Importing session from ${file.name}...` }));
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetchWithIdentity(getUrls().SESSION_IMPORT, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.status === 'ok') {
                dispatch(dfActions.loadState(data.state));
                dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "success", value: `Session imported from ${file.name}` }));
            } else {
                dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "error", value: data.message || 'Import failed' }));
            }
        } catch (e) {
            dispatch(dfActions.addMessages({ timestamp: Date.now(), component: "Session", type: "error", value: 'Failed to import session' }));
        }
        dispatch(dfActions.setSessionLoading({ loading: false }));
        if (importRef.current) importRef.current.value = '';
    };

    return (
        <>
            <Button 
                variant="text" 
                onClick={(e) => setAnchorEl(e.currentTarget)} 
                endIcon={<KeyboardArrowDownIcon />} 
                sx={{ textTransform: 'none' }}
            >
                {label}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                slotProps={{ paper: { sx: { minWidth: 200 } } }}
            >
                <Tooltip title={diskPersistenceDisabled ? text.installLocallyFeature : ""} placement="right">
                    <span>
                        <MenuItem disabled={diskPersistenceDisabled} onClick={() => { setSaveDialogOpen(true); closeMenu(); }}
                            sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SaveIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> {text.saveSessionMenu}
                        </MenuItem>
                    </span>
                </Tooltip>
                <Tooltip title={diskPersistenceDisabled ? text.installLocallyFeature : ""} placement="right">
                    <span>
                        <MenuItem disabled={diskPersistenceDisabled} onClick={() => { setLoadDialogOpen(true); closeMenu(); }}
                            sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FolderOpenIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> {text.openSessionMenu}
                        </MenuItem>
                    </span>
                </Tooltip>

                {!diskPersistenceDisabled && recentSessions.length > 0 && [
                    <Divider key="div-recent" />,
                    <Typography key="label-recent" variant="caption" sx={{ px: 2, py: 0.5, color: 'text.secondary', display: 'block', fontSize: 10 }}>
                        {text.quickResume}
                    </Typography>,
                    ...recentSessions.map(s => (
                        <MenuItem key={s.name} onClick={() => handleLoadSession(s.name)}
                            sx={{ pl: 4, py: 0.25, minHeight: 0, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                            <Typography noWrap sx={{ fontSize: 12 }}>{s.name}</Typography>
                            <Typography noWrap sx={{ fontSize: 10, color: 'text.secondary', flexShrink: 0 }}>
                                {new Date(s.saved_at).toLocaleDateString()}
                            </Typography>
                        </MenuItem>
                    )),
                ]}

                <Divider />
                <MenuItem onClick={handleExport} disabled={exporting}
                    sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DownloadIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> {exporting ? text.exporting : text.exportToFile}
                </MenuItem>
                <MenuItem onClick={() => importRef.current?.click()}
                    sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <UploadFileIcon sx={{ fontSize: 16, color: 'text.secondary' }} /> {text.importFromFile}
                    <input
                        type="file"
                        hidden
                        accept=".dfsession,.zip"
                        ref={importRef}
                        onChange={handleImport}
                    />
                </MenuItem>
            </Menu>
            <SaveSessionDialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} text={text} />
            <LoadSessionDialog open={loadDialogOpen} onClose={() => setLoadDialogOpen(false)} text={text} />
        </>
    );
};

const ResetDialog: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [exiting, setExiting] = useState(false);
    const dispatch = useDispatch();
    const appLanguage = useAppLanguage();
    const text = appText[appLanguage];

    const handleExit = async () => {
        setExiting(true);
        // Clear workspace on server first
        try {
            await fetchWithIdentity(getUrls().RESET_DB_FILE, { method: 'POST' });
        } catch (e) {
            console.warn('Failed to reset server workspace:', e);
        }
        dispatch(dfActions.resetState());

        // Flush the reset state to IndexedDB so the persisted
        // state matches (preserves models, config, agentRules).
        await persistor.flush();
        window.location.reload();
    };

    return (
        <>
            <Button 
                variant="text" 
                sx={{textTransform: 'none'}}
                onClick={() => setOpen(true)} 
                endIcon={<PowerSettingsNewIcon />}
            >
                {text.exit}
            </Button>
            <Dialog onClose={exiting ? undefined : () => setOpen(false)} open={open} 
                sx={{ '& .MuiDialog-paper': { position: 'relative', overflow: 'hidden' } }}>
                <DialogTitle sx={{ display: "flex", alignItems: "center" }}>{text.exitSessionTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {text.exitWarning}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        disabled={exiting}
                        onClick={handleExit}
                        endIcon={<PowerSettingsNewIcon />}
                    >
                        {text.exitSession}
                    </Button>
                    <Button onClick={() => setOpen(false)} disabled={exiting}>{text.cancel}</Button>
                </DialogActions>
                {/* Cleaning overlay on top of dialog */}
                {exiting && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        zIndex: 1,
                        borderRadius: 'inherit',
                    }}>
                        <Typography sx={{
                            fontSize: 36,
                            animation: 'sweepBroom 1.2s ease-in-out infinite',
                            '@keyframes sweepBroom': {
                                '0%, 100%': {
                                    transform: 'rotate(-15deg) translateX(0px)',
                                },
                                '25%': {
                                    transform: 'rotate(-5deg) translateX(8px)',
                                },
                                '50%': {
                                    transform: 'rotate(-15deg) translateX(0px)',
                                },
                                '75%': {
                                    transform: 'rotate(-25deg) translateX(-8px)',
                                },
                            },
                            transformOrigin: 'top center',
                        }}>
                            🧹
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {text.cleaningWorkspace}
                        </Typography>
                        <LinearProgress sx={{ width: 200, mt: 1, borderRadius: 1 }} />
                    </Box>
                )}
            </Dialog>
        </>
    );
};

const ConfigDialog: React.FC = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const config = useSelector((state: DataFormulatorState) => state.config);
    const appLanguage = useAppLanguage();
    const text = appText[appLanguage];


    const [formulateTimeoutSeconds, setFormulateTimeoutSeconds] = useState(config.formulateTimeoutSeconds ?? 30);

    const [defaultChartWidth, setDefaultChartWidth] = useState(config.defaultChartWidth ?? 300);
    const [defaultChartHeight, setDefaultChartHeight] = useState(config.defaultChartHeight ?? 300);
    const [maxStretchFactor, setMaxStretchFactor] = useState(config.maxStretchFactor ?? 2.0);
    const [frontendRowLimit, setFrontendRowLimit] = useState(config.frontendRowLimit ?? 50000);
    const [paletteKey, setPaletteKey] = useState(
        (config.paletteKey && palettes[config.paletteKey]) ? config.paletteKey : defaultPaletteKey
    );

    // Add check for changes
    const hasChanges = formulateTimeoutSeconds !== config.formulateTimeoutSeconds || 
                      defaultChartWidth !== config.defaultChartWidth ||
                      defaultChartHeight !== config.defaultChartHeight ||
                      maxStretchFactor !== config.maxStretchFactor ||
                      frontendRowLimit !== config.frontendRowLimit ||
                      paletteKey !== ((config.paletteKey && palettes[config.paletteKey]) ? config.paletteKey : defaultPaletteKey);

    return (
        <>
            <Button variant="text" sx={{textTransform: 'none'}} onClick={() => setOpen(true)} startIcon={<SettingsIcon />}>
                {text.settings}
            </Button>
            <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>{text.settings}</DialogTitle>
                <DialogContent>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 3,
                        maxWidth: 400
                    }}>
                        <Divider><Typography variant="caption">{text.frontend}</Typography></Divider>
                        <FormControl fullWidth size="small">
                            <InputLabel id="palette-select-label" sx={{ fontSize: 13 }}>{text.colorTheme}</InputLabel>
                            <Select
                                labelId="palette-select-label"
                                value={paletteKey}
                                label={text.colorTheme}
                                onChange={(e) => setPaletteKey(e.target.value)}
                                sx={{ fontSize: 13 }}
                                renderValue={(key) => {
                                    const p = palettes[key];
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: p.primary.main, flexShrink: 0 }} />
                                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: p.custom.main, flexShrink: 0 }} />
                                            <Typography sx={{ fontSize: 13 }}>{p.name}</Typography>
                                        </Box>
                                    );
                                }}
                            >
                                {paletteKeys.map(key => {
                                    const p = palettes[key];
                                    return (
                                        <MenuItem key={key} value={key} sx={{ py: 0.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1.5 }}>
                                                <Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: p.primary.main, border: '1px solid rgba(0,0,0,0.1)' }} />
                                                <Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: p.custom.main, border: '1px solid rgba(0,0,0,0.1)' }} />
                                            </Box>
                                            <ListItemText primary={p.name} slotProps={{ primary: { sx: { fontSize: 13 } } }} />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    label={text.defaultChartWidth}
                                    type="number"
                                    variant="outlined"
                                    value={defaultChartWidth}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setDefaultChartWidth(value);
                                    }}
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            inputProps: {
                                                min: 100,
                                                max: 1000
                                            }
                                        }
                                    }}
                                    error={defaultChartWidth < 100 || defaultChartWidth > 1000}
                                    helperText={defaultChartWidth < 100 || defaultChartWidth > 1000 ? 
                                        text.valueMustBe100To1000Pixels : ""}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                <ClearIcon fontSize="small" />
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    label={text.defaultChartHeight}
                                    type="number"
                                    variant="outlined"
                                    value={defaultChartHeight}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setDefaultChartHeight(value);
                                    }}
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            inputProps: {
                                                min: 100,
                                                max: 1000
                                            }
                                        }
                                    }}
                                    error={defaultChartHeight < 100 || defaultChartHeight > 1000}
                                    helperText={defaultChartHeight < 100 || defaultChartHeight > 1000 ? 
                                        text.valueMustBe100To1000Pixels : ""}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    label={text.localOnlyRowLimit}
                                    type="number"
                                    variant="outlined"
                                    value={frontendRowLimit}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setFrontendRowLimit(value);
                                    }}
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            inputProps: {
                                                min: 100,
                                                max: 1000000
                                            }
                                        }
                                    }}
                                    error={frontendRowLimit < 100 || frontendRowLimit > 1000000}
                                    helperText={frontendRowLimit < 100 || frontendRowLimit > 1000000 ? 
                                        text.valueMustBe100To1000000Rows : ""}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    {text.localOnlyRowLimitHint}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    label={text.maxChartStretchFactor}
                                    type="number"
                                    variant="outlined"
                                    value={maxStretchFactor}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        setMaxStretchFactor(value);
                                    }}
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            inputProps: {
                                                min: 1,
                                                max: 5,
                                                step: 0.1
                                            }
                                        }
                                    }}
                                    error={isNaN(maxStretchFactor) || maxStretchFactor < 1 || maxStretchFactor > 5}
                                    helperText={isNaN(maxStretchFactor) || maxStretchFactor < 1 || maxStretchFactor > 5 ? 
                                        text.valueMustBe1To5 : ""}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    {text.maxStretchFactorHint}
                                </Typography>
                            </Box>
                        </Box>
                        <Divider><Typography variant="caption">{text.backend}</Typography></Divider>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    label={text.formulateTimeoutSeconds}
                                    type="number"
                                    variant="outlined"
                                    value={formulateTimeoutSeconds}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setFormulateTimeoutSeconds(value);
                                    }}
                                    inputProps={{
                                        min: 0,
                                        max: 3600,
                                    }}
                                    error={formulateTimeoutSeconds <= 0 || formulateTimeoutSeconds > 3600}
                                    helperText={formulateTimeoutSeconds <= 0 || formulateTimeoutSeconds > 3600 ? 
                                        text.valueMustBe1To3600Seconds : ""}
                                    fullWidth
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    {text.formulateTimeoutHint}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{'.MuiButton-root': {textTransform: 'none'}}}>
                    <Button sx={{marginRight: 'auto'}} onClick={() => {
                        setFormulateTimeoutSeconds(30);
                        setDefaultChartWidth(300);
                        setDefaultChartHeight(300);
                        setMaxStretchFactor(2.0);
                        setFrontendRowLimit(50000);
                        setPaletteKey(defaultPaletteKey);
                    }}>{text.resetToDefault}</Button>
                    <Button onClick={() => setOpen(false)}>{text.cancel}</Button>
                    <Button 
                        variant={hasChanges ? "contained" : "text"}
                        disabled={!hasChanges || isNaN(formulateTimeoutSeconds) || formulateTimeoutSeconds <= 0 || formulateTimeoutSeconds > 3600
                            || isNaN(defaultChartWidth) || defaultChartWidth <= 0 || defaultChartWidth > 1000
                            || isNaN(defaultChartHeight) || defaultChartHeight <= 0 || defaultChartHeight > 1000
                            || isNaN(maxStretchFactor) || maxStretchFactor < 1 || maxStretchFactor > 5
                            || isNaN(frontendRowLimit) || frontendRowLimit < 100 || frontendRowLimit > 1000000}
                        onClick={() => {
                            dispatch(dfActions.setConfig({formulateTimeoutSeconds, defaultChartWidth, defaultChartHeight, maxStretchFactor, frontendRowLimit, paletteKey}));
                            setOpen(false);
                        }}
                    >
                        {text.apply}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );  
}

export const AppFC: FC<AppFCProps> = function AppFC(appProps) {

    const dispatch = useDispatch<AppDispatch>();
    const viewMode = useSelector((state: DataFormulatorState) => state.viewMode);
    const tables = useSelector((state: DataFormulatorState) => state.tables);
    const generatedReports = useSelector((state: DataFormulatorState) => state.generatedReports);
    const focusedId = useSelector((state: DataFormulatorState) => state.focusedId);
    const serverConfig = useSelector((state: DataFormulatorState) => state.serverConfig);
    const rawPaletteKey = useSelector((state: DataFormulatorState) => state.config.paletteKey);
    const activePaletteKey = (rawPaletteKey && palettes[rawPaletteKey]) ? rawPaletteKey : defaultPaletteKey;
    const [themeMode, setThemeMode] = useState<"light" | "dark">(() => (
        (localStorage.getItem("rivus-theme-mode") as "light" | "dark" | null) ?? "light"
    ));
    const [language, setLanguage] = useState<AppLanguage>(() => (
        (localStorage.getItem("rivus-language") as AppLanguage | null) ?? "en"
    ));
    const text = appText[language];

    useEffect(() => {
        fetchWithIdentity(getUrls().APP_CONFIG)
            .then(response => response.json())
            .then(data => {
                dispatch(dfActions.setServerConfig(data));
            });
    }, []);

    // User authentication state
    const [userInfo, setUserInfo] = useState<{ name: string, userId: string } | undefined>(undefined);
    const [authChecked, setAuthChecked] = useState(false);

    // Check for authenticated user first
    useEffect(() => {
        fetch('/.auth/me')
            .then(function (response) { return response.json(); })
            .then(function (result) {
                if (Array.isArray(result) && result.length > 0) {
                    let authInfo = result[0];
                    let userInfo = {
                        name: authInfo['user_claims'].find((item: any) => item.typ == 'name')?.val || '',
                        userId: authInfo['user_id']
                    }
                    setUserInfo(userInfo);
                }
            }).catch(err => {
                // User is not logged in, will use browser identity
            }).finally(() => {
                setAuthChecked(true);
            });
    }, []);

    // Initialize identity after auth check completes
    // No server round-trip needed - identity is determined client-side:
    // Priority: user identity (if logged in) > browser identity (localStorage-based, shared across tabs)
    useEffect(() => {
        if (authChecked) {
            if (userInfo?.userId) {
                // User is logged in - use their user ID
                dispatch(dfActions.setIdentity({ type: 'user', id: userInfo.userId }));
            } else {
                // Not logged in - use browser ID (from localStorage, shared across tabs)
                dispatch(dfActions.setIdentity({ type: 'browser', id: getBrowserId() }));
            }
        }
    }, [authChecked, userInfo?.userId]);

    useEffect(() => {
        document.title = toolName;
        dispatch(fetchAvailableModels());
    }, []);

    useEffect(() => {
        localStorage.setItem("rivus-theme-mode", themeMode);
        document.body.setAttribute("data-theme-mode", themeMode);
    }, [themeMode]);

    useEffect(() => {
        localStorage.setItem("rivus-language", language);
        document.body.setAttribute("data-language", language);
    }, [language]);

    let theme = createTheme({
        typography: {
            fontFamily: [
                "Arial",
                "Roboto",
                "Helvetica Neue",
                "sans-serif"
            ].join(",")
        },
        // Default Material UI palette
        // Active palette from user config — selectable via Settings dialog
        // Available: material, fluent, vivid, jewel, electric, tealCoral, copilot
        palette: (() => {
            const p = palettes[activePaletteKey];
            const bg = (entry: { main: string; bgcolor?: string }) => entry.bgcolor ?? alpha(entry.main, bgAlpha);
            const tc = (entry: { main: string; textColor?: string }) => entry.textColor ?? entry.main;
            return {
                mode: themeMode,
                primary:   { main: p.primary.main,   bgcolor: bg(p.primary),   textColor: tc(p.primary)   },
                secondary: { main: p.secondary.main, bgcolor: bg(p.secondary), textColor: tc(p.secondary) },
                derived:   { main: p.derived.main,   bgcolor: bg(p.derived),   textColor: tc(p.derived)   },
                custom:    { main: p.custom.main,    bgcolor: bg(p.custom),    textColor: tc(p.custom)    },
                warning:   { main: p.warning.main },
                background: themeMode === "dark"
                    ? { default: "#0f172a", paper: "#111827" }
                    : { default: "#f8fafc", paper: "#ffffff" },
            };
        })(),
        components: {
            MuiButton: {
                styleOverrides: {
                    text: ({ ownerState, theme: t }) => {
                        const c = ownerState.color;
                        if (c && c !== 'inherit' && c !== 'error' && c !== 'info' && c !== 'success' && c in t.palette) {
                            const p = (t.palette as any)[c];
                            if (p?.textColor) return { color: p.textColor };
                        }
                        return {};
                    },
                    outlined: ({ ownerState, theme: t }) => {
                        const c = ownerState.color;
                        if (c && c !== 'inherit' && c !== 'error' && c !== 'info' && c !== 'success' && c in t.palette) {
                            const p = (t.palette as any)[c];
                            if (p?.textColor) return { color: p.textColor, borderColor: alpha(p.textColor, 0.5) };
                        }
                        return {};
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: ({ ownerState, theme: t }) => {
                        const c = ownerState.color;
                        if (c && c !== 'inherit' && c !== 'default' && c !== 'error' && c !== 'info' && c !== 'success' && c in t.palette) {
                            const p = (t.palette as any)[c];
                            if (p?.textColor) return { color: p.textColor };
                        }
                        return {};
                    },
                },
            },
            MuiLink: {
                styleOverrides: {
                    root: ({ ownerState, theme: t }) => {
                        const c = ownerState.color as string | undefined;
                        if (c && c !== 'inherit' && c in t.palette) {
                            const p = (t.palette as any)[c];
                            if (p?.textColor) return { color: p.textColor };
                        }
                        return {};
                    },
                },
            },
        },
    });

    // Single-page app shell
    const isAppPage = true;

    let appBar =  [
        <AppBar position="static" key="app-bar-main" >
            <Toolbar variant="dense" sx={{height: 40, minHeight: 36, position: 'relative'}}>
                <Button sx={{
                    display: "flex", flexDirection: "row", textTransform: "none",
                    alignItems: 'stretch',
                    backgroundColor: 'transparent',
                    "&:hover": {
                        backgroundColor: "transparent"
                    }
                }} color="inherit">
                    <Typography noWrap component="h1" sx={{ fontWeight: 300, display: { xs: 'none', sm: 'block' }, letterSpacing: '0.03em' }}>
                        {toolName}
                    </Typography>
                </Button>
                <Box
                    sx={{ 
                        ml: 2,
                        height: '28px', 
                        my: 'auto',
                        display: 'flex',
                    }}
                >
                    <Button 
                        component="a" 
                        href="/"
                        sx={{ 
                            textDecoration: 'none',
                            textTransform: 'none',
                            fontSize: '13px',
                            fontWeight: 400,
                            border: 'none',
                            borderRadius: 0,
                            px: 1.5,
                            py: 0.5,
                            minWidth: 'auto',
                            color: 'text.primary',
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            '&:hover': {
                                color: 'text.primary',
                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            },
                        }}
                    >
                        {text.app}
                    </Button>
                </Box>
                {tables.length === 0 && (
                    <Typography noWrap sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 500, fontSize: '0.65rem', color: 'text.disabled', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        {text.rivusResearch}
                    </Typography>
                )}
                {isAppPage && (
                    <Box sx={{ display: 'flex', ml: 'auto', fontSize: 14 }}>
                        <Tooltip title={text.language}>
                            <IconButton
                                onClick={() => setLanguage(prev => (prev === "en" ? "fr" : "en"))}
                                sx={{ mr: 0.5 }}
                            >
                                <TranslateIcon fontSize="small" />
                                <Typography sx={{ fontSize: 11, ml: 0.5, textTransform: 'uppercase' }}>
                                    {language}
                                </Typography>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={text.theme}>
                            <IconButton
                                onClick={() => setThemeMode(prev => (prev === "light" ? "dark" : "light"))}
                                sx={{ mr: 0.5 }}
                            >
                                {themeMode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                        {focusedId !== undefined && <React.Fragment><ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_, newMode) => {
                                if (newMode !== null) {
                                    dispatch(dfActions.setViewMode(newMode));
                                }
                            }}
                            sx={{ 
                                mr: 2,
                                height: '28px', 
                                my: 'auto',
                                '& .MuiToggleButton-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    border: 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        color: 'text.primary',
                                    },
                                },
                            }}
                        >
                            <ToggleButton value="editor">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box component="span">{text.explore}</Box>
                                </Box>
                            </ToggleButton>
                            <ToggleButton value="report">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box component="span">
                                        {generatedReports.length > 0 ? `${text.reports} (${generatedReports.length})` : text.reports}
                                    </Box>
                                </Box>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <ConfigDialog />
                        <Divider orientation="vertical" variant="middle" flexItem /></React.Fragment>}
                        <ModelSelectionButton />
                        <Divider orientation="vertical" variant="middle" flexItem />
                        
                        <Typography fontSize="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TableMenu label={text.data} />
                        </Typography>
                        <Typography fontSize="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SessionMenu label={text.session} text={text} />
                        </Typography>
                        {tables.length > 0 && <ResetDialog />}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    ];

    let router = createBrowserRouter([
        {
            path: "/",
            element: <DataFormulatorFC language={language} />,
        }, {
            path: "*",
            element: <DataFormulatorFC language={language} />,
            errorElement: <Box sx={{ width: "100%", height: "100%", display: "flex" }}>
                <Typography color="gray" sx={{ margin: "150px auto" }}>An error has occurred, please <Link href="/">refresh the session</Link>. If the problem still exists, click close session.</Typography>
            </Box>
        }
    ]);

    let app =
        <Box sx={{ 
            position: 'absolute',
            backgroundColor: alpha(theme.palette.background.default, 0.85),
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'auto',
            '& > *': {
                minWidth: '1000px',
                minHeight: '600px'
            },
        }}>
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                overflow: 'hidden'
            }}>
                {appBar}
                <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', '& > div': { height: '100%' } }}>
                    <RouterProvider router={router} />
                </Box>
                <MessageSnackbar />
                <ChartRenderService />
            </Box>
        </Box>;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {app}
        </ThemeProvider>
    );
}

function stringAvatar(name: string) {
    let displayName = ""
    try {
        let nameSplit = name.split(' ')
        displayName = `${nameSplit[0][0]}${nameSplit.length > 1 ? nameSplit[nameSplit.length - 1][0] : ''}`
    } catch {
        displayName = name ? name[0] : "?";
    }
    return {
        sx: {
            bgcolor: "cornflowerblue",
            width: 36,
            height: 36,
            margin: "auto",
            fontSize: "1rem"
        },
        children: displayName,
    };
}
