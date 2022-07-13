export default {
    props: {
        placeholder: {
            type: String,
            default: 'Buscar registro',
        },
        title: {
            type: String,
            default: 'Registro'
        },
        url: {
            type: String,
            default: null,
        },
        extra: {
            type: Boolean,
            default: false,
        },
        resetData: {
            type: String,
            default: '',
        }
    },
    data: function() {
        return {
            input: '',
            controller: {
                load: false,
                clear: false,
                result: false,
                withoutData: false,
            },
            result: [],
            readInput: '',
        }
    },
    watch: {
        input: function(data) {
            if (data) {
                this.controller.clear = true;

                this.search();
            } else {
                this.controller.clear = false;
                this.controller.result = false;
                this.result = [];
            }
        },
        resetData: function(data) {
            this.reset();
        }
    },
    methods: {
        select: function(data) {
            this.readInput = data.nome;
            this.result = [];
            this.controller.result = false;

            this.$emit('choose', data);
        },
        reset: function() {
            this.input = '';
            this.readInput = '';

            this.$emit('reset');
        },
        search: function() {
            let url = this.url.replace('{query}', this.input);

            this.controller.clear = false;
            this.controller.load = true;

            this.axios.get(url).then((response) => {
                let result = response.data;

                if (result.length) {
                    this.controller.withoutData = false;
                    this.result = result;
                } else {
                    this.controller.withoutData = true;
                    this.result = [];
                }

            }).catch((error) => {

            }).finally(() => {
                this.controller.result = true;
                this.controller.clear = true;
                this.controller.load = false;
            });
        }
    }
}