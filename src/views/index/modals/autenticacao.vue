<template>
    <modal class="pg-autenticacao" class-name="pg-autenticacao" mini :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>{{ sections.titulo }}</p>
        </template>
        <template v-slot:body>
            <template v-if="sections.login">
                <form class="ui form login">
                    <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                        <div class="ui tiny text loader">Autenticando...</div>
                    </div>
                    <div class="field">
                        <label>Email</label>
                        <input v-model="input.email" type="text" name="email" placeholder="Email">
                    </div>
                    <div class="field">
                        <label>Senha</label>
                        <input v-model="input.senha" type="password" name="senha" placeholder="Senha">
                        <a class="__trocar-senha" href="#" v-on:click="trocarSection('novaSenha');">Esqueci a senha</a> 
                    </div>
                </form>
            </template>
            <template v-if="sections.ativar">
                <form class="ui form">
                    <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                        <div class="ui tiny text loader">Enviando email...</div>
                    </div>
                    <div class="__wrapper-ativacao">
                        <img class="__art" src="../../../assets/images/454511.png" />
                        <p class="__text">Sua conta ainda permanece inativa!
                        Clique no botão reenviar para receber um
                        novo email de ativação.</p>
                    </div>
                </form>
            </template>
            <template v-if="sections.novaSenha">
                <form class="ui form recuperar-conta">
                    <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                        <div class="ui tiny text loader">Enviado email...</div>
                    </div>
                    <div class="field">
                        <label>Email</label>
                        <input v-model="input.email" type="text" name="email" placeholder="Email">
                    </div>
                </form>
            </template>
        </template>
        <template v-slot:footer>
            <button class="ui primary button tiny" type="submit" v-on:click="validarFormulario">{{ sections.textButton }}</button>
            <button v-show="sections.section != 'login'" class="ui secondary button tiny" 
                type="submit" v-on:click="trocarSection('login')">Voltar</button>
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
                    email: '',
                    senha: '',
                },
                sections: {
                    titulo: '',
                    textButton: '',
                    login: false,
                    ativar: false,
                    novaSenha: false,
                    section: null,
                }
            }
        },
        watch: {
            show: function(data) {
                if (!data) {
                    this.trocarSection('login');
                }
            }
        },
        mounted: function() {
            this.trocarSection('login');
        },
        methods: {
            validarFormulario: function() {
                if (this.sections.section == 'login') {
                    $('.ui.form.login').form({
                        fields: {
                            email: {
                                identifier: 'email',
                                rules: [
                                    { type: 'email' },
                                    { type: 'maxLength[180]' },
                                ]
                            },
                            senha: {
                                identifier: 'senha',
                                rules: [
                                    { type: 'minLength[1]' },
                                ]
                            },
                        },
                        onSuccess: (event, fields) => {
                            this.autenticar();
                        }
                    }).form('validate form');
                } else if (this.sections.section == 'ativar') {
                    this.enviarEmail();
                } else if (this.sections.section == 'novaSenha') {
                    $('.ui.form.recuperar-conta').form({
                        fields: {
                            email: {
                                identifier: 'email',
                                rules: [
                                    { type: 'email' },
                                    { type: 'maxLength[180]' },
                                ]
                            },
                        },
                        onSuccess: (event, fields) => {
                            this.recuperarConta();
                        }
                    }).form('validate form');
                }
            },
            autenticar: function() {
                let params = new URLSearchParams();

                params.append('email', this.input.email);
                params.append('password', this.input.senha);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/user/login',
                    data: params,
                }).then((response) => {
                    this.$store.commit('setStatus', true);
                    this.$store.commit('setRole', response.data.roles);
                    this.$store.commit('setToken', response.data.token);
                    this.$store.commit('setSobrenome', response.data.sobrenome);
                    this.$store.commit('setPrimeiroNome', response.data.primeiro_nome);
                    this.$store.commit('setSexo', response.data.sexo);
                    this.$store.commit('setDataNascimento', response.data.data_nascimento);

                    this.$emit('close');

                    this.form.load = false;
                }).catch((error) => {
                    this.form.load = false;

                    if (error.response.data['code'] && error.response.data['code'] == 501) {
                        this.trocarSection('ativar');
                    }
                });
            },
            enviarEmail: function() {
                let params = new URLSearchParams();

                params.append('email', this.input.email);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/user/public/reenviar-token',
                    data: params,
                }).then((response) => {
                    this.$emit('close');

                    this.form.load = false;
                }).catch((error) => {
                    this.form.load = false;
                });
            },
            recuperarConta: function() {
                let params = new URLSearchParams();

                params.append('email', this.input.email);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/user/public/recuperar-conta',
                    data: params,
                }).then((response) => {
                    this.$emit('close');

                    this.form.load = false;
                }).catch((error) => {
                    this.form.load = false;
                });
            },
            trocarSection: function(section) {
                this.sections.login = false;
                this.sections.ativar = false;
                this.sections.novaSenha = false;

                if (section == 'login') {   
                    this.sections.titulo = 'Acesso à conta';
                    this.sections.login = true;
                    this.sections.textButton = 'Autenticar';
                    this.sections.section = section;
                } else if (section == 'ativar') {
                    this.sections.titulo = 'Ativar conta';
                    this.sections.ativar = true;
                    this.sections.textButton = 'Reenviar';
                    this.sections.section = section;
                } else if (section == 'novaSenha') {
                    this.sections.titulo = 'Esqueci minha senha';
                    this.sections.novaSenha = true;
                    this.sections.textButton = 'Enviar';
                    this.sections.section = section;
                }
            }
        }
    }
</script>

<style>
    .pg-autenticacao .__trocar-senha {
        float: right;
        margin: 10px 0 20px 0;
        color: #1e5ac3;
        text-decoration: none;
        font-size: 0.95em;
    }

    .pg-autenticacao .__wrapper-ativacao > .__text { 
        text-align: center; 
        margin-top: 15px;
        line-height: 1.3em;
    }

    .pg-autenticacao .__wrapper-ativacao > .__art {
        display: block;
        width: 180px;
        margin: 0 auto;
    }
</style> 