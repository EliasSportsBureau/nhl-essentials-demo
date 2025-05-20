// Function to load JSON data
async function loadJSON(url) {
    const response = await fetch(url);
    return response.json();
}

// Function to load multiple JSON files and combine their data
async function loadMultipleJSON(urls) {
    try {
        const dataPromises = urls.map(url => loadJSON(url));
        const dataArrays = await Promise.all(dataPromises);
        return dataArrays.flat();
    } catch (error) {
        console.error('Error loading JSON files:', error);
        return [];
    }
}

// Function to initialize the grid
async function initializeGrid() {
    try {
        // Load multiple JSON files and combine their data
        const jsonFiles = [
            'data/TOR_GameLog_2024_v3.json',
            'data/TOR_GameLog_2023_v2.json',
            'data/TOR_GameLog_2022_v1.json',
            'data/TOR_GameLog_2021_v1.json',
        ];
        const rowData = await loadMultipleJSON(jsonFiles);

        // Grid Options: Contains all of the Data Grid configurations
        const gridOptions = {
            theme: 'ag-theme-balham',
            tooltipShowDelay: 500,
            rowGroupPanelShow: "always",
            groupDefaultExpanded: -1,
            //groupDisplayType: 'groupRows',
            //grandTotalRow: 'top',
            //sideBar: 'filters',
            suppressAggFuncInHeader: true,
            autoSizeStrategy: { 
                type: 'fitCellContents',
            },
            // Default Column Definitions
            defaultColDef: {
                sortable: true,
                resizable: true,
                floatingFilter: true,
                valueFormatter: params => {
                    return params.value === 'NULL' ? '' : params.value;
                },
                filter: 'agNumberColumnFilter',
                filterParams: {
                    maxNumConditions: 1,
                    buttons: ["reset"],
                    filterOptions: ['greaterThanOrEqual', 'lessThanOrEqual', 'equals', 'inRange']
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
                    field: 'Gm Type', 
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
                    field: 'GM', 
                    headerName: 'GM #',
                    headerTooltip: 'Game Number', 
                    cellDataType: 'number',
                },    
                { 
                    field: 'Game Date', 
                    headerName: 'Date',
                    headerTooltip: 'Game Date', 
                    cellDataType: 'date',
                    filter: 'agDateColumnFilter',
                    cellRenderer: params => {
                        if (params.value) {
                            return `<a href="#" style="color: #1a1a1a; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${params.value}</a>`;
                        }
                        return '';
                    },
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
                    headerName: 'Score',
                    children: [
                        { 
                            field: 'Tm Sc', 
                            headerName: 'Tm', 
                            headerTooltip: 'Team Score', 
                            cellDataType: 'number',
                            aggFunc: 'sum',
                        },
                        { 
                            field: 'Opp Sc', 
                            headerName: 'Opp', 
                            headerTooltip: 'Opponent Score', 
                            cellDataType: 'number',
                            aggFunc: 'sum',
                        }
                    ] 
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
                    if (params.value === 'W') {
                        //mark wins as green
                        return {backgroundColor: '#D0F8AB'};
                    }
                    return null;
                } },
                { 
                    field: 'OT', 
                    headerTooltip: 'Overtime Result', 
                    cellDataType: 'text', 
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: ['contains'],
                        buttons: ['reset'],
                        maxNumConditions: 1
                    },
                    rowGroup: false, 
                    enableRowGroup: true, 
                    hide: false 
                },
                {
                    headerName: 'Power Play',
                    children: [
                        { 
                            field: 'PP Tm Op', 
                            headerName: 'Tm Op', 
                            headerTooltip: 'Team Power Play Opportunities',
                            aggFunc: 'sum', 
                        },
                        { 
                            field: 'PP Tm G', 
                            headerName: 'Tm G', 
                            headerTooltip: 'Team Power Play Goals',
                            aggFunc: 'sum',
                        },
                        { 
                            field: 'PP Opp Op', 
                            headerName: 'Opp Op', 
                            headerTooltip: 'Opponent Power Play Opportunities',
                            aggFunc: 'sum',
                        },
                        { 
                            field: 'PP Opp G', 
                            headerName: 'Opp G', 
                            headerTooltip: 'Opponent Power Play Goals',
                            aggFunc: 'sum',
                        }
                    ]
                },
                { 
                    field: 'Starter', 
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
                    field: 'ScF', 
                    headerName: 'Sc F',
                    headerTooltip: 'Scored First', 
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
                    headerName: 'Big Lead',
                    children: [
                        { 
                            field: 'BL Tm G', 
                            headerName: 'Tm G', 
                            headerTooltip: 'Team Big Lead', 
                            cellDataType: 'number',
                            aggFunc: 'sum',
                        },
                        { 
                            field: 'BL Opp G', 
                            headerName: 'Opp G', 
                            headerTooltip: 'Opponent Big Lead', 
                            cellDataType: 'number',
                            aggFunc: 'sum',
                        }
                    ]
                },
                {
                    headerName: 'TM Goals by Period',
                    children: [
                        { 
                            field: 'Tm P1', 
                            headerName: 'P1', 
                            headerTooltip: 'Team First Period Goals',
                            cellDataType: 'number',
                            aggFunc: 'sum',
                        },
                        { 
                            field: 'Tm P2', 
                            headerName: 'P2', 
                            headerTooltip: 'Team Second Period Goals',
                            cellDataType: 'number',
                            aggFunc: 'sum',
                        },
                    ]
                },  
                {
                    headerName: 'OPP Goals by Period',
                    children: [
                        { 
                            field: 'Opp P1', 
                            headerName: 'P1', 
                            headerTooltip: 'Opponent First Period Goals',
                            cellDataType: 'number',
                            aggFunc: 'sum',
                        },
                        { 
                            field: 'Opp P2', 
                            headerName: 'P2', 
                            headerTooltip: 'Opponent Second Period Goals',
                            cellDataType: 'number',
                            aggFunc: 'sum',
                        }
                    ]
                },
                {
                    headerName: 'Time Played',
                    children: [
                        { 
                            field: 'Lead', 
                            headerName: 'Lead', 
                            headerTooltip: 'Time Played with Lead',
                            cellDataType: 'text',
                            filter: 'agTextColumnFilter',
                            filterParams: {
                                filterOptions: ['contains'],
                                buttons: ['reset'],
                                maxNumConditions: 1
                            }
                        },
                        { 
                            field: 'Tied', 
                            headerName: 'Tied', 
                            headerTooltip: 'Time Played Tied',
                            cellDataType: 'text',
                            filter: 'agTextColumnFilter',
                            filterParams: {
                                filterOptions: ['contains'],
                                buttons: ['reset'],
                                maxNumConditions: 1
                            }
                        },
                        { 
                            field: 'Trail', 
                            headerName: 'Trail', 
                            headerTooltip: 'Time Played Trailing',
                            cellDataType: 'text',
                            filter: 'agTextColumnFilter',
                            filterParams: {
                                filterOptions: ['contains'],
                                buttons: ['reset'],
                                maxNumConditions: 1
                            }
                        }
                    ]
                },
                // {
                //     headerName: 'Penalty Kills',
                //     children: [
                //         { field: 'PK Goals', headerName: 'TM' },
                //         { field: 'PK Opps', headerName: 'OPP' }
                //     ]
                // },
                // {
                //     headerName: 'Faceoffs',
                //     children: [
                //         { field: 'FO' },
                //         { field: 'FOW' },
                //         { field: 'FOL' },
                //         { field: 'FO%' }
                //     ]
                // },
            ],
        };

        const eDiv = document.querySelector("#myGrid");
        const gridApi = agGrid.createGrid(eDiv, gridOptions);
    } catch (error) {
        console.error('Error loading grid data:', error);
    }
}

// Initialize the grid when the page loads
document.addEventListener('DOMContentLoaded', initializeGrid);