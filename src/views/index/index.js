import SearchComponent from '../../components/search/search.vue';
import CriacaoEspecieModal from './modals/criacao-especie.vue';
import CriacaoContaModal from './modals/criacao-conta.vue';
import AutenticacaoModal from './modals/autenticacao.vue';
import AlteracaoSenhaModal from './modals/alteracao-senha.vue';
import AtivacaoContaModal from './modals/ativar-conta.vue';
import UserModal from './modals/user.vue';
import Card from './card/card.vue';
import Splide from '@splidejs/splide';
import RolesMixin from '../../mixins/roles';

export default {
    components: {
        'search': SearchComponent,
        'card': Card,
        'criacao-especie-modal': CriacaoEspecieModal,
        'criacao-conta-modal': CriacaoContaModal,
        'autenticacao-modal': AutenticacaoModal,
        'alteracao-senha-modal': AlteracaoSenhaModal,
        'user-modal': UserModal,
        'ativacao-conta-modal': AtivacaoContaModal,
    },
    data: function() {
        return {
            cards: [],
            modals: {
                criarEspecie: false,
                criarConta: false,
                login: false,
                user: false,
                ativacaoConta: false,
                esqueciSenha: false,
            },
            showElements: false,
            sectionUserModal: '',
        }
    },
    mixins: [RolesMixin],
    watch: {
        '$store.state.user.status': function(data) {
            this.showElements = data;
        },
        '$route.params.id': function(data) {
            this.carregarCardRota();
        },
    },
    filters: {
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
    },
    mounted: function() {
        this.axios.interceptors.response.use((response) => {
            let config = {
                title: 'Tudo certo!',
                message: 'Sua solicitação foi atendida.',
                class: 'success-toast'
            };

            let method = response.config.method;

            if (method == 'post' || method == 'put' || method == 'delete') {
                this.createToast(config);
            }

            return Promise.resolve(response);
        }, (error) => {
            let config = {
                title: 'Aconteceu algo de errado! :(',
                message: '',
                class: 'error-toast'
            };

            let response = error.response;
            
            if (response.status == 401){
                config.message = response.data.message;

                this.createToast(config);
            } else {
                this.createToast(config);
            }

            return Promise.reject(error);
        });

        this.carregarCardRota();
        this.ativarConta();
        this.alterarSenha();
    },
    computed: {
        boxCards: function() {
            let hiddenCards = 0;

            this.cards.forEach(element => {
                if (element.status == 'HIDDEN') {
                    hiddenCards++;
                }
            });

            return hiddenCards;
        },
    },
    methods: {
        carregarCardRota: function() {
            if (this.$route.params.id) {
                this.axios({
                    method: 'GET',
                    url: '/api/especie/public/verificar-especie/' + this.$route.params.id,
                }).then((response) => {
                    this.abrirCard({
                        title: response.data.nome,
                        uuid: this.$route.params.id,
                    });
                }).catch((error) => {});
            }
        },
        ativarConta: function() {
            let ativarConta = this.$route.query.ativar_conta;

            if (ativarConta) {
                this.modals.ativacaoConta = true;
            }
        },
        alterarSenha: function() {
            let esqueciSenha = this.$route.query.esqueci_senha;

            if (esqueciSenha) {
                this.modals.esqueciSenha = true;
            }
        },
        abrirCard: function(data) {
            let isThere = false;
            let position = this.positionManager();

            if (this.cards.length == 10) {
                this.createToast({
                    title: 'Acima do limite!',
                    message: 'O limite máximo de cards abertos e fechados é 10.',
                    class: 'error-toast'
                });
            } else {
                if (!this.cards.length) {
                    this.cards.push({
                        uuid: data.uuid,
                        title: data.title,
                        ref: null,
                        status: 'VISIBLE',
                        position: {
                            x: position.x,
                            y: position.y
                        },
                    });  
                } else {
                    for (let i = 0; i < this.cards.length; i++) {
                        if (this.cards[i].uuid == data.uuid) {
                            this.createToast({
                                title: 'Card redundante!',
                                message: 'O card selecionado já se encontra disponível. Verifique se ele está na caixa de minimização',
                                class: 'error-toast'
                            });

                            isThere = true;

                            break;
                        }
                    }

                    if (!isThere) {
                        this.cards.push({
                            uuid: data.uuid,
                            title: data.title,
                            ref: null,
                            status: 'VISIBLE',
                            position: {
                                x: position.x,
                                y: position.y
                            }
                        }); 
                    } 
                }
            }
        },
        minimizarCard: function(data) {
            this.cards.forEach(element => {
                if (data.uuid == element.uuid) {
                    element.ref = data.ref;
                    element.status = 'HIDDEN';
                }
            });
        },
        maximizarCard: function(data) {
            data.ref.showCard = true;
            data.status = 'VISIBLE';
        },
        removerCard: function(data) {
            data.ref.close();
        },
        deleteCardVector: function(data) {
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].uuid == data.uuid) {
                    this.cards.splice(i, 1);
                    break;
                }
            }
        },
        selecionarCard: function(data) {
            this.abrirCard({
                uuid: data.uuid,
                title: data.nome_cientifico,
            });
        },
        createToast: function(config) {
            $('body').toast({
                displayTime: 5000,
                class : config.class,
                position: 'bottom right',
                title: config.title,
                message: config.message
            });
        },
        openUserModal: function(section) {
            this.sectionUserModal = section;
            this.modals.user = true;
        },
        positionManager: function() {
            let x, y, overflowX, overflowY,
                isLimitedX, isLimitedY;

            const MAX_WIDTH = 330, MAX_HEIGHT = 600, 
                LIMIT_POSITION = 20, PADDING = 20;

            x = Math.floor(Math.random() * innerWidth);
            y = Math.floor(Math.random() * innerHeight);

            overflowY = innerHeight - y;
            overflowX = innerWidth - x;
            
            isLimitedX = MAX_WIDTH - overflowX;
            isLimitedY = MAX_HEIGHT - overflowY;

            if (isLimitedX > 0) {
                x = x - isLimitedX - PADDING;
            } else if (x < LIMIT_POSITION) {
                x = (LIMIT_POSITION - x) + x;
            }

            if (isLimitedY > 0) {
                y = y - isLimitedY - PADDING;
            } else if (y < LIMIT_POSITION) {
                y = (LIMIT_POSITION - y) + y;
            }

            let position = {
                x, y
            };

            return position;
        },
        orderStackCards: function(data) {
            let cardPosition, i, card,
            lengthCards = this.cards.length;

            for (i = 0; i < lengthCards; i++) {
                if (data == this.cards[i].uuid) {
                    cardPosition = i;
                    break;
                }
            }

            card = this.cards[cardPosition];
            
            this.cards.push(card);
            this.cards.splice(cardPosition, 1);
        },
        logout: function() {
            this.axios({
                method: 'DELETE',
                url: '/api/especie/user/apagar-token/' + this.$store.state.user.token,
            }).then((response) => {
                this.$store.commit('setRole', '');
                this.$store.commit('setSobrenome', '');
                this.$store.commit('setPrimeiroNome', '');
                this.$store.commit('setSexo', '');
                this.$store.commit('setDataNascimento', '');
                this.$store.commit('setStatus', false);

                localStorage.removeItem('__token');
            }).catch((error) => {});
        }
    }
}