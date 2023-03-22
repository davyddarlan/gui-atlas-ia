import cardComponent from '../../../components/card/card.vue';
import Subpage from '../subpage/subpage.vue';
import ArtigoSection from '../sections/artigo.vue';
import CladogramaSection from '../sections/cladograma.vue';
import GeralSection from '../sections/geral.vue';
import LocalizacaoSection from '../sections/localizacao.vue';
import MidiaSection from '../sections/midia.vue';
import CompartilharCardModal from '../modals/compartilhar-card.vue';
import ModalComponent from '../../../components/modal/modal.vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import RolesMixin from '../../../mixins/roles';

export default {
    props: {
        uuid: {
            type: String,
            default: null,
        },
        title: {
            type: String,
            default: ''
        },
        position: {
            type: Object,
            default(props) {
                return {
                    x: 20,
                    y: 20
                }
            }
        },
    },
    mixins: [RolesMixin],
    components: {
        'card': cardComponent,
        'subPage': Subpage,
        'artigoSection': ArtigoSection,
        'cladogramaSection': CladogramaSection,
        'geralSection': GeralSection,
        'localizacaoSection': LocalizacaoSection,
        'midiaSection': MidiaSection,
        'compartilhar-card-modal': CompartilharCardModal,
        'modal': ModalComponent,
        'cropper': Cropper,
    },
    data: function() {
        return {
            loadCard: true,
            textLoadCard: 'carregando espécie...',
            loadFile: false,
            authData: { 
                protectCard: false,
                showData: null,
            },
            card: {
                nomePopular: null,
                nomeCientifico: null,
                descricao: null,
                arte: null,
                arteFile: null,
                titleCard: this.title,
            },
            modals: {
                editarEspecie: false,
                uploadArte: false,
                compartilhar: false,
            },
            subpaginas: {
                status: false,
                titulo: '',
                conteudo: null,
                infoGeral: { 
                    titulo: 'Informações gerais',
                    class: '__perfil',
                    conteudo: GeralSection,
                },
                conteudos: [
                    { 
                        titulo: 'Cladograma',
                        class: '__cladograma',
                        conteudo: CladogramaSection,
                    },
                    { 
                        titulo: 'Mídias', 
                        class: '__midia',
                        conteudo: MidiaSection
                    },
                    { 
                        titulo: 'Artigos científicos',
                        class: '__artigos-cientificos',
                        conteudo: ArtigoSection,
                    },
                    { 
                        titulo: 'Localização',
                        class: '__localizacao',
                        conteudo: LocalizacaoSection,
                    },
                ]
            }
        }
    },
    watch: {
        '$store.state.user.status': function(data) {
            if (data) {
                this.authData.protectCard = false;
            } else {
                this.subpaginas.status = false;
            }
        },
    },
    mounted: function() {
        this.carregarDadosCard();
    },
    filters: {
        nomePopular: function(value) {
            if (value) {
                return value;
            } else {
                return 'Sem nome popular';
            }
        },
        nomeCientifico: function(value) {
            if (value) {
                let spliters = value.split(' '), text = '';

                spliters[spliters.length - 1] = (spliters[spliters.length - 1]).toLowerCase();

                spliters.forEach(function(data) {
                    text += data + ' ';
                });

                return text;
            } else {
                return 'Sem nome científico';
            }
        },
        descricao: function(value) {
            if (value) {
                return value;
            } else {
                return `
                    Ainda não há uma descrição para esta espécie, 
                    assim que possível, o autor disponibilizará um
                    texto de apresentação.
                `;
            }
        }
    },
    methods: {
        abrirSubpagina: function(conteudo) {
            if (!this.$store.state.user.status && conteudo.class != '__perfil') {
                this.authData.protectCard = true;
            } else {
                this.loadCard = true;

                this.subpaginas.status = true;
                this.subpaginas.titulo = conteudo.titulo;
                this.subpaginas.conteudo = conteudo.conteudo;
            }
        },
        fecharSubpagina: function() {
            this.subpaginas.status = false;
            this.subpaginas.titulo = '';
            this.subpaginas.conteudo = null;
        },
        carregarDadosCard: function() {
            this.loadCard = true;

            this.axios({
                method: 'GET',
                url: '/api/especie/public/exibir-principais-dados/' + this.uuid,
            }).then((response) => {
                this.card.nomePopular = response.data.nome_popular;
                this.card.nomeCientifico = response.data.nome_cientifico;
                this.card.descricao = response.data.descricao;

                if (response.data.capa) {
                    this.card.arte = response.data.capa;

                    this.carregarArte({
                        type: 'base64',
                        response: this.$store.state.baseURL + '/capas/' + response.data.capa,
                    });
                }  else {
                    this.card.arte = null;
                }

                this.loadCard = false;
            }).catch((error) => {
                this.loadCard = false;
            });
        },
        carregarArte: function(data) {
            let image = new Image;
            this.loadFile = true;

            image.onload = () => {
                this.$refs.art.style.background = 'url(' + data.response + ')';
                this.$refs.art.style.backgroundSize = 'cover';
                this.loadFile = false;
            }

            image.src = data.response;
        },
        selecionarArte: function(event) {
            let reader = new FileReader();

            reader.readAsDataURL(this.$refs.arteFile.files[0]);

            reader.onload = () => {
                this.modals.uploadArte = true;
                this.card.arteFile = reader.result;
            };

            reader.onerror = (error) => {};
        },
        enviarArte: function() {
            this.loadFile = true;

            const { canvas } = this.$refs.cropper.getResult();

            let blobBin = atob(canvas.toDataURL('image/jpeg', 1).split(',')[1]), 
            array = [], file, formData;
            
            for(let i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }

            file = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });

            formData = new FormData;

            formData.append('capa', file);
            formData.append('especie_uuid', this.uuid);

            this.axios.post('/api/especie/adicionar-capa', formData, {
                headers: {
                    'Content-Type': file.type,
                },
            }).then((response) => {
                this.loadFile = false;

                this.card.arte = response.data.nome;
                
                this.carregarArte({
                    type: 'base64',
                    response: canvas.toDataURL('image/jpeg', 1),
                });

                this.modals.uploadArte = false;
            }).catch((error) => {
                this.loadFile = false;
            });
        },
        removerArte: function() {
            this.axios.delete('/api/especie/remover-capa', {
                params: {
                    uuid: this.uuid,
                },
            }).then((response) => {
                this.card.arte = false;  
            });        
        },
        atualizarDados: function(dados) {
            this.card.nomePopular = dados.nomePopular;
            this.card.nomeCientifico = dados.nomeCientifico;
            this.card.descricao = dados.descricao;
            this.card.titleCard = dados.nomeCientifico;
        },
        updateSections(data) {
            if (data.path == 'geral') {
                this.card.nomeCientifico = data.data.nomeCientifico;
            }
        },
        minimizarCard: function(data) {
            this.$emit('minimized', {
                title: data.title,
                ref: data.ref,
                uuid: this.uuid,
            });
        },
        removerCard: function() {
            this.$emit('closed', {
                uuid: this.uuid,
            });
        },
    }
}