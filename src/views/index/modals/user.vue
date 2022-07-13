<template>
    <modal :show="show" v-on:close="$emit('close')" :hide="!abrirUser">
        <template v-slot:title>
            {{ sections.currentTitle}}
        </template>
        <template v-slot:body>
            <template v-if="sections.currentPage == 'perfil'">
                <form class="ui form editar-perfil">
                    <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                        <div class="ui tiny text loader">Editando perfil...</div>
                    </div>
                    <div class="equal width fields">
                        <div class="field">
                            <label>Primeiro nome</label>
                            <input v-model="input.perfilSection.primeiroNome" type="text" name="primeiroNome" placeholder="Primeiro nome">
                        </div>
                        <div class="field">
                            <label>Sobrenome</label>
                            <input v-model="input.perfilSection.sobrenome" type="text" name="sobrenome" placeholder="Sobrenome">
                        </div>
                    </div>
                    <div class="equal width fields">
                        <div class="field">
                            <label>Data de Nascimento</label>
                            <imask-input mask="00/00/0000" v-model="input.perfilSection.dataNascimento" type="text" name="dataNascimento" placeholder="Data de nascimento" />
                        </div>
                        <div class="field">
                            <label>Sexo</label>
                            <select v-model="input.perfilSection.sexo" name="sexo" class="ui dropdown">
                                <option value="">Sexo</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>
                    </div>
                </form>
            </template>
            <template v-if="sections.currentPage == 'senha'">
                <div class="equal width fields">
                    <form class="ui form alterar-senha">
                        <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                            <div class="ui tiny text loader">Alterando senha...</div>
                        </div>
                        <div class="field">
                            <label>Senha anterior</label>
                            <input v-model="input.senhaSection.senhaAnterior" type="password" name="senhaAnterior" placeholder="Senha anterior">
                        </div>
                        <div class="equal width fields">
                            <div class="field">
                                <label>Nova senha</label>
                                <input v-model="input.senhaSection.novaSenha" type="password" name="novaSenha" placeholder="Nova senha">
                            </div>
                            <div class="field">
                                <label>Repetir nova senha</label>
                                <input type="password" name="repetirNovaSenha" placeholder="Repetir nova senha">
                            </div>
                        </div>
                    </form>
                </div>
            </template>
            <template v-if="sections.currentPage == 'token'">
                <p>token</p>
            </template>
        </template>
        <template v-slot:footer>
            <button class="ui primary button tiny" type="submit" v-on:click="validar">{{ sections.titleBtnSection }}</button>
        </template>
    </modal>
</template>

<script>
    import ModalComponent from '../../../components/modal/modal.vue';
    import InputDataComponent from '../../../components/input-data/input-data.vue';
    import { IMaskComponent } from 'vue-imask';

    export default {
        components: {
            'modal': ModalComponent,
            'input-data': InputDataComponent,
            'imask-input': IMaskComponent,
        },
        props: {
            show: false,
            uuid: {
                type: String,
                default: null,
            },
            section: {
                type: String,
                default: '',
            }
        },
        data: function() {
            return {
                form: {
                    load: false,
                },  
                input: {
                    nomePopular: '',
                    match: null,
                },
                abrirUser: false,
                sections: {
                    currentTitle: '',
                    currentPage: '',
                    titleBtnSection: '',
                },
                input: {
                    perfilSection: {
                        primeiroNome: '',
                        sobrenome: '',
                        dataNascimento: '',
                        sexo: '',
                    },
                    senhaSection: {
                        senhaAnterior: '',
                        senhaAtual: ''
                    }
                },
            }
        },
        watch: {
            show: function() {
                setTimeout(function() {
                    $('.ui.dropdown').dropdown();
                }, 100);
            },
            section: function(data) {
                switch (data) {
                    case 'perfil':
                        this.sections.currentTitle = 'Editar perfil';
                        this.sections.titleBtnSection = 'Editar';

                        this.input.perfilSection.primeiroNome = this.$store.state.user.primeiroNome;
                        this.input.perfilSection.sobrenome = this.$store.state.user.sobrenome;
                        this.input.perfilSection.dataNascimento = this.$store.state.user.dataNascimento;
                        this.input.perfilSection.sexo = this.$store.state.user.sexo;
                    break;
                    case 'senha':
                        this.sections.currentTitle = 'Alterar senha';
                        this.sections.titleBtnSection = 'Alterar';
                    break;
                    case 'token':
                        this.sections.currentTitle = 'Gerenciar tokens';
                        this.sections.titleBtnSection = 'Provisório';
                    break;
                }

                this.sections.currentPage = data;
            },
        },
        methods: {
            validar: function() {
                switch (this.section) {
                    case 'perfil':
                        $('.ui.form.editar-perfil').form({
                            fields: {
                                primeiroNome: {
                                    identifier: 'primeiroNome',
                                    rules: [
                                        { type: 'minLength[1]' },
                                        { type: 'maxLength[255]' },
                                    ]
                                },
                                sobrenome: {
                                    identifier: 'sobrenome',
                                    rules: [
                                        { type: 'minLength[1]' },
                                        { type: 'maxLength[255]' }
                                    ]
                                },
                                sexo: {
                                    identifier: 'sexo',
                                    rules: [
                                        { type: 'regExp[/^(M|F)$/]' },
                                    ]
                                },
                                dataNascimento: {
                                    identifier: 'dataNascimento',
                                    rules: [
                                        { type: 'regExp[/^(0[1-9]|1\\d|2\\d|3[01])\\/(0[1-9]|1[0-2])\\/(19|20)\\d{2}$/]' },
                                    ]
                                },
                            },
                            onSuccess: (event, fields) => {
                                let params = new URLSearchParams();

                                params.append('primeiro_nome', this.input.perfilSection.primeiroNome);
                                params.append('sobrenome', this.input.perfilSection.sobrenome);
                                params.append('sexo', this.input.perfilSection.sexo);
                                params.append('data_nascimento', this.input.perfilSection.dataNascimento);

                                this.form.load = true;

                                this.axios({
                                    method: 'PUT',
                                    url: '/api/especie/user/editar-perfil',
                                    data: params,
                                }).then((response) => {
                                    this.$store.state.user.primeiroNome = response.data.primeiro_nome;
                                    this.$store.state.user.sobrenome = response.data.sobrenome;
                                    this.$store.state.user.sexo = response.data.sexo;
                                    this.$store.state.user.dataNascimento = response.data.data_nascimento;

                                    this.form.load = false;
                                }).catch((error) => {
                                    this.form.load = false;
                                });
                            }
                        }).form('validate form');
                    break;
                    case 'senha':
                        $('.ui.form.alterar-senha').form({
                            fields: {
                                senhaAnterior: {
                                    identifier: 'senhaAnterior',
                                    rules: [
                                        { type: 'minLength[1]' }
                                    ]
                                },
                                novaSenha: {
                                    identifier: 'novaSenha',
                                    rules: [
                                        { type: 'regExp[/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/]' }
                                    ]
                                },
                                repetirNovaSenha: {
                                    identifier: 'repetirNovaSenha',
                                    rules: [
                                        { type: 'match[novaSenha]' },
                                    ]
                                }
                            },
                            onSuccess: (event, fields) => {
                                let params = new URLSearchParams();

                                params.append('senhaAnterior', this.input.senhaSection.senhaAnterior);
                                params.append('novaSenha', this.input.senhaSection.novaSenha);

                                this.form.load = true;

                                this.axios({
                                    method: 'PUT',
                                    url: '/api/especie/user/alterar-senha',
                                    data: params,
                                }).then((response) => {
                                    this.form.load = false;
                                }).catch((error) => {
                                    this.form.load = false;
                                });
                            }
                        }).form('validate form');
                    break;
                }
            }
        }
    }
</script>

<style></style>