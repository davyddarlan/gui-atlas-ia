<template>
    <modal :show="show" v-on:close="$emit('close')" :hide="!abrirMarcador">
        <template v-slot:title>
            <p>Marcador</p>
        </template>
        <template v-slot:body>
            <modal :show="abrirMarcador" v-on:close="abrirMarcador = false">
                <template v-slot:title>
                    <p>Marcador</p>
                </template>
                <template v-slot:body>
                    <form class="ui form criar-marcador">
                        <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                            <div class="ui tiny text loader">Criando marcador...</div>
                        </div>
                        <div class="field">
                            <label>Nome do marcador</label>
                            <input v-model="input.nomeMarcador" name="nomeMarcador" placeholder="Nome do marcador" />
                        </div>
                        <div class="field">
                            <label>Mini descrição</label>
                            <textarea v-model="input.descricao" rows="3" name="descricao" placeholder="Mini descrição"></textarea>
                        </div>
                        <div class="field">
                            <label>Cor do marcador</label>
                            <input v-model="input.colors.hex" name="corMarcador" placeholder="Cor do marcador" />
                            <color-picker v-model="input.colors" class="__color-picker" />
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
            <input-data url="/api/especie/marcador/buscar-marcador/{query}" 
                placeholder="Buscar marcador" title="Nome do marcador" v-on:choose="selecionarMarcador" v-on:reset="input.match = null">
            </input-data>
            <div class="cpl info">
                <p class="__info">Não localizou a informação buscada? Crie um registro para ela.</p>
                <button class="__btn" v-on:click="abrirMarcador = true">Criar</button>
            </div>
        </template>
        <template v-slot:footer>
            <button class="ui primary button tiny" :disabled="!input.match" v-on:click="associarMarcador" type="submit">Associar</button>
        </template>
    </modal>
</template>

<script>
    import ModalComponent from '../../../components/modal/modal.vue';
    import InputDataComponent from '../../../components/input-data/input-data.vue';
    import { Slider } from 'vue-color'

    export default {
        components: {
            'modal': ModalComponent,
            'input-data': InputDataComponent,
            'color-picker': Slider
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
                    nomeMarcador: '',
                    descricao: '',
                    colors: {
                        hex: '#194d33',
                    },
                    match: null,
                },
                abrirMarcador: false,
            }
        },
        methods: {
            criarMarcador: function() {
                let params = new URLSearchParams();

                params.append('nome', this.input.nomeMarcador);
                params.append('descricao', this.input.descricao);
                params.append('cor_marcador', this.input.colors.hex);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/marcador/criar-marcador',
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
                $('.ui.form.criar-marcador').form({
                    fields: {
                        nomeMarcador: {
                            identifier: 'nomeMarcador',
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
                        },
                        corMarcador: {
                            identifier: 'corMarcador',
                            optional: true,
                            rules: [
                                { type: 'regExp[/^#[0-9A-Fa-f]{6}$/]' },
                            ]
                        }
                    },
                    onSuccess: (event, fields) => {
                        this.criarMarcador();
                    }
                }).form('validate form');
            },
            selecionarMarcador: function(dado) {
                this.input.match = dado;
            },
            associarMarcador: function() {
                let params = new URLSearchParams();

                params.append('especie_uuid', this.uuid);
                params.append('marcador_id', this.input.match.id);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/marcador/associar-marcador',
                    data: params,
                }).then((response) => {
                    this.$emit('match', {
                        qtdMarcadores: response.data.qtd_marcadores,
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

    .ui.form.criar-marcador .__color-picker {
        width: 100%;
        margin: 10px 0 0 0;
    }
</style>