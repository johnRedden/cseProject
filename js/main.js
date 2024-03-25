//initial fetch for all collges
var currentState = ''
var stateCode = ''
let activeCounty = null;
let countyColor = 'lightblue';
var allSchoolsCache = []; // Stores all schools as a list of objects
var filterObj = {} // stores the filter as a global variable.

// init map
drawMap();

showGrayout(true);
showSpinner(true);
// Call loadAllSchools() and save in memory when the app starts
document.addEventListener('DOMContentLoaded', function () {
    loadAllSchools().then(() => {
        showSpinner(false);
        showGrayout(false);
        colorCounties();
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
    
    
});

// dropdowns
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
        var selectedText = this.textContent;
        this.closest('.dropdown').querySelector('.dropdown-toggle').textContent = selectedText;
    });
});



//modal event listener
// Initialization of the modal, assuming you've already done this
var myModal = new bootstrap.Modal(document.getElementById('collegeModal'), {
    keyboard: true // Allowing modal to be closed with the keyboard
});

// Add event listener for when the modal is closed
document.getElementById('collegeModal').addEventListener('hidden.bs.modal', function () {
    if (activeCounty) {
        activeCounty.style('fill', null); // Reset the active county's color
        activeCounty = null; // Clear the reference to the active county
    }
});