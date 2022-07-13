<template>
    <modal class-name="pg-ativacao-conta" mini :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>Ativação de conta</p>
        </template>
        <template v-slot:body>
            <div class="__wrapper-ativacao">
                <div class="__load" v-show="load">
                    <div class="ui active inline loader"></div>
                    <p class="__text">Obtendo o resultado...</p>
                </div>
                <div class="__success" v-show="ativado && !load">
                    <img class="__art" src="../../../assets/images/895641.png" />
                    <p class="__text">É isso ai! A sua conta foi ativada com sucesso. 
                    Agora você já pode se autenticar.</p>
                </div>
                <div class="__error" v-show="!ativado && !load">
                    <img class="__art" src="../../../assets/images/632313.png" />
                    <p class="__text">Infelizmente a solicitação não pôde ser atentidade.
                    Possivelmente o token atingiu a data de validade. Solicite o envio de um 
                    novo toquem.</p>
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
            token: {
                type: String,
                default: '',
            }
        },
        data: function() {
            return {
                load: true,
                ativado: false,
            }
        },
        watch: {
            show: function(data) {
                if (!data) {
                    this.load = true;
                    this.ativado = false;
                } else {
                    this.ativarConta();
                }
            },
        },
        methods: {
            ativarConta: function() {
                this.axios({
                    method: 'GET',
                    url: '/api/especie/user/public/ativar-conta/' + this.token,
                }).then((response) => {
                    this.load = false;
                    this.ativado = true;
                }).catch((error) => {
                    this.load = false;
                    this.ativado = false;
                });
            }
        }
    }
</script>

<style>
    .pg-ativacao-conta .__trocar-senha {
        float: right;
        margin: 10px 0 20px 0;
        color: #1e5ac3;
        text-decoration: none;
        font-size: 0.95em;
    }

    .pg-ativacao-conta .__wrapper-ativacao > .__success > .__text,
    .pg-ativacao-conta .__wrapper-ativacao > .__error > .__text { 
        text-align: center; 
        margin-top: 15px;
        line-height: 1.3em;
        width: 95%;
    }

    .pg-ativacao-conta .__wrapper-ativacao > .__success > .__art,
    .pg-ativacao-conta .__wrapper-ativacao > .__error > .__art {
        display: block;
        width: 180px;
        margin: 0 auto;
    }

    .pg-ativacao-conta .__load {
        width: 100%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .pg-ativacao-conta .__load > .__text { margin-top: 20px; }
</style> 