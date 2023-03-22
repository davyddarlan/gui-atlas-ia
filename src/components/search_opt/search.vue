<template>
    <div class="cp search">
        <div class="search wrapper">
            <div v-bind:class="{ 'change-color': status.openSearch }" class="button" @click="toggleSearch">
                <i v-bind:class="{ 'change-color-icon': status.openSearch }" class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div ref="wrapperAnimation" v-bind:class="{ 'open-search': status.openSearch }" class="search wrapper-animation">
                <div v-bind:class="{ 'translate-input': status.openSearch }" class="search wrapper-input">
                    <input v-model="input" class="input" type="text" placeholder="Buscar espécie..." />
                    <div class="search controller">
                        <div v-if="status.close" @click="clearInput" class="close">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        <div v-if="results.load" class="load"></div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="__cp-search-results">
            <div v-show="results.show" class="search result">
                <ul class="search list">
                    <li v-if="!results.result.length" class="item without-data">
                        <p>Infelizente não foi localizado <br> nenhum registro!</p>
                    </li>
                    <template v-for="data in results.result">
                        <li @click="selectEntity(data)" class="item">
                            <p class="titulo">Nome Científico</p>
                            <p class="data">{{ data.nome_cientifico | formatoCientifico }} ({{ data.nome_popular }})</p>
                        </li>
                    </template>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script src="./search.js"></script>
<style src="./search.css" scoped></style>