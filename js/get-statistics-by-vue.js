var data;

var byVue = new Vue({
    el: "#main-content",
    data: {
        glanceStatistics: [],
    },
    created: function () {
        this.getData();
    },
    methods: {
        getData: function () {
            let pathSenate = 'senate';
            let url = '';
            let currentPage = window.location.href;
            let typeSenator = 'attendance';
            if (currentPage.includes(pathSenate)) {
                url = 'https://api.myjson.com/bins/1eja30';

            } else {
                url = 'https://api.myjson.com/bins/j83do';
            }
            fetch(url)
                .then(response => response.json())
                .then((jsonData) => {
                    data = jsonData;
                    let memberData = data.results[0].members;
                    let table1 = document.querySelector('.top');
                    let table2 = document.querySelector('.least');
                    let topEngaged = [];
                    let bottomEngaged = [];
                    if (currentPage.includes(typeSenator)) {
                        attendance(table1, table2, memberData, topEngaged, bottomEngaged)
                    } else {
                        loyalty(table1, table2, memberData, topEngaged, bottomEngaged)
                    }
                    var statistics = {
                        info: [{ label: 'Democrats', Partyinfo: { party: 'D', Memnum: 0, PctVotes: 0, } },
                        { label: 'Republicants', Partyinfo: { party: 'R', Memnum: 0, PctVotes: 0, } },
                        { label: 'Independents', Partyinfo: { party: 'I', Memnum: 0, PctVotes: 0, } },
                        { label: 'Total', Partyinfo: { party: '', Memnum: 0, PctVotes: 0, } }]
                    };
                    myFunction(memberData, statistics);
                    this.glanceStatistics = statistics.info;
                });
        },
    },
})

//Functions will be loaded first
function myFunction(memberData, statistics) {
    displayGlance();
    getNumberOfEachPartyVue(memberData, statistics);
}

//Calculate the information of each Party
function getNumberOfEachPartyVue(memberData, statistics) {
    memberData.forEach(element => {
        for (let i = 0; i < statistics.info.length; i++) {
            if (element.party === statistics.info[i].Partyinfo.party) {
                statistics.info[i].Partyinfo.Memnum += 1;
                statistics.info[i].Partyinfo.PctVotes += element.votes_with_party_pct;
            }
        }
    })

    for (let j = 0; j < statistics.info.length - 1; j++) {
        if (statistics.info[j].Partyinfo.Memnum != 0) {
            statistics.info[statistics.info.length - 1].Partyinfo.Memnum += statistics.info[j].Partyinfo.Memnum;
            statistics.info[statistics.info.length - 1].Partyinfo.PctVotes += statistics.info[j].Partyinfo.PctVotes;
            statistics.info[j].Partyinfo.PctVotes = + Number.parseFloat(statistics.info[j].Partyinfo.PctVotes / statistics.info[j].Partyinfo.Memnum).toFixed(2);
        } else {
            statistics.info[j].Partyinfo.PctVotes = 0;
        }
    }
    statistics.info[statistics.info.length - 1].Partyinfo.PctVotes = + Number.parseFloat(statistics.info[statistics.info.length - 1].Partyinfo.PctVotes / statistics.info[statistics.info.length - 1].Partyinfo.Memnum).toFixed(2);
}

//Display Header of first table --> Senate/House at a glance
function displayGlance() {
    let senateglance = document.getElementById('glance');
    let arrayHead = ['Party', 'Number of members', 'Percent of Votes'];
    let thead = senateglance.createTHead();
    thead.setAttribute('class', 'thead-dark');
    let headrow = thead.insertRow();
    arrayHead.forEach(item => {
        let headcell = document.createElement('th');
        headcell.innerHTML = item;
        headrow.append(headcell);
    })
}

//Get 10% array in general
function getTenPercentArray(array1, array2) {
    for (let i = 0; i < ((array2.length * 10) / 100); i++) {
        array1.push(array2[i]);
    }
}

//Head of 2nd row table
function displayHeadTable2(array, table) {
    let thead = table.createTHead();
    thead.setAttribute('class', 'thead-dark');
    let headrow = thead.insertRow();
    array.forEach(item => {
        let headcell = document.createElement('th');
        headcell.innerHTML = item;
        headrow.append(headcell);
    })
}

//Display Second row table Loyalty
function displaySecondRowTable(array, table) {
    let tbody = table.createTBody();
    array.forEach(mem => {
        let row = tbody.insertRow();
        let cell = row.insertCell();
        cell.innerHTML = (mem.first_name + ' ' + mem.middle_name + ' ' + mem.last_name).replace(null, ' ');
        let cell2 = row.insertCell();
        cell2.innerHTML = Math.round(((mem.total_votes - mem.missed_votes) * mem.votes_with_party_pct) / 100);
        let cell3 = row.insertCell();
        cell3.innerHTML = mem.votes_with_party_pct;
    })
}

//Display Second row table Attendance
function displaySecondRowTable2(array, table) {
    let tbody = table.createTBody();
    array.forEach(mem => {
        let row = tbody.insertRow();
        let cell = row.insertCell();
        cell.innerHTML = (mem.first_name + ' ' + mem.middle_name + ' ' + mem.last_name).replace(null, ' ');
        let cell2 = row.insertCell();
        cell2.innerHTML = mem.missed_votes;
        let cell3 = row.insertCell();
        cell3.innerHTML = mem.missed_votes_pct;
    })
}

//Call all function for ATTENDANCE
function attendance(table1, table2, memberData, topEngaged, bottomEngaged) {
    let arrayTable2Head = ['Name', 'Number of Missed Votes', 'Percent Missed Votes'];
    //Display Table 1 Row 2 - ATTENDANCE
    displayHeadTable2(arrayTable2Head, table1);
    memberData.sort(function (a, b) { return a.missed_votes - b.missed_votes });
    getTenPercentArray(topEngaged, memberData);
    displaySecondRowTable2(topEngaged, table1);
    //Display Table 2 Row 2 - ATTENDANCE
    displayHeadTable2(arrayTable2Head, table2);
    memberData.sort(function (a, b) { return b.missed_votes - a.missed_votes });
    getTenPercentArray(bottomEngaged, memberData);
    displaySecondRowTable2(bottomEngaged, table2);
}

//Call all function for LOYALTY
function loyalty(table1, table2, memberData, topEngaged, bottomEngaged) {
    let arrayTable2Head = ['Name', 'Number of Party Votes', 'Percent Party Votes'];
    ////Display Table 1 Row 2 - LOYALTY
    displayHeadTable2(arrayTable2Head, table1);
    memberData.sort(function (a, b) { return b.votes_with_party_pct - a.votes_with_party_pct });
    getTenPercentArray(topEngaged, memberData);
    displaySecondRowTable(topEngaged, table1);
    //Display Table 2 Row 2 - LOYALTY
    displayHeadTable2(arrayTable2Head, table2);
    memberData.sort(function (a, b) { return a.votes_with_party_pct - b.votes_with_party_pct });
    getTenPercentArray(bottomEngaged, memberData);
    displaySecondRowTable(bottomEngaged, table2);
}