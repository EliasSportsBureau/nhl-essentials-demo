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

// Function to load multiple JSON files and combine their data
async function loadMultipleJSON(urls) {
    try {
        console.log('Starting to load multiple JSON files:', urls);
        const dataPromises = urls.map(url => loadJSON(url));
        const dataArrays = await Promise.all(dataPromises);
        const combinedData = dataArrays.flat();
        console.log('Total combined data length:', combinedData.length);
        if (combinedData.length === 0) {
            console.warn('No data was loaded from any of the JSON files');
        }
        return combinedData;
    } catch (error) {
        console.error('Error in loadMultipleJSON:', error);
        return [];
    }
}

// Function to initialize the grid
async function initializeGrid() {
    try {
        // Load multiple JSON files and combine their data
        const jsonFiles = [
            '/data/Mitch_GoalLog_v1.json',
        ];
        console.log('Starting to load data files...');
        const rowData = await loadMultipleJSON(jsonFiles);
        console.log('Row data loaded:', rowData);

        if (!rowData || rowData.length === 0) {
            console.error('No data was loaded. Please check if the JSON files exist and are accessible.');
            return;
        }

        // Grid Options: Contains all of the Data Grid configurations
        const gridOptions = {
            theme: 'legacy',
            tooltipShowDelay: 500,
            rowGroupPanelShow: "false",
            groupDefaultExpanded: 2,
            groupDisplayType: 'groupRows',
            groupRowRendererParams: {
                suppressCount: false,
            },
            suppressAggFuncInHeader: true,
            autoSizeStrategy: { 
                type: 'fitCellContents',
            },
            // Default Column Definitions
            defaultColDef: {
                sortable: true,
                resizable: true,
                floatingFilter: true,
            },

            // Row Data
            rowData: rowData,

            // Column Definitions
            columnDefs: [
                { 
                    field: 'Season',
                    headerName: 'Season',
                    headerTooltip: 'Season',
                    cellDataType: 'text',
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains'],
                        buttons: ['reset'],
                        maxNumConditions: 1
                    },
                    rowGroup: true, 
                    enableRowGroup: true, 
                    hide: true,
                },
                { 
                    field: 'Type',
                    headerName: 'Gm Type',
                    headerTooltip: 'Game Type',
                    cellDataType: 'text',
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains'],
                        buttons: ['reset'],
                        maxNumConditions: 1
                    },
                    rowGroup: true, 
                    enableRowGroup: true, 
                    hide: true,
                },
                { 
                    field: 'Date',
                    headerName: 'Date',
                    headerTooltip: 'Date',
                    cellDataType: 'text',
                },
                {
                    field: 'Period',
                    headerName: 'Period',
                    headerTooltip: 'Period',
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
                {
                    field: 'Time',
                    headerName: 'Time',
                    headerTooltip: 'Time',
                    cellDataType: 'text',
                },
                { 
                    field: 'Team', 
                    headerName: 'Team',
                    headerTooltip: 'Team', 
                    cellDataType: 'text',
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains'],
                        buttons: ['reset'],
                        maxNumConditions: 1
                    },
                    rowGroup: false, 
                    enableRowGroup: true, 
                    hide: false,
                    cellRenderer: params => {
                        if (params.value) {
                            return `<a href="#" style="color: #1a1a1a; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${params.value}</a>`;
                        }
                        return '';
                    }
                },
                { 
                    field: 'Opp', 
                    headerName: 'Opp',
                    headerTooltip: 'Opponent', 
                    cellDataType: 'text',
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains'],
                        buttons: ['reset'],
                        maxNumConditions: 1
                    },
                    rowGroup: false, 
                    enableRowGroup: true, 
                    hide: false,
                    cellRenderer: params => {
                        if (params.value) {
                            return `<a href="#" style="color: #1a1a1a; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${params.value}</a>`;
                        }
                        return '';
                    }
                },
                {
                    field: 'Details',
                    headerName: 'Details',
                    headerTooltip: 'Details',
                    cellDataType: 'text',
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains'],
                        buttons: ['reset'],
                        maxNumConditions: 1
                    },               
                },
                {
                    field: 'Tm Sc',
                    headerName: 'Tm Sc',
                    headerTooltip: 'Team Score',
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
                {
                    field: 'Opp Sc',
                    headerName: 'Opp Sc',
                    headerTooltip: 'Opponent Score',
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
            ],

            // Add onGridReady callback
            onGridReady: (params) => {
                params.api.sizeColumnsToFit();
                params.api.redrawRows();
            }
        };

        console.log('Creating grid with options:', gridOptions);
        const eDiv = document.querySelector("#myGrid");
        if (!eDiv) {
            console.error('Grid container element not found!');
            return;
        }

        // Clear any existing grid
        eDiv.innerHTML = '';

        // Create new grid
        const gridApi = agGrid.createGrid(eDiv, gridOptions);
        console.log('Grid created successfully');
    } catch (error) {
        console.error('Error in initializeGrid:', error);
    }
}

// Initialize the grid when the page loads
document.addEventListener('DOMContentLoaded', initializeGrid); 