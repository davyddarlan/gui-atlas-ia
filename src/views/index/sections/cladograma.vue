<template>
    <div class="app cladograma-conteudo">
        <modal class-name="cladograma-conteudo" :show="modals.adicionarFluxograma" v-on:close="modals.adicionarFluxograma = false" :hide="!modals.criarFluxograma">
            <template v-slot:title>
                <p>Associar cladograma</p>
            </template>
            <template v-slot:body>
                <modal :show="modals.criarFluxograma" v-on:close="modals.criarFluxograma = false">
                    <template v-slot:title>
                        <p>Criar {{ currentSection }}</p>
                    </template>
                    <template v-slot:body>
                        <form class="ui form clado">
                            <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                                <div class="ui tiny text loader">Criando {{ currentSection }}...</div>
                            </div>
                            <div class="field">
                                <label>Nome</label>
                                <input v-model="input.nome" name="nome" placeholder="Digite um nome" />
                            </div>
                        </form>
                    </template>
                    <template v-slot:footer>
                        <button class="ui primary button tiny" v-on:click="validarFormulario" type="submit">Criar</button>
                    </template>
                </modal>
                <div class="ui">
                    <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                        <div class="ui tiny text loader">Associando dado...</div>
                    </div>
                    <select name="fluxograma" class="ui fluid dropdown">
                        <option value="">Escolha um clado</option>
                        <option value="reino">Reino</option>
                        <option value="filo">Filo</option>
                        <option value="divisao">Divisão</option>
                        <option value="classe">Classe</option>
                        <option value="subclasse">Subclasse</option>
                        <option value="ordem">Ordem</option>
                        <option value="familia">Família</option>
                        <option value="subfamilia">Subfamília</option>
                        <option value="genero">Gênero</option>
                    </select>
                    <input-data :reset-data="resetSearch" :url="urlSearch" v-show="showInputSearch.adicionarFluxograma" 
                        :placeholder="placeholders.adicionarFluxograma" v-on:reset="input.id = null" v-on:choose="chooseData"></input-data>
                    <div class="cpl info">
                        <p class="__info">Não localizou a informação buscada? Crie um registro para ela.</p>
                        <button class="__btn" :disabled="!urlSearch" v-on:click="modals.criarFluxograma = true">Criar</button>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <button class="ui primary button tiny" :disabled="!input.id" type="submit" v-on:click="associarClado">Associar</button>
            </template>
        </modal>
        <div class="__card">
            <div class="__menu" data-position="bottom right" v-show="adminRole">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div class="ui special popup">
                <ul class="__menu-list">
                    <li v-on:click="modals.adicionarFluxograma = true">Editar</li>
                </ul>
            </div>
            <div class="__conteudo">
                <div class="__wrapper" v-for="filogenia in filogenia">
                    <p class="__titulo">{{ filogenia.titulo }}</p>
                    <p class="__conteudo">{{ filogenia.data | dataFilogenia }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ModalComponent from '../../../components/modal/modal.vue';
    import InputDataComponent from '../../../components/input-data/input-data.vue';
    import RolesMixin from '../../../mixins/roles';

    export default {
        components: {
            'modal': ModalComponent,
            'inputData': InputDataComponent,
        },
        props: {
            uuid: {
                type: String,
                default: null,
            }
        },
        mixins: [RolesMixin],
        data: function() {
            return {
                filogenia: [
                    { titulo: 'Reino', data: '' },
                    { titulo: 'Filo', data: '' },
                    { titulo: 'Divisão', data: '' },
                    { titulo: 'Classe', data: '' },
                    { titulo: 'Subclasse', data: '' },
                    { titulo: 'Ordem', data: '' },
                    { titulo: 'Família', data: '' },
                    { titulo: 'Subfamília', data: '' },
                    { titulo: 'Gênero', data: '' },
                ],
                modals: {
                    adicionarFluxograma: false,
                    criarFluxograma: false,
                },
                form: {
                    load: false,
                },
                placeholders: {
                    adicionarFluxograma: '',
                },
                showInputSearch: {
                    adicionarFluxograma: false,
                },
                input: {
                    id: null,
                    nome: '',
                },
                urls: {
                    reino: '/reino/buscar-reino/{query}',
                    filo: '/filo/buscar-filo/{query}',
                    divisao: '/divisao/buscar-divisao/{query}',
                    classe: '/classe/buscar-classe/{query}',
                    subclasse: '/subclasse/buscar-subclasse/{query}',
                    ordem: '/ordem/buscar-ordem/{query}',
                    familia: '/familia/buscar-familia/{query}',
                    subfamilia: '/subfamilia/buscar-subfamilia/{query}',
                    genero: '/genero/buscar-genero/{query}',
                },
                urlSearch: '',
                resetSearch: '',
                currentSection: '',
                createUrl: {
                    reino: '/reino/criar-reino',
                    filo: '/filo/criar-filo',
                    divisao: '/divisao/criar-divisao',
                    classe: '/classe/criar-classe',
                    subclasse: '/subclasse/criar-subclasse',
                    ordem: '/ordem/criar-ordem',
                    familia: '/familia/criar-familia',
                    subfamilia: '/subfamilia/criar-subfamilia',
                    genero: '/genero/criar-genero',
                },
                currentCreateUrl: '',
                currentValue: '',
            };
        },
        watch: {
            'modals.adicionarFluxograma': function() {
                setTimeout(() => {
                    $('.ui.dropdown').dropdown({
                        onChange: (value, text, $choice) => {
                            this.placeholders.adicionarFluxograma = 'Buscar ' + text.toLowerCase();
                            this.currentSection = text.toLowerCase();
                            this.showInputSearch.adicionarFluxograma = true;

                            this.urlSearch = '/api/especie/cladograma' + this.urls[value];
                            this.currentCreateUrl = '/api/especie/cladograma' + this.createUrl[value];

                            this.currentValue = value;
                        }	
                    });
                }, 100);
            },
            urlSearch: function(data) {
                this.resetSearch = data;
            },
        },
        filters: {
            dataFilogenia: function(data) {
            if (data) {
                    return data;
                } else {
                    return 'Não há dado associado';
                }
            },
        },
        mounted: function() {
            this.carregarDados();

            $('.app.cladograma-conteudo > .__card > .__menu').popup({
                on: 'click',
            });
        },
        methods: {
            chooseData: function(data) {
                this.input.id = data.id;
            },
            validarFormulario: function() {
                $('.ui.form.clado').form({
                    fields: {
                        nome: {
                            identifier: 'nome',
                            rules: [
                                { type: 'minLength[1]' },
                                { type: 'maxLength[255]' },
                            ]
                        },
                    },
                    onSuccess: (event, fields) => {
                        this.criarClado();
                    }
                }).form('validate form');
            },
            criarClado: function() {
                let params = new URLSearchParams();

                params.append('nome', this.input.nome);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: this.currentCreateUrl,
                    data: params,
                }).then((response) => {
                    this.form.load = false;

                    this.input.nome = '';
                }).catch((error) => {
                    this.form.load = false;
                });
            },
            carregarDados: function() {
                this.axios({
                    method: 'GET',
                    url: '/api/especie/cladograma/obter-cladograma/' + this.uuid,
                }).then((response) => {
                    this.filogenia[0].data = response.data.reino;
                    this.filogenia[1].data = response.data.filo;
                    this.filogenia[2].data = response.data.divisao;
                    this.filogenia[3].data = response.data.classe;
                    this.filogenia[4].data = response.data.subclasse;
                    this.filogenia[5].data = response.data.ordem
                    this.filogenia[6].data = response.data.familia;
                    this.filogenia[7].data = response.data.subfamilia;
                    this.filogenia[8].data = response.data.genero;

                    this.$emit('loaded');
                }).catch((error) => {
                    
                });
            },
            associarClado: function() {
                let params = new URLSearchParams();

                params.append('uuid_especie', this.uuid);
                params.append('id_clado', this.input.id);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/cladograma/associar-clado/' + this.currentValue,
                    data: params,
                }).then((response) => {
                    switch (this.currentValue) {
                        case 'reino':
                            this.filogenia[0].data = response.data.nome;
                        break;
                        case 'filo':
                            this.filogenia[1].data = response.data.nome;
                        break;
                        case 'divisao':
                            this.filogenia[2].data = response.data.nome;
                        break;
                        case 'classe':
                            this.filogenia[3].data = response.data.nome;
                        break;
                        case 'subclasse':
                            this.filogenia[4].data = response.data.nome;
                        break;
                        case 'ordem':
                            this.filogenia[5].data = response.data.nome;
                        break;
                        case 'familia':
                            this.filogenia[6].data = response.data.nome;
                        break;
                        case 'subfamilia':
                            this.filogenia[7].data = response.data.nome;
                        break;
                        case 'genero':
                            this.filogenia[8].data = response.data.nome;
                        break;
                    }

                    this.form.load = false;

                    this.input.nome = '';
                }).catch((error) => {
                    this.form.load = false;
                });
            },
        }
    }
</script>

<style> 
    .app.cladograma-conteudo {
        width: 100%;
        height: 100%;
        padding: 20px;
        overflow: auto;
    }

    .app.cladograma-conteudo > .__card {
        position: relative;
        width: 100%;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        border-radius: 5px;
        display: table;
        background: #f5f5f5;
        margin: 0 0 20px 0;
    }

    .app.cladograma-conteudo > .__card:last-child { margin: 0; }

    .app.cladograma-conteudo > .__card > .__menu {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 40px;
        text-align: center;
        cursor: pointer;
        padding: 5px 5px 0 0;
    }

    .app.cladograma-conteudo > .__card > .__menu i {
        font-size: 1.3em;
        line-height: 40px;
    }

    .app.cladograma-conteudo > .__card > .ui.special.popup > .__menu-list { padding: 2px; }

    .app.cladograma-conteudo > .__card > .ui.special.popup > .__menu-list li {
        padding: 5px 20px 5px 10px;
        color: #000000;
        font-size: 0.82em;
        cursor: pointer;
        border-radius: 5px;
    }

    .app.cladograma-conteudo > .__card > .ui.special.popup > .__menu-list li:hover { background: #f5f5f5; }

    .app.cladograma-conteudo > .__card > .__conteudo { width: 100%; }

    .app.cladograma-conteudo > .__card > .__conteudo > .__wrapper > .__titulo {
        font-size: 0.75em;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 5px;
        color: #464646;
    }

    .app.cladograma-conteudo > .__card > .__conteudo > .__wrapper > .__conteudo {
        font-size: 0.9em;
        color: #727272;
        line-height: 1.3em;
    }

    .app.cladograma-conteudo > .__card > .__conteudo > .__wrapper { 
        width: 100%;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        padding: 15px 25px 15px 25px;
    }

    .app.cladograma-conteudo > .__card > .__conteudo > .__wrapper:last-child { 
        margin: 0; 
        border-bottom: none;
    }

    .cladograma-conteudo .ui.dropdown {
        position: relative;
        z-index: 10;
        margin-bottom: 20px;
    }

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

    .cpl.info > .__btn:disabled { background: #94afde; }
</style>