

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
    console.log('All schools loaded:', allSchoolsCache.length);
    //console.log('allSchoolsCache', allSchoolsCache);
    colorCounties();

    //console.log('All schools loaded:', allSchoolsCache.length);

    // New System Example usage
    const endpointURL = "https://educationdata.urban.org/api/v1/college-university/ipeds/admissions-requirements/2022/";
    const propList = ["open_admissions_policy", "reqt_sat_scores", "sat_crit_read_25_pctl", "sat_crit_read_75_pctl", "sat_math_25_pctl", "sat_math_75_pctl"];
    mergeData(endpointURL, propList).then(() => {
        console.log('Data successfully merged.');
    });

    const endpointURL2 = "https://educationdata.urban.org/api/v1/college-university/ipeds/enrollment-headcount/2021/99/?sex=99&race=99";
    const propList2 = ["headcount"];  // code for Total enrollment level_of_study = 99
    mergeData(endpointURL2, propList2).then(() => {
        console.log('headcount Data successfully merged.');
    });

    const endpointURL3 = "https://educationdata.urban.org/api/v1/college-university/ipeds/fall-retention/2020/?ftpt=99";
    const propList3 = ["retention_rate"];  
    mergeData(endpointURL3, propList3).then(() => {
        console.log('retention Data successfully merged.');
    });
    
    const endpointURL4 = "https://educationdata.urban.org/api/v1/college-university/ipeds/institutional-characteristics/2020/";
    const propList4 = ["occupational_prog_offered", "rotc","teacher_cert","weekend_evening_college", "dist_progs_all","dist_grad_progs_offered"];  
    mergeData(endpointURL4, propList4).then(() => {
        console.log('Characteristics Data successfully merged.');
        //console.log('allSchoolsCache', allSchoolsCache);
    });

    const endpointURL5 = "https://educationdata.urban.org/api/v1/college-university/ipeds/academic-year-tuition/2021/?level_of_study=1&tuition_type=3";
    const propList5 = ["tuition_fees_ft"];  
    mergeData(endpointURL5, propList5).then(() => {
        console.log('Tuition Fees Data successfully merged.');
    });

    const endpointURL6 = "https://educationdata.urban.org/api/v1/college-university/ipeds/grad-rates/2017/?subcohort=99&race=99&sex=99";
    const propList6 = ["completion_rate_150pct"];  
    mergeData(endpointURL6, propList6).then(() => {
        console.log('Graduation Data successfully merged.');
    });
    

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
// *** New fetch and merge system
async function fetchAndTransformData(endpointURL, propList) {
    try {
        const response = await fetch(endpointURL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        //console.log('Data fetched ', data.results);
        // Filter and transform the results to include only the specified properties plus unitid
        const filteredResults = data.results.map(item => {
            const transformedItem = { unitid: item.unitid };
            propList.forEach(prop => {
                transformedItem[prop] = item[prop];
            });
            return transformedItem;
        });
        return filteredResults;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
async function mergeData(endpointURL, propList) {
    // Fetch and transform data from the specified endpoint
    const newData = await fetchAndTransformData(endpointURL, propList);
    console.log('New data fetched:', newData.length);
    // Convert the new data into a map for easy lookup by unitid
    const newDataMap = new Map(newData.map(item => [item.unitid, item]));

    // Merge the new data with allSchoolsCache, adding the specified properties
    allSchoolsCache = allSchoolsCache.map(school => {
        if (newDataMap.has(school.unitid)) {
            const newDataForSchool = newDataMap.get(school.unitid);
            propList.forEach(prop => {
                school[prop] = newDataForSchool[prop];
            });
        }
        return school;
    });

    //console.log('Data merged with allSchoolsCache:', allSchoolsCache);

}

// *** End new system





