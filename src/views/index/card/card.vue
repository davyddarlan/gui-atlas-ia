<template>
    <card v-on:initMove="$emit('initMove', uuid)" :position="position" :title="card.titleCard" v-on:minimized="minimizarCard" v-on:closed="removerCard">
        <template v-slot:extra>
            <div class="app __share" v-on:click="modals.compartilhar = true">
                <i class="fa-solid fa-share"></i>
            </div>
        </template>
        <template v-slot:content>
            <div class="app __lock" v-show="authData.protectCard">
                <div class="__art"></div>
                <a class="link" v-on:click="$emit('logar')">Autentique-se</a>
                <a class="link" v-on:click="$emit('autenticar')">Registre-se</a>
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
                    </button>
                    <p>{{ subpaginas.titulo }}</p>
                </div>
                <div class="__body">
                    <component v-on:updateGeral="atualizarDados" :dados="card" :nomeCientifico="card.nomeCientifico" v-on:update="updateSections" v-on:loaded="loadCard = false" v-bind:is="subpaginas.conteudo" :uuid="uuid"></component>
                </div>
            </div>
            <compartilhar-card-modal :uuid="uuid" v-on:close="modals.compartilhar = false" :show="modals.compartilhar"></compartilhar-card-modal>
            <!--<editar-card-modal v-on:update="atualizarDados" :dados="card" :uuid="uuid" :show="modals.editarEspecie" v-on:close="modals.editarEspecie = false"></editar-card-modal>-->
            <modal :show="modals.uploadArte" v-on:close="modals.uploadArte = false">
                <template v-slot:title>Editar arte</template>
                <template v-slot:body>
                    <form class="ui form">
                        <div v-bind:class="{ active: loadFile }" class="ui inverted dimmer">
                            <div class="ui tiny text loader">Adicionando arte...</div>
                        </div>
                        <cropper class="cropper" ref="cropper" 
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
                    <div v-if="card.arte" ref="art" class="__art">
                        <div class="__remove-art-botton" v-on:click="removerArte" v-show="adminRole">
                            <i class="fa-solid fa-trash"></i>
                        </div>
                    </div>
                </div>
                <div class="app card __content">
                    <div class="__nome-popular">{{ card.nomePopular | nomePopular }}</div>
                    <div class="__nome-cientifico">{{ card.nomeCientifico | nomeCientifico }}</div>
                    <ul class="__menu">
                        <li v-for="conteudo in subpaginas.conteudos">
                            <div :class="conteudo.class" v-on:click="abrirSubpagina(conteudo)"></div>
                        </li>
                    </ul>
                    <div class="__decricao">{{ card.descricao | descricao }}</div>
                    <div class="__show-more" v-on:click="abrirSubpagina(subpaginas.infoGeral)"></div>
                </div>
            </div>
        </template>
    </card>
</template>

<script src="./card.js"></script>
<style src="./card.css"></style>