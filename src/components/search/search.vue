<template>
    <div class="cp search">
        <div class="__wrapper">
            <div class="__btn-search">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <input v-model="value" placeholder="Buscar espécie" />
            <div class="__wrapper">
                <div class="__btn-close" v-show="botaoLimpar" v-on:click="limparCampo">
                    <i class="fa-solid fa-xmark"></i>
                </div>
                <div class="__loader" v-show="results.load"></div>
            </div>
        </div>
        <transition name="__cp-search-results">
            <div class="__results" v-show="results.show">
                <div class="__message" v-show="!results.result.length">
                    <p class="__not-found-text">Ops! Nenhum registro foi encontrado.
                    Faça outra busca, mas antes, certifique-se que digitou 
                    a palavra correta.</p>
                </div>
                <ul v-show="results.result.length">
                    <li v-for="data in results.result" v-on:click="selecionarRegistro(data)">
                        <div class="__avatar">{{ data.nome_cientifico | primeiraLetra }}</div>
                        <div class="__wrapper">
                            <p class="__subtitulo">Nome cietífico</p>
                            <p class="__titulo">{{ data.nome_cientifico | formatoCientifico }}</p>
                            <p class="__descricao" v-show="data.descricao">{{ data.descricao }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script src="./search.js"></script>
<style src="./search.css"></style>