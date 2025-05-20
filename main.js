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
        // console.log('Initializing AG Grid...'); // Added for debugging
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
        // Ensure eDiv exists before creating grid. This is important because #myGrid is dynamically added.
        if (eDiv) {
            // console.log('Creating grid in #myGrid element.'); // Added for debugging
            const gridApi = agGrid.createGrid(eDiv, gridOptions);
        } else {
            // console.error('#myGrid element not found. Grid cannot be created. Current main-content:', document.querySelector('.main-content').innerHTML); // Added for debugging
        }
    } catch (error) {
        console.error('Error loading grid data:', error);
    }
}

// Store the original dashboard content
let originalDashboardHTML = '';

// Client-Side Router Logic
function handleRouteChange() {
    const hash = window.location.hash.substring(1); // Remove the '#'
    const mainContent = document.querySelector('.main-content');

    // console.log('Route changed to:', hash); // Added for debugging

    if (!mainContent) {
        console.error('.main-content element not found!');
        return;
    }

    // Simple routing based on hash
    if (hash.startsWith('/NHL/team/')) {
        const teamCode = hash.split('/').pop();
        mainContent.innerHTML = `<h1>${teamCode} Game Log</h1><div id="myGrid" class="ag-theme-balham" style="height: 80vh; width: 100%;"></div>`;
        if (teamCode.toUpperCase() === 'TOR') {
            // Delay initializeGrid and ensure agGrid object is available
            const attemptInitializeGrid = () => {
                if (typeof agGrid !== 'undefined' && agGrid.createGrid) {
                    initializeGrid();
                } else {
                    // If agGrid is not ready, try again shortly
                    // console.log('AG Grid not ready yet, retrying...'); // For debugging
                    setTimeout(attemptInitializeGrid, 100); // Retry after 100ms
                }
            };
            setTimeout(attemptInitializeGrid, 0); // Initial attempt after DOM update
        } else {
            mainContent.innerHTML = `<h1>Game Log for ${teamCode} (Not Implemented Yet)</h1><p>Data for this team is not yet available.</p>`;
        }
    } else if (hash === '/reports') {
        // console.log('Displaying Reports page'); // Added for debugging
        mainContent.innerHTML = '<h1>Reports</h1><p>This is the reports page. Content coming soon!</p>';
    } else if (hash === '/finders') {
        // console.log('Displaying Finders page'); // Added for debugging
        mainContent.innerHTML = '<h1>Finders</h1><p>This is the finders page. Content coming soon!</p>';
    } else if (hash === '/' || hash === '') {
        // console.log('Displaying Home/Dashboard page'); // Added for debugging
        // Restore original dashboard content
        mainContent.innerHTML = originalDashboardHTML;
        // Re-attach event listeners or re-initialize scripts if needed for the dashboard
    } else {
        // console.log('Displaying Page Not Found (within app)'); // Added for debugging
        mainContent.innerHTML = `<h1>Page Not Found</h1><p>The path "${hash}" is not recognized within the application.</p>`;
    }
}

// Initialize the router and convert links
document.addEventListener('DOMContentLoaded', () => {
    const mainContentDiv = document.querySelector('.main-content');
    if (mainContentDiv) {
        originalDashboardHTML = mainContentDiv.innerHTML; // Store the initial content of .main-content
    } else {
        console.error('Initial .main-content div not found for storing originalHTML!');
    }

    // Convert all internal links to use hash-based navigation
    // Ensure this runs after originalDashboardHTML is stored, if links are part of it.
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        // Check if it's an internal link (starts with '/') and not already a hash link
        if (href && href.startsWith('/') && !href.startsWith('#')) {
            // Also check if it's not a link to an external site or a different type of resource
            try {
                const url = new URL(href, window.location.origin); // Check if it's a full URL
                if (url.origin === window.location.origin) { // Only modify same-origin links
                     link.setAttribute('href', '#' + href);
                }
            } catch (e) {
                // If it's a relative path like "/reports", it's internal.
                 link.setAttribute('href', '#' + href);
            }
        }
    });

    // Listen for hash changes
    window.addEventListener('hashchange', handleRouteChange);

    // Handle initial page load (e.g., if there's a hash in the URL when the page first loads)
    // Call handleRouteChange after a slight delay to ensure DOM is fully ready, especially #myGrid
    // setTimeout(handleRouteChange, 0); // Call it to process the initial hash
    handleRouteChange(); // Call it to process the initial hash. If #myGrid is needed, it's created by the router.
});