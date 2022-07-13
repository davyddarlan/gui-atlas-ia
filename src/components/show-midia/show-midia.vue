<template>
    <portal to="body">
        <div class="cp show-midia" v-if="show">
            <div class="__dimmer">
                <transition name="__cp-show-midia">
                    <div class="__midia" ref="midia">
                        <div class="__btn-close" v-on:click="close">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        <div class="__load" v-show="!load">
                            <div class="ui active inline loader"></div>
                            <span>Carregando mídia...</span>
                        </div>
                        <div class="__content" v-show="load">
                            <template v-if="tipo == 'imagem'">
                                <img v-bind:src="fullPath" class="__format" ref="imagem" />
                            </template>
                            <template v-if="tipo == 'video'">
                                <video controls class="__format" ref="video">
                                    <source v-bind:src="fullPath" type="video/mp4">
                                </video>
                            </template>
                            <template v-if="tipo == 'audio'" class="__format">
                                <audio controls ref="audio" style="width:100%;">
                                    <source v-bind:src="fullPath" type="audio/mpeg">
                                </audio>
                            </template>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </portal>
</template>

<style src="./show-midia.css"></style>
<script src="./show-midia.js"></script>