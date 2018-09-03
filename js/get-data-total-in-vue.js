var data;

var byVue = new Vue({
    el: "#main-content",
    data: {
        senator: [],
        partyarr: ['D', 'R', 'I'],
        statesarr: [],
        checkarr: [],
        selectarr: '',
        headerArray: ['Full Name', 'Party', 'State', 'Seniority', 'Percentage of vote'],
    },
    created: function () {
        this.getData();
    },
    computed: {
        displayParty() {
            if (this.checkarr.length == 0 && this.selectarr == '') {
                return this.senator;
            } else if (this.checkarr.length != 0 && this.selectarr == '') {
                return this.senator.filter(j => this.checkarr.includes(j.party))
            } else if (this.selectarr != '' && this.checkarr.length == 0) {
                return this.senator.filter(j => this.selectarr.includes(j.state))
            } else {
                let memFilter = [];
                for (let j = 0; j < this.senator.length; j++) {
                    for (let i = 0; i < this.checkarr.length; i++) {
                        if (this.senator[j].party == this.checkarr[i] && this.senator[j].state == this.selectarr) {
                            memFilter.push(this.senator[j]);
                        }
                    }
                }
                return memFilter;
            }
        }
    },
    methods: {
        getData: function () {
            let pathSenate = 'senate';
            let url = '';
            let currentPage = window.location.href;
            if (currentPage.includes(pathSenate)) {
                url = 'https://api.myjson.com/bins/1eja30';

            } else {
                url = 'https://api.myjson.com/bins/j83do';
            }
            fetch(url)
                .then(response => response.json())
                .then((jsonData) => {
                    data = jsonData;
                    this.senator = data.results[0].members;
                    this.getStates();
                });
        },
        getStates: function () {
            for(let i=0; i<this.senator.length; i++){
                if (!this.statesarr.includes(this.senator[i].state)) {
                    this.statesarr.push(this.senator[i].state);
                }
            }
        }
    },

})