export default {
    props: {
        minLength: {
            type: Number,
            default: 1,
        }
    },
    data: function() {
        return {
            input: '',
            status: {
                close: false,
                openSearch: false,
            },
            results: {
                show: false,
                load: false,
                result: []
            },
        }
    },
    mounted: function() {
        this.toggleSearchEvent();
    },
    filters: {
        formatoCientifico: function(value) {
            let spliters = value.split(' '), text = '';

            spliters[spliters.length - 1] = (spliters[spliters.length - 1]).toLowerCase();

            spliters.forEach(function(data) {
                text += data + ' ';
            });

            return text;
        },
    },
    watch: {
        input: function(data) { 
            if (data.length >= this.minLength) {
                this.status.close = true;
                this.searchEntity();
            } else {
                this.status.close = false;
            }
        },
        'status.openSearch': function(data) {
            if (!data) {
                this.results.show = false;
            }
        },
        'status.close': function(data) {
            if (!data) {
                this.results.show = false;
            }
        }
    },
    methods: {
        clearInput: function() { this.input = ''; },
        toggleSearch: function() {
            this.status.openSearch = !this.status.openSearch ? true : false;
        },
        toggleSearchEvent: function() {
            this.$refs.wrapperAnimation.addEventListener('transitionend', () => {
                if (!this.status.openSearch) {
                    this.clearInput();
                }
            });
        },
        searchEntity: function() {
            this.results.load = true;

            this.axios({
                method: 'GET',
                url: '/api/especie/public/buscar-especie/?nome_especie=' + this.input,
            }).then((response) => {
                this.results.result = response.data;
                this.results.load = false;
                this.results.show = true;
            }).catch((error) => {
                this.results.show = true;
            });
        },
        selectEntity: function(data) {
            this.status.openSearch = false;
            this.input = '';
            this.$emit('getEntity', data);
        },
    }
}