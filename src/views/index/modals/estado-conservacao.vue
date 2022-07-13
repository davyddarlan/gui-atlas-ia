<template>
    <modal :show="show" v-on:close="$emit('close')" :hide="!abrirCriarEstadoConservacao">
        <template v-slot:title>
            <p>Estado de conservação</p>
        </template>
        <template v-slot:body>
            <modal :show="abrirCriarEstadoConservacao" v-on:close="abrirCriarEstadoConservacao = false">
                <template v-slot:title>
                    <p>Estado de conservação</p>
                </template>
                <template v-slot:body>
                    <form class="ui form criar-estado-conservacao">
                        <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                            <div class="ui tiny text loader">Criando estado de conservação...</div>
                        </div>
                        <div class="field">
                            <label>Estado de conservação</label>
                            <input v-model="input.estadoConservacao" type="text" name="estadoConservacao" placeholder="Estado de conservação">
                        </div>
                        <div class="field">
                            <label>Mini descrição</label>
                            <textarea v-model="input.descricao" rows="3" name="descricao" placeholder="Mini descrição"></textarea>
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
            <input-data url="/api/especie/estado-conservacao/buscar-estado-conservacao/{query}" 
                placeholder="Buscar estado de conservação" title="Estado de conservação" v-on:choose="selecionarEstadoConservacao" v-on:reset="input.match = null">
            </input-data>
            <div class="cpl info">
                <p class="__info">Não localizou a informação buscada? Crie um registro para ela.</p>
                <button class="__btn" v-on:click="abrirCriarEstadoConservacao = true">Criar</button>
            </div>
        </template>
        <template v-slot:footer>
            <button class="ui primary button tiny" :disabled="!input.match" type="submit" v-on:click="associarEstadoConservacao">Associar</button>
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
                    estadoConservacao: '',
                    descricao: '',
                    match: null,
                },
                abrirCriarEstadoConservacao: false,
            }
        },
        methods: {
            criarEstadoConservacao: function() {
                let params = new URLSearchParams();

                params.append('nome', this.input.estadoConservacao);
                params.append('descricao', this.input.descricao);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/estado-conservacao/criar-estado-conservacao',
                    data: params,
                }).then((response) => {
                    this.$emit('created', {});

                    this.form.load = false;
                }).catch((error) => {
                    this.form.load = false;
                });
            },
            validarFormulario: function() {
                $('.ui.form.criar-estado-conservacao').form({
                    fields: {
                        estadoConservacao: {
                            identifier: 'estadoConservacao',
                            rules: [
                                { type: 'minLength[1]' },
                                { type: 'maxLength[255]' },
                            ]
                        },
                        descricao: {
                            identifier: 'descricao',
                            optional: true,
                            rules: [
                                { type: 'minLength[1]' },
                                { type: 'maxLength[140]' }
                            ]
                        }
                    },
                    onSuccess: (event, fields) => {
                        this.criarEstadoConservacao();
                    }
                }).form('validate form');
            },
            selecionarEstadoConservacao: function(dado) {
                this.input.match = dado;
            },
            associarEstadoConservacao: function() {
                let params = new URLSearchParams();

                params.append('especie_uuid', this.uuid);
                params.append('estado_id', this.input.match.id);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/estado-conservacao/associar-estado-conservacao',
                    data: params,
                }).then((response) => {
                    this.$emit('match', this.input.match);

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