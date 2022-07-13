<template>
    <modal class-name="pg-ativacao-conta" mini :show="show" v-on:close="$emit('close')">
        <template v-slot:title>
            <p>Alterar senha</p>
        </template>
        <template v-slot:body>
            <form class="ui form alterar-senha">
                <div v-bind:class="{ active: load }" class="ui inverted dimmer">
                    <div class="ui tiny text loader">Criando senha...</div>
                </div>
                <div class="field">
                    <label>Nova senha</label>
                    <input type="password" v-model="input.novaSenha" name="senha" placeholder="Nova senha" />
                </div>
                <div class="field">
                    <label>Repetir senha</label>
                    <input type="password" name="confirmacaoSenha" placeholder="Repetir senha" />
                </div>
            </form>
        </template>
        <template v-slot:footer>
            <button v-bind:class="{ disabled: load }" class="ui primary button tiny" v-on:click="validarFormularioCard" type="submit">Alterar senha</button>
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
                load: false,
                input: {
                    novaSenha: '',
                },
            }
        },
        watch: {},
        methods: {
            validarFormularioCard: function() {
                $('.ui.form.alterar-senha').form({
                    fields: {
                        senha: {
                            identifier: 'senha',
                            rules: [
                                { type: 'regExp[/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/]' }
                            ]
                        },
                        confirmacaoSenha: {
                            identifier: 'confirmacaoSenha',
                            rules: [
                                { type: 'match[senha]' },
                            ]
                        }
                    },
                    onSuccess: (event, fields) => {
                        this.trocarSenha();
                    }
                }).form('validate form');
            },
            trocarSenha: function() {
                let params = new URLSearchParams();

                params.append('password', this.input.novaSenha);
                params.append('token', this.token);

                this.load = true;

                this.axios({
                    method: 'POST',
                    url: '/api/especie/user/public/recuperar-senha',
                    data: params,
                }).then((response) => {
                    this.$emit('close');

                    this.load = false;
                }).catch((error) => {
                    this.load = false;
                });
            },
        }
    }
</script>

<style></style> 