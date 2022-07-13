<template>
    <modal :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>Criar espécie</p>
        </template>
        <template v-slot:body>
            <form class="ui form criacao-especie">
                <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                    <div class="ui tiny text loader">Criando espécie...</div>
                </div>
                <div class="equal width fields">
                    <div class="field">
                        <label>Nome científico</label>
                        <input v-model="input.nomeCientifico" type="text" name="nomeCientifico" placeholder="Nome científico">
                    </div>
                    <div class="field">
                        <label>Nome popular</label>
                        <input v-model="input.nomePopular" type="text" name="nomePopular" placeholder="Nome popular">
                    </div>
                    <div class="field">
                        <label>Nome em inglês</label>
                        <input v-model="input.nomeIngles" type="text" name="nomeIngles" placeholder="Nome em inglês">
                    </div>
                </div>
                <div class="equal width fields">
                    <div class="field">
                        <label>Nome do descobridor</label>
                        <input v-model="input.nomeDescobridor" type="text" name="nomeDescobridor" placeholder="Nome do descobridor">
                    </div>
                    <div class="field">
                        <label>Ano de descoberta</label>
                        <input v-model="input.anoDescoberta" type="text" name="anoDescoberta" placeholder="Ano de descoberta">
                    </div>
                </div>
                <div class="field">
                    <label>Mini descrição</label>
                    <textarea v-model="input.descricao" rows="3" name="descricao" placeholder="Mini descrição"></textarea>
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <button class="ui primary button tiny" v-on:click="validarFormularioEspecie" type="submit">Criar</button>
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
        },
        data: function() {
            return {
                form: {
                    load: false,
                },
                input: {
                    nomeCientifico: '',
                    nomePopular: '',
                    nomeIngles: '',
                    nomeDescobridor: '',
                    anoDescoberta: '',
                    descricao: ''
                }
            }
        },
        methods: {
            validarFormularioEspecie: function() {
                $('.ui.form.criacao-especie').form({
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
                        nomeIngles: {
                            identifier: 'nomeIngles',
                            optional: true,
                            rules: [
                                { type: 'minLength[1]' },
                                { type: 'maxLength[255]' }
                            ]
                        },
                        nomeDescobridor: {
                            identifier: 'nomeDescobridor',
                            optional: true,
                            rules: [
                                { type: 'minLength[1]' },
                                { type: 'maxLength[255]' }
                            ]
                        },
                        anoDescoberta: {
                            identifier: 'anoDescoberta',
                            optional: true,
                            rules: [
                                { type: 'regExp[/^\\d{4}$/]' }
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
                        this.criarEspecie();
                    }
                }).form('validate form');
            },
            criarEspecie: function() {
                let params = new URLSearchParams();

                params.append('nome_cientifico', this.input.nomeCientifico);
                params.append('nome_popular', this.input.nomePopular);
                params.append('nome_ingles', this.input.nomeIngles);
                params.append('nome_descobridor', this.input.nomeDescobridor);
                params.append('ano_descoberta', this.input.anoDescoberta);
                params.append('descricao', this.input.descricao);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/criar-especie',
                    data: params,
                }).then((response) => {
                    $('.ui.modal.criacao-especie').modal('hide');

                    this.$emit('created', {
                        uuid: response.data.uuid,
                        title: response.data.nome_cientifico,
                    });
                    
                    this.$emit('close');
                    this.form.load = false;
                }).catch((error) => {
                    this.form.load = false;
                });
            }
        }
    }
</script>