<template>
    <ul class="cp-group-itens-menu">
        <li v-on:click="toggle">
            <i v-bind:class="icon"></i>
            {{ name }}
        </li>
        <li ref="wrapper">
            <ul ref="sub">
                <slot name="itens"></slot>
            </ul>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            name: {
                type: String,
                default: 'No name',
            },
            icon: {
                type: String,
                default: 'fa-solid fa-user'
            }
        },
        methods: {
            toggle: function() {
                let sub = this.$refs.sub,
                wrapper = this.$refs.wrapper,
                subHeight = sub.clientHeight;

                if (wrapper.clientHeight > 0) {
                    wrapper.style.height = 0;
                } else {
                    wrapper.style.height = subHeight + 'px';
                }
            }
        }
    }
</script>

<style>
    .cp-group-itens-menu > li:first-child { 
        background: #e0e0e3; 
        cursor: pointer;
        padding: 14px 0 14px 0;
        font-size: 1em;
        font-weight: 600;
        color: #000000;
        letter-spacing: 0.03em;
        box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
    } 

    .cp-group-itens-menu > li:first-child > i {
        display: inline-block;
        padding: 0 24px 0 40px;
        color: #838385;
        font-size: 1.2em;
        vertical-align: middle;
    }

    .cp-group-itens-menu > li:last-child { 
        /*background: #efeff2; */
        color: white;
        overflow: hidden;
        height: 0;
        transition: height 1s;
    } 

    .cp-group-itens-menu > li:last-child > ul {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .cp-group-itens-menu > li:last-child > ul > li {
        padding: 10px 15px 10px 15px;
        font-size: 0.95em;
        cursor: pointer;
        color: #000000;
    }
</style>