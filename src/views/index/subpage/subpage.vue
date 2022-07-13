<template>
    <div class="card-data subpage">
        <div class="subpage head">
            <div class="back-button" v-on:click="onBack">
                <i class="fa-solid fa-angle-left"></i> 
                voltar
            </div>
            <span class="title">{{ title }}</span>
        </div>
        <div class="subpage content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: 'No Title',
            }
        },  
        methods: {
            onBack: function() {
                this.$emit('back');
            }
        }
    }
</script>

<style>
    .card-data.subpage {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background: #ffffff;
    }

    .subpage.head {
        width: 100%;
        height: 60px;
    }

    .subpage.head .back-button {
        display: inline-block;
        background: #000000;
        padding: 9px 14px 9px 14px;
        border-radius: 20px;
        color: #ffffff;
        margin: 13px 0 0 20px;
        font-size: 0.95em;
        cursor: pointer;
    }

    .subpage.head .back-button i { color: #ffffff; }

    .subpage.head .title {
        display: inline-block;
        width: calc(100% - 122.97px);
        padding: 9px 0 9px 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 13px 0 0 0;
        font-size: 0.95em;
        font-weight: bold;
    }

    .subpage.head .back-button,
    .subpage.head .title { float: left; }

    .subpage.content {
        width: 100%;
        height: calc(100% - 60px);
        overflow-y: scroll;
    }
</style>