const stateLookup = {
    '01': 'Alabama',
    '02': 'Alaska',
    '04': 'Arizona',
    '05': 'Arkansas',
    '06': 'California',
    '08': 'Colorado',
    '09': 'Connecticut',
    '10': 'Delaware',
    '11': 'District of Columbia',
    '12': 'Florida',
    '13': 'Georgia',
    '15': 'Hawaii',
    '16': 'Idaho',
    '17': 'Illinois',
    '18': 'Indiana',
    '19': 'Iowa',
    '20': 'Kansas',
    '21': 'Kentucky',
    '22': 'Louisiana',
    '23': 'Maine',
    '24': 'Maryland',
    '25': 'Massachusetts',
    '26': 'Michigan',
    '27': 'Minnesota',
    '28': 'Mississippi',
    '29': 'Missouri',
    '30': 'Montana',
    '31': 'Nebraska',
    '32': 'Nevada',
    '33': 'New Hampshire',
    '34': 'New Jersey',
    '35': 'New Mexico',
    '36': 'New York',
    '37': 'North Carolina',
    '38': 'North Dakota',
    '39': 'Ohio',
    '40': 'Oklahoma',
    '41': 'Oregon',
    '42': 'Pennsylvania',
    '44': 'Rhode Island',
    '45': 'South Carolina',
    '46': 'South Dakota',
    '47': 'Tennessee',
    '48': 'Texas',
    '49': 'Utah',
    '50': 'Vermont',
    '51': 'Virginia',
    '53': 'Washington',
    '54': 'West Virginia',
    '55': 'Wisconsin',
    '56': 'Wyoming'
};


async function drawMap() {
    const mapContainer = d3.select('#map');
    const width = 1200, height = 800;

    // svg needs to be global variable
    var svg = mapContainer.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'map-svg');

    const projection = d3.geoAlbersUsa();
    const path = d3.geoPath().projection(projection);

    // Define the zoom behavior, limiting the scale extent to 0.5x-5x
    var zoom = d3.zoom()
        .scaleExtent([0.5, 5])
        .on('zoom', function (event) {
            // Update the projection's scale
            projection.scale(event.transform.k * 1000);

            // Update the paths (your map features)
            svg.selectAll('path').attr('d', path);

            // Update the position of the map features
            svg.selectAll('path')
                .attr('transform', event.transform);
        });

    // Apply the zoom behavior to the svg element
    svg.call(zoom);

    // Load both datasets
    const [statesData, countiesData] = await Promise.all([
        d3.json('./data/states-10m.json'),
        d3.json('./data/counties-10m.json')
    ]);

    const statesGeo = topojson.feature(statesData, statesData.objects.states);
    const countiesGeo = topojson.feature(countiesData, countiesData.objects.counties);

    // Draw counties
    const countiesGroup = svg.append('g')
        .attr('id', 'counties-group')
        .selectAll('path')
        .data(countiesGeo.features)
        .join('path')
        .attr('d', path)
        .attr('class', 'county')
        .attr('data-id', d => parseInt(d.id)) // Add this line to store the FIPS code

    // Draw states
    svg.append('g')
        .selectAll('path')
        .data(statesGeo.features)
        .join('path')
        .attr('d', path)
        .attr('class', 'state')
        .attr('fill', 'none') // Keep fill transparent
        .attr('stroke', 'black'); // Set the outline color to black

    // Tooltip Setup
    const tooltip = d3.select('.tooltip');

    countiesGroup.on('mouseover', function (event, d) {
        // Convert the hovered county's FIPS code to the format used in your data
        const currentCountyFips = d.id.toString().padStart(5, '0');
        const stateCode = currentCountyFips.substring(0, 2);

        // Retrieve only the filtered colleges located in the hovered county
        const filteredCollegesInCounty = getFilteredData().filter(college =>
            college.county_fips.toString().padStart(5, '0') === currentCountyFips
        );

        // Generate content for the tooltip based on these filtered colleges
        const tooltipContent = buildCollegeContent(filteredCollegesInCounty, stateLookup[stateCode], d.properties.name);


        // Update the tooltip's HTML content
        tooltip.html(tooltipContent)
            .style('left', (event.pageX + 30) + 'px')
            .style('top', (event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .transition().duration(200).style('opacity', 0.9);

        // Optionally, you can also highlight the county here if needed
        highlightCounty(currentCountyFips);
        highlightState(stateCode); // Highlight the state as well
    })
        .on('mouseout', () => {
            tooltip.transition().duration(500).style('opacity', 0);
            clearCountyHighlight(); // If you're highlighting the county on hover
        });



    // Click to see colleges in modal
    countiesGroup.on("click", function (event, d) {
        const currentCountyFips = d.id.toString().padStart(5, '0');
        const stateCode = currentCountyFips.substring(0, 2);
        const countyName = d.properties.name;
        const stateName = stateLookup[stateCode];

        // Retrieve only the filtered colleges located in the clicked county
        const filteredCollegesInCounty = getFilteredData().filter(college =>
            college.county_fips.toString().padStart(5, '0') === currentCountyFips
        );

        // Call showBootstrapModal with the filtered colleges and contextual information
        showBootstrapModal(filteredCollegesInCounty, stateName, countyName);
    });

    // for the tooltip only
    function buildCollegeContent(colleges, stateName, countyName) {
        let content = `<h5>${countyName} ${stateName}</h5><ul>`; // Add county name at the top
        if (colleges.length === 0) {
            content += '<li>No selections found in this county.</li>'; // Updated message
        } else {
            colleges.forEach(college => {
                content += `<li><strong>${college.inst_name}</strong> (${college.city})</li>`;
            });
        }
        content += '</ul>';
        return content;
    }
}

function showGrayout(show) {
    d3.select('.grayout').style('display', show ? 'block' : 'none');
}
function showSpinner(show) {
    d3.select('.spinner').style('display', show ? 'block' : 'none');
}
function highlightState(stateId) {
    // Apply highlight style to the specified state
    d3.selectAll('.state')
        .classed('state-highlight', function (d) { return d.id === stateId; });
}
function clearStateHighlight() {
    // Remove highlight style from all states
    d3.selectAll('.state').classed('state-highlight', false);
}

function highlightCounty(countyFips) {
    // Highlight the specified county
    d3.selectAll('.county')
        .classed('county-highlight', function (d) {
            const currentCountyFips = d.id.toString().padStart(5, '0');
            return currentCountyFips === countyFips;
        });
}

function clearCountyHighlight() {
    // Remove highlight class from all counties
    d3.selectAll('.county').classed('county-highlight', false);
}


function colorCounties() {
    const svg = d3.select('#map-svg');
    const filteredData = getFilteredData(); // Get dynamically filtered data based on filterObj
    const filterCount = document.querySelector('#filterCount');
    filterCount.innerHTML = filteredData.length;


    svg.selectAll('.county')
        .style('fill', null); // Reset to default before applying new colors

    // Create a set of filtered county FIPS codes, ensuring they are padded to 5 digits
    const filteredCounties = new Set(filteredData.map(item => item.county_fips.toString().padStart(5, '0')));

    // Iterate over each county path and color it if it's in the filtered set
    svg.selectAll('.county')
        .each(function (d) {
            // Ensure the county FIPS codes from the map are also padded to 5 digits for comparison
            const currentCountyFips = d.id.toString().padStart(5, '0');
            if (filteredCounties.has(currentCountyFips)) {
                d3.select(this).style('fill', countyColor); // Use the global countyColor for coloring
            }
        });
}


function showBootstrapModal(colleges, stateName, countyName) {
    const modalTitle = document.getElementById('collegeModalLabel'); // Access the modal title element
    const modalBody = document.getElementById('collegeModalBody');

    // Set the modal title to include state and county names
    modalTitle.innerHTML = `Colleges in ${stateName}, ${countyName}`;

    let modalContent = '';

    if (colleges.length === 0) {
        modalContent += `<p>No selections found in this county.</p>`; // Message when no colleges found
    } else {
        // Sort colleges by match_score in descending order
        colleges.sort((a, b) => b.match_score - a.match_score);
        
        colleges.forEach(college => {
            let collegeURL = college.url_school;
            if (!collegeURL.startsWith('http://') && !collegeURL.startsWith('https://')) {
                collegeURL = 'http://' + collegeURL;
            }

            modalContent += `<div class="college-info"><p><a href="${collegeURL}" target="_blank" rel="noopener noreferrer"><strong>${college.inst_name}</strong></a>
            (${college.city} - match score: <strong>${college.match_score}</strong>)<br>`;
            if (!college.tuition_fees_ft) {
                modalContent += `No Tuition data.<br>`;
            } else {
                const formattedTuition = college.tuition_fees_ft.toLocaleString();
                modalContent += `Avg. Yearly Tuition and Fees: \$${formattedTuition}<br>`;
            }

            if (!college.retention_rate) {
                modalContent += `No Retention data.<br>`;
            } else {
                modalContent += `Retention Rate: ${Math.round(college.retention_rate * 100)}% and Headcount: ${college.headcount}<br>`;
            }
            if (!college.sat_crit_read_25_pctl) {
                modalContent += `No SAT data.<br>`;
            } else {
                modalContent += `SAT Critical Reading IQR: ${college.sat_crit_read_25_pctl} to ${college.sat_crit_read_75_pctl}<br>
               SAT Math IQR: ${college.sat_math_25_pctl} to ${college.sat_math_75_pctl}<br>`;
            }

            modalContent += `</p></div>`;
        });
    }

    modalBody.innerHTML = modalContent;
    myModal.show();
}




