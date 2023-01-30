<template>
    <modal :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>Criar uma conta</p>
        </template>
        <template v-slot:body>
            <form class="ui form criar-conta">
                <div v-bind:class="{ active: form.load }" class="ui inverted dimmer">
                    <div class="ui tiny text loader">Criando conta...</div>
                </div>
                <div class="equal width fields">
                    <div class="field">
                        <label>Primeiro nome</label>
                        <input v-model="input.primeiroNome" type="text" name="primeiroNome" placeholder="Primeiro nome">
                    </div>
                    <div class="field">
                        <label>Sobrenome</label>
                        <input v-model="input.sobrenome" type="text" name="sobrenome" placeholder="Sobrenome">
                    </div>
                </div>
                <div class="equal width fields">
                    <div class="field">
                        <label>Data de Nascimento</label>
                        <imask-input mask="00/00/0000" v-model="input.dataNascimento" type="text" name="dataNascimento" placeholder="Data de nascimento" />
                    </div>
                    <div class="field">
                        <label>Sexo</label>
                        <select v-model="input.sexo" name="sexo" class="ui dropdown">
                            <option value="">Sexo</option>
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </select>
                    </div>
                </div>
                <div class="field fluid">
                    <label>Email</label>
                    <input v-model="input.email" type="text" name="email" placeholder="Email">
                </div>
                <div class="fields equal width">
                    <div class="field">
                        <label>Senha</label>
                        <input v-model="input.senha" type="password" name="senha" placeholder="Senha">
                    </div>
                    <div class="field">
                        <label>Confirmação de senha</label>
                        <input type="password" name="confirmacaoSenha" placeholder="Confirmação de senha">
                    </div>
                </div>
                <!--<div class="field">
                    <div class="ui checkbox">
                        <input v-model="input.termos" id="termos" type="checkbox" tabindex="0" class="hidden">
                        <label for="termos" >Eu aceito os termos.</label>
                        <span class="termos">Ler termos</span>
                    </div>
                </div>-->
                <div class="ui error message"></div>
            </form>
        </template>
        <template v-slot:footer>
            <button class="ui primary button tiny" v-on:click="validarFormulario" type="submit">Criar</button>
        </template>
    </modal>
</template>

<script>
    import ModalComponent from '../../../components/modal/modal.vue';
    import { IMaskComponent } from 'vue-imask';

    export default {
        components: {
            'modal': ModalComponent,
            'imask-input': IMaskComponent
        },
        props: {
            show: false,
        },
        watch: {
            show: function() {
                setTimeout(function() {
                    $('.ui.dropdown').dropdown();
                }, 100);
            }
        },
        data: function() {
            return {
                form: {
                    load: false,
                },
                input: {
                    primeiroNome: '',
                    sobrenome: '',
                    sexo: '',
                    dataNascimento: '',
                    email: '',
                    senha: '',
                    termos: false,
                },
            }
        },
        methods: {
            validarFormulario: function() {
                $('.ui.form.criar-conta').form({
                    fields: {
                        primeiroNome: {
                            identifier: 'primeiroNome',
                            rules: [
                                { 
                                    type: 'minLength[1]',
                                    prompt: 'O campo "{name}" não possui qualquer valor'
                                },
                                { 
                                    type: 'maxLength[255]',
                                    prompt: 'O campo "{name}" deve conter no máximo 255 caracteres.'
                                },
                            ]
                        },
                        sobrenome: {
                            identifier: 'sobrenome',
                            rules: [
                                { 
                                    type: 'minLength[1]',
                                    prompt: 'O campo "{name}" não possui qualquer valor'
                                },
                                {   
                                    type: 'maxLength[255]',
                                    prompt: 'O campo "{name}" deve conter no máximo 255 caracteres.'
                                }
                            ]
                        },
                        sexo: {
                            identifier: 'sexo',
                            rules: [
                                { 
                                    type: 'regExp[/^(M|F)$/]',
                                    prompt: 'Selecione uma opção para o campo "{name}"'
                                },
                            ]
                        },
                        dataNascimento: {
                            identifier: 'dataNascimento',
                            rules: [
                                { 
                                    type: 'regExp[/^(0[1-9]|1\\d|2\\d|3[01])\\/(0[1-9]|1[0-2])\\/(19|20)\\d{2}$/]',
                                    prompt: 'O valor do campo "{name}" não segue o padrão 00/00/0000'
                                },
                            ]
                        },
                        email: {
                            identifier: 'email',
                            rules: [
                                { 
                                    type: 'email',
                                    prompt: 'O valor do campo "{name}" não é válido.'
                                },
                                { 
                                    type: 'maxLength[180]',
                                    prompt: 'O campo "{name}" deve conter no máximo 180 caracteres.'
                                },
                            ]
                        },
                        senha: {
                            identifier: 'senha',
                            rules: [
                                { 
                                    type: 'regExp[/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/]',
                                    prompt : 'O campo "{name}" deve atender os seguintes requisitos: <ul class="sublist"><li>1. Pelo menos uma letra minúsculas (a-z)</li><li>2. Pelo menos uma letras maiúsculas (A-Z)</li><li>3. Um ou mais numerais</li><li>4. Pelo menos um caracter especial (!@#$%^&*)</li></ul>'
                                },
                            ]
                        },
                        confirmacaoSenha: {
                            identifier: 'confirmacaoSenha',
                            rules: [
                                { 
                                    type: 'match[senha]',
                                    prompt: 'O campo "{name}" deve conter um valor igual ao campo <b>senha</b>'
                                },
                            ]
                        }
                    },
                    onSuccess: (event, fields) => {
                        this.criarConta();
                    }
                }).form('validate form');
            },
            criarConta: function() {
                let params = new URLSearchParams();

                params.append('primeiro_nome', this.input.primeiroNome);
                params.append('sobrenome', this.input.sobrenome);
                params.append('data_nascimento', this.input.dataNascimento);
                params.append('sexo', this.input.sexo);
                params.append('email', this.input.email);
                params.append('password', this.input.senha);

                this.form.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/user/public/criar-user',
                    data: params,
                }).then((response) => {
                    this.$emit('close');

                    this.form.load = false;
                }).catch((error) => {
                    this.form.load = false;
                });
            }
        }
    }
</script>

<style>
    .ui.error.message {
        background: #fff6f6;
        border: 1px solid #9f3a38;
        border-radius: 5px;
        padding: 25px 20px 25px 20px;
        font-size: 0.85em;
        line-height: 1.2em;
    }

    .ui.error.message li { 
        margin-bottom: 15px; 
    }

    .ui.error.message li:last-child {
        margin-bottom: 0;
    }

    .ui.error.message .sublist { 
        margin-top: 10px; 
    }

    .ui.error.message .sublist li { 
        margin-bottom: 5px; 
        font-size: 0.95em;
    }

    .ui.error.message .sublist li:last-child { margin-bottom: 0; }

    .ui.form.criar-conta .termos {
        display: inline-block;
        font-size: 0.95em;
        margin-top: 5px;
        cursor: pointer;
    }

    .ui.form.criar-conta .termos:hover { text-decoration: underline; }
</style>