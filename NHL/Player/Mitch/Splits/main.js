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
            '/data/Mitch_Splits_Career_v1.json',
            '/data/Mitch_Splits_2024_v2.json',
            '/data/Mitch_Splits_2023_v2.json'
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
            groupDefaultExpanded: 1,
            groupDisplayType: 'groupRows',
            groupRowRendererParams: {
                suppressCount: true,
            },
            suppressAggFuncInHeader: true,
            autoSizeStrategy: { 
                type: 'fitGridWidth',
            },
            // Default Column Definitions
            defaultColDef: {
                sortable: true,
                resizable: true,
                floatingFilter: false,
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
                    field: 'Split', 
                    headerTooltip: 'Split', 
                    cellDataType: 'text',
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains'],
                        buttons: ['reset'],
                        maxNumConditions: 1
                    },
                    pinned: 'left',
                    width: 300,
                },
                { 
                    field: 'GP', 
                    headerName: 'GP',
                    headerTooltip: 'Games Played', 
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                 },
                { 
                    field: 'TOI', 
                    headerTooltip: 'Time On Ice', 
                    cellDataType: 'text',
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains'],
                        buttons: ['reset'],
                        maxNumConditions: 1
                    },
                },
                { 
                    field: 'G', 
                    headerName: 'G',
                    headerTooltip: 'Goals', 
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
                { 
                    field: 'A', 
                    headerName: 'A',
                    headerTooltip: 'Assists', 
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
                { 
                    field: 'PTS', 
                    headerName: 'PTS',
                    headerTooltip: 'Points', 
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
                { 
                    field: 'PPG', 
                    headerName: 'PPG',
                    headerTooltip: 'Points per Game', 
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
                { 
                    field: 'SOG', 
                    headerName: 'SOG',
                    headerTooltip: 'Shots on Goal', 
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
                { 
                    field: '+/-', 
                    headerName: '+/-',
                    headerTooltip: 'Plus/Minus', 
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
                { 
                    field: 'PIM', 
                    headerName: 'PIM',
                    headerTooltip: 'Penalty Minutes', 
                    cellDataType: 'number',
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        maxNumConditions: 1,
                        buttons: ["reset"],
                        filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                    },
                },
                {
                    headerName: 'Power Play',
                    children: [
                        { 
                            field: 'PP G', 
                            headerName: 'G', 
                            headerTooltip: 'Power Play Goals',
                            cellDataType: 'number',
                            filter: 'agNumberColumnFilter',
                            filterParams: {
                                maxNumConditions: 1,
                                buttons: ["reset"],
                                filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                            },
                        },
                        { 
                            field: 'PP PTS', 
                            headerName: 'PTS', 
                            headerTooltip: 'Power Play Points',
                            cellDataType: 'number',
                            filter: 'agNumberColumnFilter',
                            filterParams: {
                                maxNumConditions: 1,
                                buttons: ["reset"],
                                filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                            },  
                        },
                    ]
                },
                {
                    headerName: 'Shorthanded',
                    children: [
                        { 
                            field: 'SH G', 
                            headerName: 'G', 
                            headerTooltip: 'Shorthanded Goals',
                            cellDataType: 'number',
                            filter: 'agNumberColumnFilter',
                            filterParams: {
                                maxNumConditions: 1,
                                buttons: ["reset"],
                                filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                            },
                        },
                        { 
                            field: 'SH PTS', 
                            headerName: 'PTS', 
                            headerTooltip: 'Shorthanded Points',
                            cellDataType: 'number',
                            filter: 'agNumberColumnFilter',
                            filterParams: {
                                maxNumConditions: 1,
                                buttons: ["reset"],
                                filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                            },
                        },
                    ]
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