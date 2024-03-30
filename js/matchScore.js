
// Predictive anayltics for match scores

function changeMatchScores(){
    //matchObj is a global containing user preferences for match scores

    console.log('matchObj ', matchObj);

    //TODO:  call all schools in allSchoolsCache and update the match score
    allSchoolsCache = allSchoolsCache.map(school => {
        // Create a copy of the school object with an updated match_score
        return {...school, match_score: 5};
    });
    // no return
}