// Function to load JSON data
async function loadJSON(url) {
    console.log('Attempting to load JSON from:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Successfully loaded ${url}, data length:`, data.length);
        return data;
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        return [];
    }
}

// Goalies Grid Configuration
const goaliesColumnDefs = [
    { field: 'GOALKEEPER', headerName: 'Goalkeeper', sortable: true, filter: true },
    { field: 'G', headerName: 'Games', sortable: true, filter: true },
    { field: 'GS', headerName: 'Games Started', sortable: true, filter: true },
    { field: 'W', headerName: 'Wins', sortable: true, filter: true },
    { field: 'L', headerName: 'Losses', sortable: true, filter: true },
    { field: 'OT', headerName: 'OT', sortable: true, filter: true },
    { field: 'GAA', headerName: 'GAA', sortable: true, filter: true },
    { field: 'SV%', headerName: 'SV%', sortable: true, filter: true },
    { field: 'SHO', headerName: 'Shutouts', sortable: true, filter: true }
];

// Skaters Grid Configuration
const skatersColumnDefs = [
    { field: 'PLAYER', headerName: 'Player', sortable: true, filter: true },
    { field: 'POS', headerName: 'Position', sortable: true, filter: true },
    { field: 'GP', headerName: 'Games', sortable: true, filter: true },
    { field: 'G', headerName: 'Goals', sortable: true, filter: true },
    { field: 'A', headerName: 'Assists', sortable: true, filter: true },
    { field: 'PTS', headerName: 'Points', sortable: true, filter: true },
    { field: '+/-', headerName: '+/-', sortable: true, filter: true },
    { field: 'PIM', headerName: 'PIM', sortable: true, filter: true },
    { field: 'TOI PER G', headerName: 'TOI/G', sortable: true, filter: true }
];

// Grid Options
const gridOptions = {
    defaultColDef: {
        resizable: true,
        minWidth: 100,
        filter: true,
        floatingFilter: true
    },
    domLayout: 'autoHeight',
    animateRows: true,
    enableCellTextSelection: true,
    ensureDomOrder: true
};

// Initialize Goalies Grid
const goaliesGridOptions = {
    ...gridOptions,
    columnDefs: goaliesColumnDefs,
    onGridReady: async (params) => {
        try {
            const data = await loadJSON('/data/TOR_TREP_Goalies_2024_v1.json');
            if (!data || data.length === 0) {
                console.error('No goalie data was loaded');
                return;
            }
            // Filter out TEAM and OPPONENTS entries
            const goaliesData = data.filter(item => item.GOALKEEPER !== 'TEAM' && item.GOALKEEPER !== 'OPPONENTS');
            console.log('Setting goalies data:', goaliesData);
            params.api.setRowData(goaliesData);
        } catch (error) {
            console.error('Error initializing goalies grid:', error);
        }
    }
};

// Initialize Skaters Grid
const skatersGridOptions = {
    ...gridOptions,
    columnDefs: skatersColumnDefs,
    onGridReady: async (params) => {
        try {
            const data = await loadJSON('/data/TOR_TREP_Skaters_2024_v1.json');
            if (!data || data.length === 0) {
                console.error('No skater data was loaded');
                return;
            }
            // Filter out TEAM and OPPONENTS entries
            const skatersData = data.filter(item => item.PLAYER !== 'TEAM' && item.PLAYER !== 'OPPONENTS');
            console.log('Setting skaters data:', skatersData);
            params.api.setRowData(skatersData);
        } catch (error) {
            console.error('Error initializing skaters grid:', error);
        }
    }
};

// Create the grids
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing grids...');
    const goaliesGridElement = document.querySelector('#goaliesGrid');
    const skatersGridElement = document.querySelector('#skatersGrid');
    
    // Create grids using agGrid.createGrid
    agGrid.createGrid(goaliesGridElement, goaliesGridOptions);
    agGrid.createGrid(skatersGridElement, skatersGridOptions);
}); 