<template>
    <card v-on:initMove="$emit('initMove', uuid)" :position="position" :title="card.titleCard" v-on:minimized="minimizarCard" v-on:closed="removerCard">
        <template v-slot:content>
            <div class="app __lock" v-show="authData.protectCard">
                <div class="__art"></div>
                <p>Acesso restrito.</p>
                <div class="__wrapper-buttons">
                    <button class="__button secondary" v-on:click="authData.protectCard = false">
                        Fechar
                    </button>
                </div>
            </div>
            <div class="app __load" v-show="loadCard">
                <div class="ui active inline loader"></div>
                <div>{{ textLoadCard }}</div>
            </div>
            <div class="app sub-pagina __sub-pagina" v-show="subpaginas.status">
                <div class="__head">
                    <button v-on:click="fecharSubpagina">
                        <i class="fa-solid fa-angle-left"></i>
                        voltar
                    </button>
                    <p>{{ subpaginas.titulo }}</p>
                </div>
                <div class="__body">
                    <component :nomeCientifico="card.nomeCientifico" v-on:update="updateSections" v-on:loaded="loadCard = false" v-bind:is="subpaginas.conteudo" :uuid="uuid"></component>
                </div>
            </div>
            <compartilhar-card-modal :uuid="uuid" v-on:close="modals.compartilhar = false" :show="modals.compartilhar"></compartilhar-card-modal>
            <editar-card-modal v-on:update="atualizarDados" :dados="card" :uuid="uuid" :show="modals.editarEspecie" v-on:close="modals.editarEspecie = false"></editar-card-modal>
            <modal :show="modals.uploadArte" v-on:close="modals.uploadArte = false">
                <template v-slot:title>Editar arte</template>
                <template v-slot:body>
                    <form class="ui form">
                        <div v-bind:class="{ active: loadFile }" class="ui inverted dimmer">
                            <div class="ui tiny text loader">Adicionando arte...</div>
                        </div>
                        <cropper ref="cropper" 
                            :src="card.arteFile" 
                            :stencil-size="{ width: 423, height: 270 }"
                            :auto-zoom="true"
                            image-restriction="stencil"
                            :canvas="{
                                height: 270,
                                width: 423
                            }"
                        />
                    </form>
                </template>
                <template v-slot:footer>
                    <button class="ui primary button tiny" type="submit" v-on:click="enviarArte" :disabled="loadFile">Adicionar</button>
                </template>
            </modal>
            <div class="app card">
                <div class="app card __art">
                    <div v-show="loadFile" class="__load">
                        <div class="ui active inline loader"></div>
                        <div class="__text">carregando arte...</div>
                    </div>
                    <div v-show="!card.arte && !adminRole" class="__without-art">
                        <p class="__text">Espécie sem imagem de apresentação.</p>
                    </div>
                    <div v-show="!card.arte" class="__default">
                        <label v-bind:for="uuid" v-show="adminRole">Adicionar arte</label>
                        <input v-show="adminRole" ref="arteFile" v-on:change="selecionarArte($event)" v-bind:id="uuid" type="file" />
                    </div>
                    <div v-show="card.arte" ref="art" class="__art"></div>
                </div>
                <div class="app card __content">
                    <div class="__nome-popular">{{ card.nomePopular | nomePopular }}</div>
                    <div class="__nome-cientifico">{{ card.nomeCientifico | nomeCientifico }}</div>
                    <section class="splide __menu">
                        <div class="splide__arrows">
                            <button class="splide__arrow splide__arrow--prev">
                                <i class="fa-solid fa-angle-left"></i>
                            </button>
                            <button class="splide__arrow splide__arrow--next">
                                <i class="fa-solid fa-angle-right"></i>
                            </button>
                        </div>
                        <div class="splide__track">
                            <ul class="splide__list">
                                <li class="splide__slide" v-for="conteudo in subpaginas.conteudos">
                                    <div :class="conteudo.class" v-on:click="abrirSubpagina(conteudo)"></div>
                                </li>
                            </ul>
                        </div>
                    </section>
                    <div class="__decricao">{{ card.descricao | descricao }}</div>
                    <div v-show="adminRole" class="ui fluid __edit-button buttons">
                        <button class="ui tiny button" v-on:click="modals.editarEspecie = true">Editar</button>
                        <button class="ui primary button tiny" v-on:click="modals.compartilhar = true">Compartilhar</button>
                    </div> 
                    <button v-show="!adminRole" v-if="!authData.showData" v-on:click="modals.compartilhar = true" class="ui __edit-button primary button tiny fluid">Compartilhar espécie</button>
                </div>
            </div>
        </template>
    </card>
</template>

<script src="./card.js"></script>
<style src="./card.css"></style>