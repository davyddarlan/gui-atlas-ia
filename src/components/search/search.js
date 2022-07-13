export default {
    props: {
        minLength: {
            type: Number,
            default: 1
        }
    },
    data: function() {
        return {
            value: '',
            botaoLimpar: false,
            results: {
                show: false,
                load: false,
                result: []
            }
        }
    },
    watch: {
        value: function(data) {
            if (data.length >= this.minLength) {
                this.buscarRegistro();
                this.botaoLimpar = true;
            } else {
                this.botaoLimpar = false;
                this.results.show = false;
            }
        },
        'results.load': function(data) {
            if (data) {
                this.botaoLimpar = false;
            } else {
                this.botaoLimpar = true;
            }
        } 
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
        primeiraLetra: function(value) {
            let spliters = value.split(' ');

            return spliters[0][0];
        },
    },
    directives: {
        colorir: function(el) {
            let value = Math.random() * 361;

            el.style.background = 'hsl(' + value + ', 73%, 44%)';
        }       
    },
    methods: {
        limparCampo: function() {
            this.value = '';
        },
        buscarRegistro: function() {
            this.results.load = true;

            this.axios({
                method: 'GET',
                url: '/api/especie/public/buscar-especie/?nome_especie=' + this.value,
            }).then((response) => {
                this.results.result = response.data;
                this.results.load = false;
                this.results.show = true;
            }).catch((error) => {
                this.results.show = true;
            });
        },
        selecionarRegistro: function(data) {
            this.results.show = false;
            this.value = '';
            this.$emit('obterRegistro', data);
        },
    }
}