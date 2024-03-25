
// Predictive anayltics for match scores

function changeMatchScores(){
    //matchObj is a global containing user preferences for match scores

    console.log('matchObj ', matchObj);

    //TODO:  call all schools in allSchoolsCache and update the match score

    return Math.floor(Math.random() * 81) + 10;
}