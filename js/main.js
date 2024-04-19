//initial fetch for all collges
var currentState = ''
var stateCode = ''
let activeCounty = null;
let countyColor = '#EAAA00'; // Default color for counties

var allSchoolsCache = []; // Stores all schools as a list of objects
var filterObj = {} // stores the filter as a global variable.
var matchObj = {} // stores the match score weights a global variable.

// init map
drawMap();

showGrayout(true);
showSpinner(true);
// Call loadAllSchools() and save in memory when the app starts
document.addEventListener('DOMContentLoaded', function () {
    loadAllSchools().then(() => {
        showSpinner(false);
        showGrayout(false);
        //colorCounties();
        changeMatchScores();
    });

    // Checkbox listeners
    const hbcuCheckbox = document.getElementById('hbcuCheckbox');
    hbcuCheckbox.addEventListener('change', () => {
        hbcuCheckbox.checked ? filterObj.hbcu = 1 : delete filterObj.hbcu;
        colorCounties(); // handles filtering based on filterObj
    });
    const tribalCheckbox = document.getElementById('tribalCheckbox');
    tribalCheckbox.addEventListener('change', () => {
        tribalCheckbox.checked ? filterObj.tribal_college = 1 : delete filterObj.tribal_college;
        colorCounties(); // handles filtering based on filterObj
    });
    const gradCheckbox = document.getElementById('gradCheckbox');
    gradCheckbox.addEventListener('change', () => {
        gradCheckbox.checked ? filterObj.offering_grad = 1 : delete filterObj.offering_grad;
        colorCounties(); // handles filtering based on filterObj
    });
    const assocCheckbox = document.getElementById('assocDeg');
    assocCheckbox.addEventListener('change', () => {
        assocCheckbox.checked ? filterObj.offering_highest_degree = 40 : delete filterObj.offering_highest_degree;
        colorCounties(); // handles filtering based on filterObj
    });
    const medCheckbox = document.getElementById('medCheckbox');
    medCheckbox.addEventListener('change', () => {
        medCheckbox.checked ? filterObj.medical_degree = 1 : delete filterObj.medical_degree;
        colorCounties(); // handles filtering based on filterObj
    });
    const pubCheckbox = document.getElementById('pubCheckbox');
    pubCheckbox.addEventListener('change', () => {
        pubCheckbox.checked ? filterObj.inst_control = 1 : delete filterObj.inst_control;
        colorCounties(); // handles filtering based on filterObj
    });
    const openCheckbox = document.getElementById('openCheckbox');
    openCheckbox.addEventListener('change', () => {
        //console.log('openCheckbox', allSchoolsCache);
        openCheckbox.checked ? filterObj.open_admissions_policy = 1 : delete filterObj.open_admissions_policy;
        colorCounties(); // handles filtering based on filterObj
    });
    const rotcCheckbox = document.getElementById('rotcCheckbox');
    rotcCheckbox.addEventListener('change', () => {
        rotcCheckbox.checked ? filterObj.rotc = 1 : delete filterObj.rotc;
        colorCounties(); // handles filtering based on filterObj
    });
    const teachCheckbox = document.getElementById('teachCheckbox');
    teachCheckbox.addEventListener('change', () => {
        teachCheckbox.checked ? filterObj.teacher_cert = 1 : delete filterObj.teacher_cert;
        colorCounties(); // handles filtering based on filterObj
    });
    const weekendCheckbox = document.getElementById('weekendCheckbox');
    weekendCheckbox.addEventListener('change', () => {
        weekendCheckbox.checked ? filterObj.weekend_evening_college = 1 : delete filterObj.weekend_evening_college;
        colorCounties(); // handles filtering based on filterObj
    });
    const distanceCheckbox = document.getElementById('distanceCheckbox');
    distanceCheckbox.addEventListener('change', () => {
        distanceCheckbox.checked ? filterObj.dist_progs_all = 1 : delete filterObj.dist_progs_all;
        colorCounties(); // handles filtering based on filterObj
    });
    const distanceGradCheckbox = document.getElementById('distanceGradCheckbox');
    distanceGradCheckbox.addEventListener('change', () => {
        distanceGradCheckbox.checked ? filterObj.dist_grad_progs_offered = 1 : delete filterObj.dist_grad_progs_offered;
        colorCounties(); // handles filtering based on filterObj
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {

            const name = this.getAttribute('name');
            const weight = this.getAttribute('data-value');
            this.closest('.dropdown').querySelector('.dropdown-toggle').textContent = this.textContent;;
            matchObj[name] = +weight;
            changeMatchScores();
            //console.log('After', allSchoolsCache);
        });
    });
    
    
});

//modal event listener
var myModal = new bootstrap.Modal(document.getElementById('collegeModal'), {
    keyboard: true // Allowing modal to be closed with the keyboard
});

// Add event listener for when the modal is closed
document.getElementById('collegeModal').addEventListener('hidden.bs.modal', function () {
    if (activeCounty) {
        activeCounty.style('fill', null);
        activeCounty = null; 
    }
});