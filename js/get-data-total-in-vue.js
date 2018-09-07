var data;

window.app = new Vue({
    el: "#main-content",
    data: {
        senator: [],
        partyarr: ['D', 'R', 'I'],
        statesarr: [],
        checkarr: [],
        selectarr: '',
        searchName: '',
        tempt: [],
        fields: {name: {label: 'Full name', key: 'fullname',sortable: true},
                party: {label: 'Party',},
                state: {label: 'State',},
                seniority: {label: 'Senority',},
                percentageVotes: {label: 'Pct of vote',key: 'votes_with_party_pct',sortable: true}},
    },
    created: function () {
        this.getData();
    },
    computed: {
        displayParty() {
            if (this.checkarr.length == 0 && this.selectarr == '') {
                return this.searchData(this.senator);
            } else if (this.checkarr.length != 0 && this.selectarr == '') {
                this.tempt = this.senator.filter(j => this.checkarr.includes(j.party));
                return this.searchData(this.tempt)
            } else if (this.selectarr != '' && this.checkarr.length == 0) {
                this.tempt = this.senator.filter(j => this.selectarr.includes(j.state));
                return this.searchData(this.tempt)                
            } else {
                let memFilter = [];
                for (let j = 0; j < this.senator.length; j++) {
                    for (let i = 0; i < this.checkarr.length; i++) {
                        if (this.senator[j].party == this.checkarr[i] && this.senator[j].state == this.selectarr) {
                            memFilter.push(this.senator[j]);
                        }
                    }
                }
                return this.searchData(memFilter)
            }
        },
    },
    methods: {
        getData: function () {
            let pathSenate = 'senate';
            let url = '';
            let currentPage = window.location.href;
            if (currentPage.includes(pathSenate)) {
                url = 'https://api.propublica.org/congress/v1/113/senate/members.json';

            } else {
                url = 'https://api.propublica.org/congress/v1/113/house/members.json';
            }
            fetch(url, {
               headers: new Headers({
               'X-API-Key': 'IDNOGYtoaM3H3Og0JfELv2zGX5cPeooGRMCiUWdl'})
            })
                .then(response => response.json())
                .then((jsonData) => {
                    data = jsonData;
                    this.senator = data.results[0].members;
                    this.senator.forEach(mem => {
                        mem.fullname = (mem.first_name + ' ' + mem.middle_name + ' ' + mem.last_name).replace(null,'');
                    });
                    this.getStates();
                });
        },
        getStates: function () {
            for (let i = 0; i < this.senator.length; i++) {
                if (!this.statesarr.includes(this.senator[i].state)) {
                    this.statesarr.push(this.senator[i].state);
                }
            }
        },
        searchData: function(array){
            return array.filter(mem => mem.fullname.toLowerCase().includes(this.searchName.toLowerCase()) || mem.votes_with_party_pct.toString().includes(this.searchName.toLowerCase()))
        }
    },
})