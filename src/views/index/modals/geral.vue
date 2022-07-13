<template>
    <modal :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>Dados gerais</p>
        </template>
        <template v-slot:body>
            <form class="ui form editar-dados-card">
                <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                    <div class="ui tiny text loader">Editando dados...</div>
                </div>
                <div class="equal width fields">
                    <div class="field">
                        <label>Nome científico</label>
                        <input :value="dados.nomeCientifico" ref="nomeCientifico" type="text" name="nomeCientifico" placeholder="Nome científico">
                    </div>
                    <div class="field">
                        <label>Ano de descoberta</label>
                        <input :value="dados.anoDescoberta" ref="anoDescoberta" type="text" name="anoDescoberta" placeholder="Ano de descoberta">
                    </div>
                </div>
                <div class="field">
                    <label>Nome em inglês</label>
                    <input :value="dados.nomeIngles" ref="nomeIngles" type="text" name="nomeIngles" placeholder="Nome em inglês">
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <button v-bind:class="{ disabled: form.load }" class="ui primary button tiny" v-on:click="validarFormulario" type="submit">Editar</button>
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
                        nomeIngles: null,
                        anoDescoberta: null
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
            validarFormulario: function() {
                $('.ui.form.editar-dados-card').form({
                    fields: {
                        nomeCientifico: {
                            identifier: 'nomeCientifico',
                            rules: [
                                { type: 'minLength[1]' },
                                { type: 'maxLength[255]' },
                            ]
                        },
                        anoDescoberta: {
                            identifier: 'anoDescoberta',
                            optional: true,
                            rules: [
                                { type: 'regExp[/^\\d{4}$/]' },
                            ]
                        },
                        nomeIngles: {
                            identifier: 'nomeIngles',
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
                params.append('nome_ingles', dados.nomeIngles);
                params.append('ano_descoberta', dados.anoDescoberta);

                this.form.load = true;

                this.axios({
                    method: 'PUT',
                    url: '/api/especie/alterar-dados-gerais',
                    data: params,
                }).then((response) => {
                    this.$emit('update', {
                        nomeCientifico: response.data.nome_cientifico,
                        nomeIngles: response.data.nome_ingles,
                        anoDescoberta: response.data.ano_descoberta
                    });

                    this.form.load = false;
                }).catch((error) => {
                    this.form.load = false;
                });
            },
            pegarDados: function() {
                return {
                    nomeCientifico: this.$refs.nomeCientifico.value,
                    anoDescoberta: this.$refs.anoDescoberta.value,
                    nomeIngles: this.$refs.nomeIngles.value
                }
            }
        }
    }
</script>