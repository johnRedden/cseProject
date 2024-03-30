

const baseUrl = `https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2022/`;

// todo:  eliminate this var
const collegeCache = {}; // Stores data per state FIPS

async function loadAllSchools() {
    const response = await fetch(`https://educationdata.urban.org/api/v1/college-university/ipeds/directory/2022/`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    allSchoolsCache = data.results;
    //console.log('All schools loaded:', allSchoolsCache.length);

    // After loading all schools, fetch and merge admissions data
    await mergeAdmissionsData(2022).then(() => {    
        console.log('Admissions data merged and flattened:', allSchoolsCache);});
}

function getFilteredData() {
    // If filterObj is empty, return all schools without filtering
    //console.log('filterObj', filterObj);
    if (Object.keys(filterObj).length === 0) {
        //console.log('No filters applied.');
        return allSchoolsCache;
    }
    //console.log('Filtering data:', filterObj);
    return allSchoolsCache.filter(school => {
        //console.log('school', school);

        return Object.keys(filterObj).every(key => {
            // Handle different data types appropriately
            const schoolValue = Number.isNaN(+school[key]) ? school[key] : +school[key];
            return schoolValue === filterObj[key];
        });
    });
}


// Admissions-Requirements data
async function fetchAdmissionsRequirements(year) {
    try {
        const response = await fetch(`https://educationdata.urban.org/api/v1/college-university/ipeds/admissions-requirements/${year}/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const filteredResults = data.results.map(item => ({
            unitid: item.unitid,
            open_admissions_policy: item.open_admissions_policy,
            reqt_sat_scores: item.reqt_sat_scores,
            sat_crit_read_25_pctl: item.sat_crit_read_25_pctl,
            sat_crit_read_75_pctl: item.sat_crit_read_75_pctl,
            sat_math_25_pctl: item.sat_math_25_pctl,
            sat_math_75_pctl: item.sat_math_75_pctl,
            sat_writing_25_pctl: item.sat_writing_25_pctl,
            sat_writing_75_pctl: item.sat_writing_75_pctl
        }));
        return filteredResults;
    } catch (error) {
        console.error('Error fetching admissions requirements:', error);
        return [];
    }
}
async function mergeAdmissionsData(year) {
    // Fetch admissions requirements data
    const admissionsData = await fetchAdmissionsRequirements(year);
    //console.log('Admissions data fetched:', admissionsData.length);

    // Convert the admissions data into a map for easy lookup
    const admissionsMap = new Map(admissionsData.map(item => [item.unitid, item]));

    // Merge and flatten specified admissions data with allSchoolsCache
    allSchoolsCache = allSchoolsCache.map(school => {
        school.match_score = 0;  //init match score to 0
        if (admissionsMap.has(school.unitid)) {
            const admissionsInfo = admissionsMap.get(school.unitid);

            // Flatten selected admissions properties into the school object
            school.open_admissions_policy = admissionsInfo.open_admissions_policy;
            school.reqt_sat_scores = admissionsInfo.reqt_sat_scores;
            school.sat_crit_read_25_pctl = admissionsInfo.sat_crit_read_25_pctl;
            school.sat_crit_read_75_pctl = admissionsInfo.sat_crit_read_75_pctl;
            school.sat_math_25_pctl = admissionsInfo.sat_math_25_pctl;
            school.sat_math_75_pctl = admissionsInfo.sat_math_75_pctl;
            school.sat_writing_25_pctl = admissionsInfo.sat_writing_25_pctl;
            school.sat_writing_75_pctl = admissionsInfo.sat_writing_75_pctl;
        }
        return school;
    });

    //console.log('Admissions data merged and flattened:', allSchoolsCache);
    //colorCounties(); // Reapply colors after merging admissions data
}








