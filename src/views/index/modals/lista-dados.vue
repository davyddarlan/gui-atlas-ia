<template>
    <modal class-name="lista-modal" :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>{{ title }}</p>
        </template>
        <template v-slot:body>
            <div class="__wrapper-list">
                <div v-for="lista in lista" class="ui left icon label">
                    <i class="close icon"></i>
                    {{ lista.title }}
                </div>
            </div>
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
            whatList: {
                type: String,
                default: null,
            },
            title: {
                type: String,
                default: 'Sem título',
            }
        },
        data: function() {
            return {
                lista: null,
            }
        },
        watch: {
            show: function(dado) {
                if (dado) {
                    this.carregarLista(this.whatList);
                }
            },
        },
        methods: {
            carregarLista: function(whatList) {
                let url = null;

                switch (whatList) {
                    case 'nome-popular':
                        url = '/api/especie/nome-popular/listar-nome-popular/' + this.uuid;
                    break;
                    case 'descobridor':
                        url = '/api/especie/descobridor/listar-descobridor/' + this.uuid;
                    break;
                    case 'marcador':
                        url = '/api/especie/marcador/listar-marcador/' + this.uuid;
                    break;
                }

                this.axios({
                    method: 'GET',
                    url: url,
                }).then((response) => {
                    this.lista = response.data.itens;
                }).catch((error) => {
                    
                });
            },
        }
    }
</script>

<style>
    .lista-modal .__wrapper-list {
        overflow-y: auto;
        max-height: 122.8px;
        padding-right: 15px;
    }

    .lista-modal .__wrapper-list .ui.label { margin: 5px; }
</style>