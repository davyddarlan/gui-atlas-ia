<template>
    <div class="app geral-conteudo">
        <estado-conservacao-modal v-on:match="atualizarEstadoConservacao" :uuid="uuid" :show="modals.estadoConservacao" v-on:close="modals.estadoConservacao = false"></estado-conservacao-modal>
        <nome-popular-modal v-on:match="atualizarQtdNomesPopulares" :uuid="uuid" :show="modals.nomePopular" v-on:close="modals.nomePopular = false"></nome-popular-modal>
        <descobridor-modal v-on:match="atualizarQtdDescobridores" :uuid="uuid" :show="modals.descobridor" v-on:close="modals.descobridor = false"></descobridor-modal>
        <marcador-modal v-on:match="atualizarQtdMarcadores" :uuid="uuid" :show="modals.marcador" v-on:close="modals.marcador = false"></marcador-modal>
        <geral-modal :dados="output" v-on:update="atualizarDadosGerais" :uuid="uuid" :show="modals.geral" v-on:close="modals.geral = false"></geral-modal>
        <lista-dados-modal :title="lists.title" :uuid="uuid" :what-list="lists.routeName" :show="modals.listaDados" v-on:close="modals.listaDados = false"></lista-dados-modal>
        <div class="__card">
            <div class="__menu" data-position="bottom right" v-show="adminRole">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div class="ui special popup">
                <ul class="__menu-list">
                    <li v-on:click="modals.estadoConservacao = true">Editar</li>
                </ul>
            </div>
            <div class="__conteudo">
                <div class="__wrapper">
                    <p class="__titulo">Estado de conservação</p>
                    <p class="__conteudo">{{ output.estadoConservacao | semDado }}</p>
                </div>
            </div>
        </div>
        <div class="__card">
            <div class="__menu" data-position="bottom right" v-show="adminRole">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div class="ui special popup">
                <ul class="__menu-list">
                    <li v-on:click="modals.geral = true">Editar</li>
                </ul>
            </div>
            <div class="__conteudo">
                <div class="__wrapper">
                    <p class="__titulo">Nome científico</p>
                    <p class="__conteudo">{{ output.nomeCientifico | semDado }}</p>
                </div>
                <div class="__wrapper">
                    <p class="__titulo">Nome em inglês</p>
                    <p class="__conteudo">{{ output.nomeIngles | semDado }}</p>
                </div>
                <div class="__wrapper">
                    <p class="__titulo">Ano de descoberta</p>
                    <p class="__conteudo">{{ output.anoDescoberta | semDado}}</p>
                </div>
            </div>
        </div>
        <div class="__card">
            <div class="__menu" data-position="bottom right" v-show="adminRole || output.qtdNomesPopulares">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div class="ui special popup">
                <ul class="__menu-list">
                    <li v-on:click="modals.nomePopular = true" v-show="adminRole">Adicionar</li>
                    <li v-on:click="openList('nome-popular')" v-show="output.qtdNomesPopulares">Listar</li>
                </ul>
            </div>
            <div class="__conteudo">
                <div class="__wrapper">
                    <p class="__titulo">Nomes populares</p>
                    <p class="__conteudo">{{ output.qtdNomesPopulares | quantificador  }}</p>
                </div>
            </div>
        </div>
        <div class="__card">
            <div class="__menu" data-position="bottom right" v-show="adminRole || output.qtdDescobridores">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div class="ui special popup">
                <ul class="__menu-list">
                    <li v-on:click="modals.descobridor = true" v-show="adminRole">Adicionar</li>
                    <li v-on:click="openList('descobridor')" v-show="output.qtdDescobridores">Listar</li>
                </ul>
            </div>
            <div class="__conteudo">
                <div class="__wrapper">
                    <p class="__titulo">Descobridores</p>
                    <p class="__conteudo">{{ output.qtdDescobridores | quantificador }}</p>
                </div>
            </div>
        </div>
        <div class="__card">
            <div class="__menu" data-position="bottom right" v-show="adminRole || output.qtdDescobridores">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div class="ui special popup">
                <ul class="__menu-list">
                    <li v-on:click="modals.marcador = true" v-show="adminRole">Adicionar</li>
                    <li v-on:click="openList('marcador')" v-show="output.qtdMarcadores">Listar</li>
                </ul>
            </div>
            <div class="__conteudo">
                <div class="__wrapper">
                    <p class="__titulo">Marcadores</p>
                    <p class="__conteudo">{{ output.qtdMarcadores | quantificador }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EstadoConservacaoModal from '../modals/estado-conservacao.vue';
    import NomePopularModal from '../modals/nome-popular.vue';
    import DescobridorModal from '../modals/descobridor.vue';
    import MarcadorModal from '../modals/marcador.vue';
    import GeralModal from '../modals/geral.vue';
    import ListaDadosModal from '../modals/lista-dados.vue';
    import RolesMixin from '../../../mixins/roles';

    export default {
        components: {
            'estadoConservacaoModal': EstadoConservacaoModal,
            'nomePopularModal' : NomePopularModal,
            'descobridorModal' : DescobridorModal,
            'marcadorModal': MarcadorModal,
            'geralModal': GeralModal,
            'listaDadosModal': ListaDadosModal
        },
        mixins: [RolesMixin],
        props: {
            uuid: {
                type: String,
                default: null,
            }
        },
        data: function() {
            return {
                modals: {
                    estadoConservacao: false,
                    geral: false,
                    nomePopular: false,
                    descobridor: false,
                    marcador: false,
                    listaDados: false,
                },
                output: {
                    estadoConservacao: '',
                    nomeCientifico: '',
                    nomeIngles: '',
                    anoDescoberta: '',
                    qtdNomesPopulares: '',
                    qtdDescobridores: '',
                    qtdMarcadores: '',
                },
                lists: {
                    routeName: null,
                    title: '',
                },
            }
        },
        mounted: function() {
            $('.app.geral-conteudo > .__card > .__menu').popup({
                on: 'click',
            });

            this.carregarDadosGerais();
        },
        filters: {
            semDado: function(value) {
                if (value) {
                    return value;
                } else {
                    return 'Não há dado associado';
                }
            },
            quantificador: function(value) {
                if (value == 0) {
                    return 'Não há dado associado';
                } else if (value > 100) {
                    return '+' + value + ' dados associados';
                } else if (value <= 100) {
                    return value;
                }
            }
        },
        methods: {
            carregarDadosGerais: function() {
                this.axios({
                    method: 'GET',
                    url: '/api/especie/exibir-dados-gerais/' + this.uuid,
                }).then((response) => {
                    this.output.estadoConservacao = response.data.estado_conservacao;
                    this.output.nomeCientifico = response.data.nome_cientifico;
                    this.output.nomeIngles = response.data.nome_ingles;
                    this.output.anoDescoberta = response.data.ano_descoberta;
                    this.output.qtdNomesPopulares = response.data.qtd_nomes_populares;
                    this.output.qtdDescobridores = response.data.qtd_descobridores;
                    this.output.qtdMarcadores = response.data.qtd_marcadores;

                    this.$emit('loaded');
                }).catch((error) => {
                    
                });
            },
            atualizarDadosGerais: function(dados) {
                this.output.nomeCientifico = dados.nomeCientifico;
                this.output.nomeIngles = dados.nomeIngles;
                this.output.anoDescoberta = dados.anoDescoberta;       

                this.$emit('update', {
                    path: 'geral',
                    data: {
                        nomeCientifico: dados.nomeCientifico,
                        nomeIngles: dados.nomeIngles,
                        anoDescoberta: dados.anoDescoberta,
                    }
                })
            },
            atualizarEstadoConservacao: function(dados) {
                this.output.estadoConservacao = dados.nome;
            },
            atualizarQtdNomesPopulares: function(dados) {
                this.output.qtdNomesPopulares = dados.qtdNomesPopulares;
            },
            atualizarQtdDescobridores: function(dados) {
                this.output.qtdDescobridores = dados.qtdDescobridores;
            },
            atualizarQtdMarcadores: function(dados) {
                this.output.qtdMarcadores = dados.qtdMarcadores;
            },
            openList: function(routeName) {
                this.lists.routeName = routeName;

                if (routeName == 'nome-popular') {
                    this.lists.title = 'Lista de nomes populares';
                } else if (routeName == 'descobridor') {
                    this.lists.title = 'Lista de descobridores';
                } else if (routeName == 'marcador') {
                    this.lists.title = 'Lista de marcadores';
                }

                this.modals.listaDados = true;
            }
        }
    }
</script>

<style>
    .app.geral-conteudo {
        width: 100%;
        height: 100%;
        padding: 20px;
        overflow: auto;
    }

    .app.geral-conteudo > .__card {
        position: relative;
        width: 100%;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        border-radius: 5px;
        display: table;
        background: #f5f5f5;
        margin: 0 0 20px 0;
    }

    .app.geral-conteudo > .__card:last-child { margin: 0; }

    .app.geral-conteudo > .__card > .__menu {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 40px;
        text-align: center;
        cursor: pointer;
        padding: 5px 5px 0 0;
    }

    .app.geral-conteudo > .__card > .__menu i {
        font-size: 1.3em;
        line-height: 40px;
    }

    .app.geral-conteudo > .__card > .ui.special.popup > .__menu-list { padding: 2px; }

    .app.geral-conteudo > .__card > .ui.special.popup > .__menu-list li {
        padding: 5px 20px 5px 10px;
        color: #000000;
        font-size: 0.82em;
        cursor: pointer;
        border-radius: 5px;
    }

    .app.geral-conteudo > .__card > .ui.special.popup > .__menu-list li:hover { background: #f5f5f5; }

    .app.geral-conteudo > .__card > .__conteudo {
        width: 100%;
        padding: 20px 25px 20px 25px;
    }

    .app.geral-conteudo > .__card > .__conteudo > .__wrapper > .__titulo {
        font-size: 0.75em;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 5px;
        color: #464646;
    }

    .app.geral-conteudo > .__card > .__conteudo > .__wrapper > .__conteudo {
        font-size: 0.9em;
        color: #727272;
        line-height: 1.3em;
    }

    .app.geral-conteudo > .__card > .__conteudo > .__wrapper { margin: 0 0 30px 0; }

    .app.geral-conteudo > .__card > .__conteudo > .__wrapper:last-child { margin: 0; }
</style>