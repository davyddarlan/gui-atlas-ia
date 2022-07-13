<template>
    <modal :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>Dados da mídia</p>
        </template>
        <template v-slot:body>
            <form class="ui form editar-midia">
                <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                    <div class="ui tiny text loader">Editando mídia...</div>
                </div>
                <div class="field">
                    <label>Nome científico</label>
                    <input v-model="dados.titulo" type="text" name="titulo" placeholder="Título">
                </div>
                <div class="field">
                    <label>Descrição</label>
                    <textarea v-model="dados.descricao" rows="3" name="descricao" placeholder="Descrição"></textarea>
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <button v-bind:class="{ disabled: form.load }" class="ui primary button tiny" type="submit" v-on:click="validarFormulario">Editar</button>
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
            url: {
                type: String,
                default: null,
            },
            id: {
                type: Number,
                default: null,
            },
            dados: {
                type: Object,
                default: function() {
                    return {
                        titulo: '',
                        descricao: '',
                    }
                }
            },
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
                $('.ui.form.editar-midia').form({
                    fields: {
                        titulo: {
                            identifier: 'titulo',
                            rules: [
                                { type: 'maxLength[255]' },
                            ]
                        },
                        descricao: {
                            identifier: 'descricao',
                            rules: [
                                { type: 'maxLength[140]' },
                            ]
                        }
                    },
                    onSuccess: (event, fields) => {
                        this.alterarMidia();
                    }
                }).form('validate form');
            },
            alterarMidia: function() {
                let params = new URLSearchParams();
                
                params.append('nome', this.url);
                params.append('titulo', this.dados.titulo);
                params.append('descricao', this.dados.descricao);

                this.form.load = true;

                this.axios({
                    method: 'PUT',
                    url: '/api/especie/multimidia/editar-dados-principais',
                    data: params,
                }).then((response) => {
                    this.form.load = false;

                    this.$emit('put', {
                        id: this.id,
                        titulo: response.data.titulo,
                        descricao: response.data.descricao,
                    });

                    this.$emit('close');
                }).catch((error) => {
                    this.form.load = false;
                });
            },
        }
    }
</script>