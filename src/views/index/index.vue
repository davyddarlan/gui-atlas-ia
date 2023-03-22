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
                <search @getEntity="selecionarCard"></search>
                <h1><span v-on:click="modals.sobre = true">Atlas iA</span></h1>
            </div>
            <ul class="right-menu">
                <li class="item">
                    <div class="hover-box">
                        <label for="control-box" class="especie-box-btn">
                            <span v-show="boxCards" class="count-itens">{{ boxCards }}</span>
                            <i class="fa-solid fa-inbox"></i>
                        </label>
                        <input type="checkbox" id="control-box" v-model="boxCardsControl" />
                        <div class="box">
                            <ul class="list-itens-especie">
                                <li v-if="!boxCards" class="item without-data">
                                    A caixa de armazenamento <br> está vazia!
                                </li>
                                <template v-for="(card, index) in cards">
                                    <li v-if="card.status == 'HIDDEN'" v-on:click="maximizarCard(card)" class="item">
                                        <p class="title">{{ card.title | nomeCientifico }}</p>
                                        <div v-on:click="removerCard(card)" class="close">
                                            <i class="fa-solid fa-xmark"></i>
                                        </div>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="index body"></div>
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