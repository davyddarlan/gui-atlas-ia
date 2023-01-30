<template>
    <div class="index-page">
        <side-menu v-on:press="chooseItemMenu" :open="openSideMenu" v-on:close="openSideMenu = false"></side-menu>
        <template v-for="card in cards">
            <card v-bind:key="card.uuid" v-on:initMove="orderStackCards" :position="card.position" v-on:minimized="minimizarCard" 
                v-on:closed="deleteCardVector" :title="card.title" 
                :uuid="card.uuid" v-on:logar="modals.login = true" v-on:autenticar="modals.criarConta = true"></card>
        </template>
        <div class="index head">
            <ul class="left-menu">
                <li clsss="item">
                    <div class="side-menu-btn" v-on:click="openSideMenu = true">
                        <i class="fa-solid fa-bars"></i>
                    </div>
                </li>
            </ul>
            <div class="logo">
                <h1><span v-on:click="modals.sobre = true">Altas iA</span></h1>
            </div>
            <ul class="right-menu">
                <li class="item">
                    <div class="hover-box">
                        <label for="control-box" class="especie-box-btn">
                            <i class="fa-solid fa-inbox"></i>
                        </label>
                        <input type="checkbox" id="control-box" />
                        <div class="box">
                            <ul class="list-itens-especie">
                                <li class="item">
                                    <div class="title">Davyd Darlan Gomes de Oliveira</div>
                                    <div class="close-btn">
                                        <i class="fa-solid fa-xmark"></i>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="title">Nome da espécie</div>
                                    <div class="close-btn">
                                        <i class="fa-solid fa-xmark"></i>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="title">Nome da espécie</div>
                                    <div class="close-btn">
                                        <i class="fa-solid fa-xmark"></i>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="title">Nome da espécie</div>
                                    <div class="close-btn">
                                        <i class="fa-solid fa-xmark"></i>
                                    </div>
                                </li>
                                <li class="item">
                                    <div class="title">Nome da espécie</div>
                                    <div class="close-btn">
                                        <i class="fa-solid fa-xmark"></i>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!--<div class="index head">
            <ul class="index-head menu">
                <li class="index-head menu-item">
                    <button class="menu-side-btn" v-on:click="openSideMenu = true">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </li>
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
                <li class="index-head menu-item" style="max-width: 460px;">
                    <search v-on:obterRegistro="selecionarCard"></search>
                </li>
            </ul>
        </div>-->
        <div class="index body">
            <!--<div class="index-body banner">
                <h1 class="index-body banner-brand" v-on:click="modals.sobre = true">Atlas iA</h1>
            </div>-->
        </div>
        <criacao-especie-modal v-on:close="modals.criarEspecie = false" :show="modals.criarEspecie"></criacao-especie-modal>
        <criacao-conta-modal v-on:close="modals.criarConta = false" :show="modals.criarConta"></criacao-conta-modal>
        <autenticacao-modal v-on:close="modals.login = false" :show="modals.login"></autenticacao-modal>
        <user-modal v-on:close="modals.user = false" :show="modals.user" :section="sectionUserModal"></user-modal>
        <sobre-modal v-on:close="modals.sobre = false" :show="modals.sobre"></sobre-modal>
        <ativacao-conta-modal v-on:close="modals.ativacaoConta = false" :show="modals.ativacaoConta" :token="$route.query.ativar_conta"></ativacao-conta-modal>
        <alteracao-senha-modal v-on:close="modals.esqueciSenha = false" :show="modals.esqueciSenha" :token="$route.query.esqueci_senha"></alteracao-senha-modal>
        <portal-target name="body" multiple></portal-target>
        <portal-target name="sidebar"></portal-target>
    </div>
</template>

<script src="./index.js"></script>
<style src="./index.css"></style>