<template>
    <div class="cp input-data">
        <div class="__wrapper-input">
            <div class="__read-only-input" v-show="readInput">
                <input readonly v-bind:value="readInput" type="text" />
                <div class="__wrapper">
                    <div class="__close" v-on:click="reset">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
            </div>
            <div class="__icon-search">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <input ref="input" v-model="input" type="text" :placeholder="placeholder" />
            <div class="__wrapper-controllers">
                <div v-show="controller.load" class="__load"></div>
                <div v-show="controller.clear" v-on:click="input = ''" class="__close">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </div>
        <div class="__result" v-show="controller.result">
            <div class="__extra" v-if="extra">
                <slot name="extra">Conteúdo extra.</slot>
            </div>
            <div class="__without-result" v-show="controller.withoutData">
                <p>Ops! Infelizmente nenhum registro pôde ser localizado,
                verifique se a busca foi feita adequadamente.</p>
            </div>
            <ul class="__wrapper-result" v-show="!controller.withoutData">
                <li class="__list" v-for="result in result" v-on:click="select(result)">
                    <div class="__avatar">ET</div>
                    <div class="__wrapper_data">
                        <p class="__title">{{ title }}</p>
                        <p class="__data">{{ result.nome }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script src="./input-data.js"></script>
<style src="./input-data.css"></style>