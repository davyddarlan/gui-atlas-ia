<template>
    <modal :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>Editar dados</p>
        </template>
        <template v-slot:body>
            <form class="ui form editar-dados-card">
                <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                    <div class="ui tiny text loader">Editando dados...</div>
                </div>
                <div class="equal width fields">
                    <div class="field">
                        <label>Nome científico</label>
                        <input ref="nomeCientifico" :value="dados.nomeCientifico" type="text" name="nomeCientifico" placeholder="Nome científico">
                    </div>
                    <div class="field">
                        <label>Nome popular</label>
                        <input ref="nomePopular" :value="dados.nomePopular" type="text" name="nomePopular" placeholder="Nome popular">
                    </div>
                </div>
                <div class="field">
                    <label>Mini descrição</label>
                    <textarea ref="descricao" :value="dados.descricao" rows="3" name="descricao" placeholder="Mini descrição"></textarea>
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <button v-bind:class="{ disabled: form.load }" class="ui primary button tiny" v-on:click="validarFormularioCard" type="submit">Editar</button>
        </template>
    </modal>
</template>

<script>
    import ModalComponent from '../../../components/modal/modal.vue';

    export default {
        components: {
            'modal': ModalComponent,
        },
        props: {
            show: false,
            uuid: {
                type: String,
                default: null,
            },
            dados: {
                type: Object,
                default: function() {
                    return {
                        nomeCientifico: null,
                        nomePopular: null,
                        descricao: null
                    }
                }
            }
        },
        data: function() {
            return {
                form: {
                    load: false,
                },
            }
        },
        methods: {
            validarFormularioCard: function() {
                $('.ui.form.editar-dados-card').form({
                    fields: {
                        nomeCientifico: {
                            identifier: 'nomeCientifico',
                            rules: [
                                { type: 'minLength[1]' },
                                { type: 'maxLength[255]' },
                            ]
                        },
                        nomePopular: {
                            identifier: 'nomePopular',
                            optional: true,
                            rules: [
                                { type: 'minLength[1]' },
                                { type: 'maxLength[255]' }
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
                        this.alterarDadosCard();
                    }
                }).form('validate form');
            },
            alterarDadosCard: function() {
                let dados = this.pegarDados();
                let params = new URLSearchParams();

                params.append('especie_uuid', this.uuid);
                params.append('nome_cientifico', dados.nomeCientifico);
                params.append('nome_popular', dados.nomePopular);
                params.append('descricao', dados.descricao);

                this.form.load = true;

                this.axios({
                    method: 'PUT',
                    url: '/api/especie/alterar-dados-especie',
                    data: params,
                }).then((response) => {
                    this.$emit('update', {
                        nomeCientifico: response.data.nome_cientifico,
                        nomePopular: response.data.nome_popular,
                        descricao: response.data.descricao
                    });

                    this.form.load = false;
                    this.$emit('close');
                }).catch((error) => {
                    this.form.load = false;
                });
            },
            pegarDados: function() {
                return {
                    nomeCientifico: this.$refs.nomeCientifico.value,
                    nomePopular: this.$refs.nomePopular.value,
                    descricao: this.$refs.descricao.value
                }
            }
        },
    }
</script>