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
            '/data/Mitch_GameLog_2024_v2.json'
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
            rowGroupPanelShow: "always",
            groupDefaultExpanded: 2,
            groupDisplayType: 'groupRows',
            suppressAggFuncInHeader: true,
            autoSizeStrategy: { 
                type: 'fitGridWidth',
            },
            // Default Column Definitions
            defaultColDef: {
                sortable: true,
                resizable: true,
                floatingFilter: false,
                valueFormatter: params => {
                    return params.value === 'NULL' ? '' : params.value;
                },
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
                    headerTooltip: 'Game Date', 
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
                    field: 'At', 
                    headerTooltip: 'Location', 
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
                { 
                    field: 'Result', 
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
                    cellStyle: params => {
                    if (params.value && params.value.includes('W')) {
                        //mark wins as green
                        return {backgroundColor: '#D0F8AB'};
                    }
                    return null;
                    } 
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
                field: "+/-",
                headerName: "+/-",
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
                field: 'SHG',
                headerName: 'SHG',
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
                field: 'TOI',
                headerName: 'TOI',
                headerTooltip: 'Time on Ice',
                cellDataType: 'text',
                filter: 'agTextColumnFilter',
                filterParams: {
                    maxNumConditions: 1,
                    buttons: ["reset"],
                    filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                },
               },
               {
                field: 'HT',
                headerName: 'HT',
                headerTooltip: 'Hits',
                cellDataType: 'number',
                filter: 'agNumberColumnFilter',
                filterParams: {
                    maxNumConditions: 1,
                    buttons: ["reset"],
                    filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                },
               },
               {
                field: 'BK',
                headerName: 'BK',
                headerTooltip: 'Blocks',
                cellDataType: 'number',
                filter: 'agNumberColumnFilter',
                filterParams: {
                    maxNumConditions: 1,
                    buttons: ["reset"],
                    filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                },
               },
               {
                field: 'TK',
                headerName: 'TK',
                headerTooltip: 'Takes',
                cellDataType: 'number',
                filter: 'agNumberColumnFilter',
                filterParams: {
                    maxNumConditions: 1,
                    buttons: ["reset"],
                    filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                },
               },
               {
                headerName: 'Shootout',
                children: [
                    {
                        field: 'SO G',
                        headerName: 'G',
                        headerTooltip: 'Shootout Goals',
                        cellDataType: 'number',
                        filter: 'agNumberColumnFilter',
                        filterParams: {
                            maxNumConditions: 1,
                            buttons: ["reset"],
                            filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                        },
                    },
                    {
                        field: 'SO ATT',
                        headerName: 'ATT',
                        headerTooltip: 'Shootout Attempts',
                        cellDataType: 'number',
                        filter: 'agNumberColumnFilter',
                        filterParams: {
                            maxNumConditions: 1,
                            buttons: ["reset"],
                            filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
                        },
                    }
                ]
               }
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