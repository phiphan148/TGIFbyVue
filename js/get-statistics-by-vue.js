var data;

var byVue = new Vue({
    el: "#main-content",
    data: {
        memberData: [],
        statisticsGlance: {},
        statisticsGlanceHeader: ['Party', 'Number of members', 'Percent of votes'],
        attendanceHeader: ['Full name', 'Number of missed votes', 'Percent missed votes'],
        loyaltyHeader: ['Full name', 'Number of party votes', 'Percent party votes'],
        mostEngaged: [],
        leastEngaged: [],
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
                url = 'https://api.propublica.org/congress/v1/113/senate/members.json';

            } else {
                url = 'https://api.propublica.org/congress/v1/113/house/members.json';
            }
            fetch(url, {
                headers: new Headers({
                    'X-API-Key': 'IDNOGYtoaM3H3Og0JfELv2zGX5cPeooGRMCiUWdl'
                })
            })
                .then(response => response.json())
                .then((jsonData) => {
                    data = jsonData;
                    this.memberData = data.results[0].members;
                    if (currentPage.includes(typeSenator)) {
                        this.memberData.sort(function (a, b) { return a.missed_votes - b.missed_votes });
                        this.getCalculation(this.mostEngaged);
                        this.memberData.sort(function (a, b) { return b.missed_votes - a.missed_votes });
                        this.getCalculation(this.leastEngaged);
                    } else {
                        this.memberData.sort(function (a, b) { return b.votes_with_party_pct - a.votes_with_party_pct });
                        this.getCalculation(this.mostEngaged);
                        this.memberData.sort(function (a, b) { return a.votes_with_party_pct - b.votes_with_party_pct });
                        this.getCalculation(this.leastEngaged);
                    }
                    var statistics = {
                        info: [{ label: 'Democrats', Partyinfo: { party: 'D', Memnum: 0, PctVotes: 0, } },
                        { label: 'Republicants', Partyinfo: { party: 'R', Memnum: 0, PctVotes: 0, } },
                        { label: 'Independents', Partyinfo: { party: 'I', Memnum: 0, PctVotes: 0, } },
                        { label: 'Total', Partyinfo: { party: '', Memnum: 0, PctVotes: 0, } }]
                    };
                    this.getStatisticsGlance(this.memberData, statistics);
                    this.statisticsGlance = statistics;

                });
        },
        getStatisticsGlance: function (memberData, statistics) {
            memberData.forEach(mem => {
                for (let i = 0; i < statistics.info.length; i++) {
                    if (mem.party === statistics.info[i].Partyinfo.party) {
                        statistics.info[i].Partyinfo.Memnum += 1;
                        statistics.info[i].Partyinfo.PctVotes += mem.votes_with_party_pct;
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
        },
        getCalculation: function (array) {
            for (let i = 0; i < this.memberData.length * 0.1; i++) {
                array.push(this.memberData[i])
            }
        },
    },
})

