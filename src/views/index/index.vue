<template>
    <div class="index-page">
        <template v-for="card in cards">
            <card v-bind:key="card.uuid" v-on:initMove="orderStackCards" :position="card.position" v-on:minimized="minimizarCard" 
                v-on:closed="deleteCardVector" :title="card.title" 
                :uuid="card.uuid" v-on:login="modals.login = true"></card>
        </template>
        <div class="index head">
            <div class="__dropdown-menu first" v-show="showElements">
                <div class="__profile">
                    <div class="__title">
                        <div class="__avatar">
                            <img src="../../assets/images/454541.png" />
                        </div>
                        <div class="__username">{{ $store.state.user.primeiroNome }}</div>
                    </div>
                </div>
                <ul class="__options">
                    <li class="__option" v-on:click="openUserModal('perfil')">
                        <i class="fa-solid fa-user"></i>
                        Editar perfil
                    </li>
                    <li class="__option" v-on:click="openUserModal('senha')">
                        <i class="fa-solid fa-key"></i>
                        Alterar senha
                    </li>
                    <!--<li class="__option" v-on:click="openUserModal('token')">
                        <i class="fa-solid fa-passport"></i>
                        Tokens
                    </li>-->
                    <li class="__option" v-on:click="logout">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        Sair
                    </li>
                </ul>
            </div>
            <a v-on:click="modals.login = true" href="#" class="index-head menu-button first" v-show="!showElements">Autentique-se</a>
            <ul class="index-head menu">
                <li class="index-head menu-item">
                    <div class="__box-itens">
                        <div class="__facede-box">
                            <span v-show="boxCards" class="__counter-itens">{{ boxCards }}</span>
                            <i class="fa-solid fa-box-open"></i>
                        </div>
                        <div class="__space"></div>
                        <div class="__wrapper-results">
                            <div class="__without-data" v-show="!boxCards">
                                Não há qualquer card
                                na caixa!
                            </div>
                            <div class="__with-data" v-show="boxCards">
                                <p class="__title">Lista de cards</p>
                                <ul class="__list">
                                    <template v-for="(card, index) in cards">
                                        <li v-on:click="maximizarCard(card)" class="__item" v-if="card.status == 'HIDDEN'">
                                            <span>{{ card.title | nomeCientifico }}</span>
                                            <i v-on:click="removerCard(card)" class="fa-solid fa-xmark"></i>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
                <li v-show="showElements" class="index-head menu-item">
                    <a v-show="adminRole" v-on:click="modals.criarEspecie = true" href="#" class="index-head menu-button">Adicionar espécie</a>
                </li>
                <li v-show="!showElements" class="index-head menu-item">
                    <a v-on:click="modals.criarConta = true" href="#" class="index-head menu-button">Criar uma conta</a>
                </li>
                <li v-show="!showElements" class="index-head menu-item">
                    <a v-on:click="modals.login = true" href="#" class="index-head menu-button">Autentique-se</a>
                </li>
                <li v-show="showElements" class="index-head menu-item">
                    <div class="__dropdown-menu">
                        <div class="__profile">
                            <div class="__title">
                                <div class="__avatar">
                                    <img src="../../assets/images/454541.png" />
                                </div>
                                <div class="__username">{{ $store.state.user.primeiroNome }}</div>
                            </div>
                        </div>
                        <ul class="__options">
                            <li class="__option" v-on:click="openUserModal('perfil')">
                                <i class="fa-solid fa-user"></i>
                                Editar perfil
                            </li>
                            <li class="__option" v-on:click="openUserModal('senha')">
                                <i class="fa-solid fa-key"></i>
                                Alterar senha
                            </li>
                            <!--<li class="__option" v-on:click="openUserModal('token')">
                                <i class="fa-solid fa-passport"></i>
                                Tokens
                            </li>-->
                            <li class="__option" v-on:click="logout">
                                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                Sair
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div class="index body">
            <div class="index-body banner">
                <h1 class="index-body banner-brand">Atlas iA</h1>
                <search class="index-body banner-search" v-on:obterRegistro="selecionarCard"></search>
            </div>
        </div>
        <criacao-especie-modal v-on:close="modals.criarEspecie = false" :show="modals.criarEspecie"></criacao-especie-modal>
        <criacao-conta-modal v-on:close="modals.criarConta = false" :show="modals.criarConta"></criacao-conta-modal>
        <autenticacao-modal v-on:close="modals.login = false" :show="modals.login"></autenticacao-modal>
        <user-modal v-on:close="modals.user = false" :show="modals.user" :section="sectionUserModal"></user-modal>
        <ativacao-conta-modal v-on:close="modals.ativacaoConta = false" :show="modals.ativacaoConta" :token="$route.query.ativar_conta"></ativacao-conta-modal>
        <alteracao-senha-modal v-on:close="modals.esqueciSenha = false" :show="modals.esqueciSenha" :token="$route.query.esqueci_senha"></alteracao-senha-modal>
        <portal-target name="body" multiple></portal-target>
        <portal-target name="sidebar"></portal-target>
    </div>
</template>

<script src="./index.js"></script>
<style src="./index.css"></style>