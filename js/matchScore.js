
// Predictive anayltics for match scores

function changeMatchScores(){
    //matchObj is a global containing user preferences for match scores
    
    console.log('matchObj ', matchObj);
    //console.log('allSchoolsCache ', allSchoolsCache);



    //TODO:  call all schools in allSchoolsCache and update the match score
    allSchoolsCache = allSchoolsCache.map(school => {

        // algo for match score here
        if(school.match_score==undefined){
            matchResult = 0;  //init
            return {...school, match_score: matchResult };
        }
        
        if(school.retention_rate)
            matchResult = Math.round(school.retention_rate*100,0)
        else
            matchResult = 42;

        if(school.sat_math_25_pctl <= matchObj.Academics*200)
            matchResult = (matchResult + 100)/2

        if(school.headcount >= matchObj.Social*2000)
            matchResult = (matchResult + 100)/2

        if(school.tuition_fees_ft <= matchObj.Cost*4000)
            matchResult = (matchResult + 100)/2

        if(school.completion_rate_150pct)
            matchResult = (matchResult + school.completion_rate_150pct*100)/2
        else
            matchResult = (matchResult + 42)/2
            

        matchResult = Math.round(matchResult,0)

        // end of algo
        // add the property match_score to the school object
        return {...school, match_score: matchResult };
    });

}