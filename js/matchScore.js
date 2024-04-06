
// Predictive anayltics for match scores

function changeMatchScores(){
    //matchObj is a global containing user preferences for match scores
    //console.log('allSchoolsCache ', allSchoolsCache);
    console.log('matchObj ', matchObj);



    //TODO:  call all schools in allSchoolsCache and update the match score
    allSchoolsCache = allSchoolsCache.map(school => {

        // algo for match score here
        if(school.match_score==undefined)
            matchResult = 0;  //init
        else
            if(school.retention_rate)
                matchResult = Math.round(school.retention_rate*100,0)
            else
                matchResult = 42;


        // end of algo
        // add the property match_score to the school object
        return {...school, match_score: matchResult };
    });

}