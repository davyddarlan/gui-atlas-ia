<template>
    <div ref="card" id="card" class="card" v-show="showCard">
        <div class="card head">
            <div class="buttons">
                <div v-on:click="close"></div>
                <div v-on:click="minimize"></div>
            </div>
            <div class="title" ref="bar">
                <span>{{ title | nomeCientifico }}</span>
            </div>
        </div>
        <div class="card content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script src="./card.js"></script>
<style src="./card.css"></style>