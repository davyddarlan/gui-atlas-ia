<template>
    <modal :show="show" v-on:close="$emit('close')" :hide="!abrirNomePopular">
        <template v-slot:title>
            <p>Nome popular</p>
        </template>
        <template v-slot:body>
            <modal :show="abrirNomePopular" v-on:close="abrirNomePopular = false">
                <template v-slot:title>
                    <p>Nome popular</p>
                </template>
                <template v-slot:body>
                    <form class="ui form criar-nome-popular">
                        <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                            <div class="ui tiny text loader">Criando nome popular...</div>
                        </div>
                        <div class="field">
                            <label>Nome popular</label>
                            <input v-model="input.nomePopular" name="nomePopular" placeholder="Nome popular" />
                        </div>
                    </form>
                </template>
                <template v-slot:footer>
                    <button class="ui primary button tiny" type="submit" v-on:click="validarFormulario">Criar</button>
                </template>
            </modal>
            <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                <div class="ui tiny text loader">Associando dado...</div>
            </div>
            <input-data url="/api/especie/nome-popular/buscar-nome-popular/{query}" 
                placeholder="Buscar nome popular" title="Nome popular" v-on:choose="selecionarNomePopular" v-on:reset="input.match = null">
            </input-data>
            <div class="cpl info">
                <p class="__info">Não localizou a informação buscada? Crie um registro para ela.</p>
                <button class="__btn" v-on:click="abrirNomePopular = true">Criar</button>
            </div>
        </template>
        <template v-slot:footer>
            <button class="ui primary button tiny" :disabled="!input.match" v-on:click="associarNomePopular" type="submit">Associar</button>
        </template>
    </modal>
</template>

<script>
    import ModalComponent from '../../../components/modal/modal.vue';
    import InputDataComponent from '../../../components/input-data/input-data.vue';

    export default {
        components: {
            'modal': ModalComponent,
            'input-data': InputDataComponent,
        },
        props: {
            show: false,
            uuid: {
                type: String,
                default: null,
            },
        },
        data: function() {
            return {
                form: {
                    load: false,
                },  
                input: {
                    nomePopular: '',
                    match: null,
                },
                abrirNomePopular: false,
            }
        },
        methods: {
            criarNomePopular: function() {
                let params = new URLSearchParams();

                params.append('nome', this.input.nomePopular);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/nome-popular/criar-nome-popular',
                    data: params,
                }).then((response) => {
                    this.$emit('created', {
                    });

                    this.form.load = false;
                }).catch((error) => {
                    this.form.load = false;
                });
            },
            validarFormulario: function() {
                $('.ui.form.criar-nome-popular').form({
                    fields: {
                        nomePopular: {
                            identifier: 'nomePopular',
                            rules: [
                                { type: 'minLength[1]' },
                                { type: 'maxLength[255]' },
                            ]
                        },
                    },
                    onSuccess: (event, fields) => {
                        this.criarNomePopular();
                    }
                }).form('validate form');
            },
            selecionarNomePopular: function(dado) {
                this.input.match = dado;
            },
            associarNomePopular: function() {
                let params = new URLSearchParams();

                params.append('especie_uuid', this.uuid);
                params.append('nome_popular_id', this.input.match.id);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/nome-popular/associar-nome-popular',
                    data: params,
                }).then((response) => {
                    this.$emit('match', {
                        qtdNomesPopulares: response.data.qtd_nomes_populares,
                    });

                    this.form.load = false;
                }).catch((error) => {
                    this.form.load = false;
                });
            }
        }
    }
</script>

<style> 
    .cpl.info {
        width: 100%;
        padding: 25px 20px 25px 20px;
        background: rgba(0, 0, 0, 0.02);
        display: table;
        margin: 20px 0 0 0;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }

    .cpl.info > .__info,
    .cpl.info > .__btn  {
        float: left;
    }

    .cpl.info > .__info {
        width: calc(100% - 90px);
        font-size: 0.95em;
        padding: 0 15px 0 15px;
        line-height: 1.2em;
    }

    .cpl.info > .__btn {
        padding: 8px 25px 8px 25px;
        border-radius: 20px;
        border: none;
        font-size: 0.95em;
        background: #1e5ac3;
        color: #ffffff;
        font-weight: bold;
    }
</style>