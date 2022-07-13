<template>
    <portal to="body">
        <transition name="__cp-modal">
            <div class="cp modal" v-if="show">
                <transition name="__cp-hide__cp-modal">
                    <div class="__dimmer" v-show="hide">
                        <div class="__modal" v-bind:class="{ mini: mini, [className]: className }">
                            <div class="__wrapper">
                                <div v-show="!closeButton" class="__close-button" v-on:click="close">
                                    <i class="fa-solid fa-xmark"></i>
                                </div>
                                <div class="__title">
                                    <slot name="title"></slot>
                                </div>
                            </div>
                            <div class="__body">
                                <slot name="body"></slot>
                            </div>
                            <div class="__footer">
                                <slot name="footer"></slot>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </portal>
</template>

<script src="./modal.js"></script>
<style src="./modal.css"></style>