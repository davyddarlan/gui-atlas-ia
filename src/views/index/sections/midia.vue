<template>
    <div class="app midia-conteudo">
        <showMidia :show="modals.midia" v-on:close="modals.midia = false" :url="urlModal" :dados="midias[idMidia]"></showMidia>
        <editar-midia-modal v-on:put="editarDadosMidia" :show="modals.editarMidia" 
            v-on:close="modals.editarMidia = false" :url="urlModal" 
            :id="idMidia" :dados="midias[idMidia]"></editar-midia-modal>
        <marcadorImagemModal :id="idResource" :show="modals.marcador" v-on:close="modals.marcador = false"></marcadorImagemModal>
        <modal  :show="modals.apagarMidia" v-on:close="modals.apagarMidia = false" close-button>
            <template v-slot:title>
                <p>Apagar mídia</p>
            </template>
            <template v-slot:body>
                <p>Você está certo de que a mídia deve ser apagada?</p>
            </template>
            <template v-slot:footer>
                <button v-on:click="solicarRemocaoMidia" class="ui primary button tiny" type="submit">Apagar</button>
                <button v-on:click="modals.apagarMidia = false" class="ui secondery button tiny" type="submit">Cancelar</button>
            </template>
        </modal>
        <div class="__sem-midia" v-show="!midias.length">
            <div class="__logo"></div>
            <p class="__message">
                Ainda não há qualquer conteúdo 
                para esta área temática
            </p>
            <label :for="uuid" v-show="adminRole">Adicionar mídia</label>
            <input v-show="adminRole" ref="arquivos" v-on:change="carregarArquivos" type="file" :id="uuid" multiple />
        </div>
        <div class="__com-midia" v-if="midias.length">
            <label class="__upload-box" :for="uuid" :key="'upload-label'" v-show="adminRole">
                <i class="fa-solid fa-arrow-up-from-bracket"></i>
                <p>Importar mídia</p>
            </label>
            <div class="__box" v-for="(midia, index) in midias">
                <div class="__load" v-show="midia.type == 'upload' && midia.load">
                    <div class="ui active inline loader"></div>
                    <div class="__text">{{ midia.progress }}</div>
                </div>
                <div class="__error" v-show="midia.type == 'error'">
                    <i class="close fa-solid fa-xmark" v-on:click="removerMidiaFluxo(index)"></i>
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <p>Falha no upload!</p>
                </div>
                <div class="__default" v-if="midia.type == 'load'">
                    <div class="__menu" data-position="bottom right">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                    <div class="ui special popup">
                        <ul class="__menu-list">
                            <li v-on:click="abrirMidia(midia, index)">Abrir</li>
                            <li v-on:click="editarMidia(midia, index)" v-show="adminRole">Editar dados</li>
                            <li v-on:click="apagarMidia(midia, index)" v-show="adminRole">Apagar mídia</li>
                            <li v-on:click="adicionarMarcador(midia)" v-show="adminRole" v-if="getType(index) == 'jpeg'">Marcadores</li>
                        </ul>
                    </div>
                    <i v-bind:class="{'fa-file-audio': getType(index) == 'mp3', 
                        'fa-file-image': getType(index) == 'jpeg', 
                        'fa-film': getType(index) == 'mp4'}" 
                        class="fa-solid __icon"></i>
                    <div v-bind:class="{'mp3': getType(index) == 'mp3', 
                        'jpeg': getType(index) == 'jpeg', 
                        'mp4': getType(index) == 'mp4'}" 
                        class="__formato">
                            <template v-if="getType(index) == 'mp4'">Vídeo</template>
                            <template v-if="getType(index) == 'jpeg'">Imagem</template>
                            <template v-if="getType(index) == 'mp3'">Áudio</template>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>    
    import ShowMidia from '../modals/midia.vue';
    import EditarMidiaModal from '../modals/editar-midia.vue';
    import Modal from '../../../components/modal/modal.vue';
    import RolesMixin from '../../../mixins/roles';
    import MarcadorImagemModal from '../modals/marcador-imagem.vue';

    export default {
        components: {
            'showMidia': ShowMidia,
            'editarMidiaModal': EditarMidiaModal,
            'marcadorImagemModal': MarcadorImagemModal,
            'modal': Modal,
        },
        props: {
            uuid: {
                type: String,
                default: null,
            },
            nomeCientifico: {
                type: String,
                default: null,
            }
        },
        mixins: [RolesMixin],
        data: function() {
            return {
                midias: [],
                modals: {
                    midia: false,
                    editarMidia: false,
                    apagarMidia: false,
                    marcador: false,
                },
                urlModal: null,
                idMidia: null,
                idResource: null,
            }
        },
        mounted: function() {
            setInterval(function() {
                $('.app.midia-conteudo .__box .__menu').popup({
                    on: 'click',
                });
            }, 100);

            this.carregarMidias();
        },  
        methods: {
            carregarMidias: function() {
                this.axios({
                    method: 'GET',
                    url: '/api/especie/multimidia/listar-midias/' + this.uuid,
                }).then((response) => {
                    let midias = response.data, 
                    midia = null, formato = null;

                    midias.forEach((data) => {
                        this.midias.push({
                            type: 'load',
                            url: data.nome,
                            titulo: data.titulo,
                            descricao: data.descricao,
                            id: data.id,
                            nomeCientifico: this.nomeCientifico,
                        });
                    });

                    this.$emit('loaded');
                }).catch((error) => {
                    
                });
            },
            encaminharServidor: function(midia) {
                let formData = new FormData();

                formData.append('arquivo', midia.file);
                formData.append('especie_uuid', this.uuid);
                
                this.axios.post('/api/especie/multimidia/adicionar-midia', formData, {
                    headers: {
                        'Content-Type': midia.file.type
                    },
                    onUploadProgress: (event) => {
                        this.midias[midia.index].progress = (event.loaded / event.total * 100).toFixed(0) + '%';
                    },
                }).then((response) => {
                    this.midias[midia.index].load = false;
                    this.midias[midia.index].type = 'load';
                    this.midias[midia.index].url = response.data.file;
                }).catch((error) => {
                    this.midias[midia.index].type = 'error';
                });
            },
            carregarArquivos: function() {
                let inputFile = null, index = 0;

                inputFile = this.$refs.arquivos.files;

                while (index != inputFile.length) { 
                    let midia = {
                        type: 'upload',
                        file: inputFile[index],
                        index: index,
                        load: true,
                        url: null,
                        progress: 0,
                    };

                    this.midias.unshift(midia);

                    this.encaminharServidor(midia);

                    index++;
                }
            },
            abrirMidia: function(midia, index) {
                this.modals.midia = true;
                this.urlModal = midia.url;
                this.idMidia = index;
            },
            editarMidia: function(midia, index) {
                this.modals.editarMidia = true;
                this.urlModal = midia.url;
                this.idMidia = index;
            },
            apagarMidia: function(midia, index) {
                this.modals.apagarMidia = true;
                this.urlModal = midia.url;
                this.idMidia = index;
            },
            adicionarMarcador: function(midia) {
                this.modals.marcador = true;
                this.idResource = midia.id;
            },
            editarDadosMidia: function(dados) {
                this.midias[dados.id].titulo = dados.titulo;
                this.midias[dados.id].descricao = dados.descricao;
            },
            solicarRemocaoMidia: function() {
                this.axios({
                    method: 'DELETE',
                    url: '/api/especie/multimidia/apagar-midia/' + this.urlModal,
                }).then((response) => {
                    this.midias.splice(this.idMidia, 1);
                    this.modals.apagarMidia = false;
                }).catch((error) => {
                    this.modals.apagarMidia = false;
                });
            },
            getType: function(index) {
                let type = this.midias[index].url;
                
                type = type.split('.');
                type = type[type.length - 1];

                return type;
            },
            removerMidiaFluxo: function(index) {
                this.midias.splice(index, 1);
            }
        }
    }
</script>

<style>
    .app.midia-conteudo {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 20px 20px 0 20px;
        overflow: auto;
    }

    .app.midia-conteudo > .__sem-midia {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100% !important;
    }

    .app.midia-conteudo > .__sem-midia > .__logo {
        width: 100px;
        height: 100px;
        background: url(../../../assets/images/545646.png);
        background-size: 100px;
        margin: 0 0 10px 0;
    }

    .app.midia-conteudo > .__sem-midia > .__message {
        width: 250px;
        text-align: center; 
        font-size: 0.9em;
        margin: 10px 0 15px 0;
        line-height: 1.3em;
    }

    .app.midia-conteudo > .__sem-midia > input[type="file"] { display: none; }

    .app.midia-conteudo > .__sem-midia > label {
        background: #1ec376;
        font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: bold;
        cursor: pointer;
        padding: 0.78571429em 1.5em 0.78571429em;
        font-size: 0.85714286rem;
        border-radius: 5px;
        color: #ffffff;
        border: none;
    }

    /* area com conteudo */

    .app.midia-conteudo > .__com-midia { 
        width: 100%;
        height: calc(100% - 100px);
        display: table;
    }

    .app.midia-conteudo > .__com-midia > .__box  {
        position: relative;
        float: left;
        width: calc(50% - 10px);
        height: 150px;
        border-radius: 5px;
        background: #f1f1f1;
        transition: transform 1s;
    }

    .app.midia-conteudo > .__com-midia > .__upload-box {
        position: relative;
        float: left;
        width: 100%;
        height: 80px;
        background: #f1f1f1;
        transition: transform 1s;
        border-radius: 5px;
        margin-bottom: 20px;
    }

    .app.midia-conteudo > .__com-midia > .__upload-box { 
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: #464646; 
        font-size: 1.1em;
        cursor: pointer;
    }

    .app.midia-conteudo > .__com-midia > .__upload-box i { 
        color: #ffffff; 
        margin-bottom: 10px;
    }

    .app.midia-conteudo > .__com-midia > .__upload-box p { 
        color: #ffffff; 
        font-size: 0.8em;
        font-weight: bold;
    }
    
    .app.midia-conteudo > .__com-midia > .__box:nth-child(odd) { margin: 0 0 20px 20px; } 

    .app.midia-conteudo > .__com-midia > .__box:last-child { margin-bottom: 20px; } 

    .app.midia-conteudo > .__com-midia > .__box > .__load,
    .app.midia-conteudo > .__com-midia > .__box > .__error,
    .app.midia-conteudo > .__com-midia > .__box > .__default {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .app.midia-conteudo > .__com-midia > .__box > .__error { 
        background: #f1b0b0; 
        color: #ffffff;
        border-radius: 5px;
    }

    .app.midia-conteudo > .__com-midia > .__box > .__error p {
        font-weight: bold;
        color: #ffffff;
        font-size: 0.8em;
    }

    .app.midia-conteudo > .__com-midia > .__box > .__error i { 
        font-size: 2.1em; 
        margin-bottom: 10px;
        color: #c31e1e;
    }

    .app.midia-conteudo > .__com-midia > .__box > .__error .close {
        position: absolute;
        top: 8px;
        right: 10px;
        font-size: 1.3em;
        cursor: pointer;
        color: #464646;
    }

    .app.midia-conteudo > .__com-midia > .__box > .__load > .__text { margin-top: 20px; }

    .app.midia-conteudo > .__com-midia > .__box > .__default { position: relative; }

    .app.midia-conteudo > .__com-midia > .__box > .__default > .__icon { font-size: 1.5em; }

    .app.midia-conteudo > .__com-midia > .__box > .__default > .__formato {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: #1e5ac3;
        padding: 6px 8px 6px 8px;
        border-radius: 5px;
        font-weight: bold;
        font-size: 0.8em;
        color: #ffffff;
    }

    .app.midia-conteudo > .__com-midia > .__box > .__default > .__formato.mp4 { background: #1e5ac3; }

    .app.midia-conteudo > .__com-midia > .__box > .__default > .__formato.mp3 { background: #c32d1e; }

    .app.midia-conteudo > .__com-midia > .__box > .__default > .__formato.jpeg { background: #c31e90; }

    .app.midia-conteudo .__box .__menu {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 40px;
        text-align: center;
        cursor: pointer;
        padding: 5px 5px 0 0;
    }

    .app.midia-conteudo .__box .__menu i {
        font-size: 1.3em;
        line-height: 40px;
    }

    .app.midia-conteudo .__box .__menu-list { padding: 2px; }

    .app.midia-conteudo .__box .__menu-list li {
        padding: 5px 20px 5px 10px;
        color: #000000;
        font-size: 0.82em;
        cursor: pointer;
        border-radius: 5px;
    }

    .app.midia-conteudo .__box .__menu-list li:hover { background: #f5f5f5; }
</style>