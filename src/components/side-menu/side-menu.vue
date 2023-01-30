<template>
    <div class="cp-side-menu side-menu-container">
        <transition name="aside">
            <div class="cp-side-menu aside-menu" v-show="open">
                <template v-if="showElements">
                    <div class="cp-side-menu profile">
                        <img class="avatar" :src="currentAvatar" />
                        <p class="nickname">{{ $store.state.user.primeiroNome }}</p>
                    </div>
                    <ul class="cp-side-menu itens">
                        <template v-for="item in itens">
                            <li v-if="!item.admin" class="item" v-on:click="pressEvent(item)">
                                <i v-bind:class="item.icon"></i>
                                {{ item.title }}
                            </li>
                            <template v-else>
                                <li v-if="adminRole" class="item" v-on:click="pressEvent(item)">
                                    <i v-bind:class="item.icon"></i>
                                    {{ item.title }}
                                </li>
                            </template>
                        </template>
                        <!--<groupItensMenu :name="'Usuário'">
                            <template v-slot:itens>
                                <li>Editar perfil</li>
                                <li>Alterar senha</li>
                            </template>
                        </groupItensMenu>-->
                    </ul>
                </template>
                <template v-if="!showElements">
                    <div class="cp-side-menu profile">
                        <img class="avatar" src="../../assets/images/121255.png" />
                        <p class="nickname">Ops! Você não está autenticado.</p>
                    </div>
                    <ul class="cp-side-menu itens">
                        <li class="item" v-for="item in anonymou" v-on:click="pressEvent(item)">
                            <i v-bind:class="item.icon"></i>
                            {{ item.title }}
                        </li>
                    </ul>
                </template>
            </div>
        </transition>
        <transition name="dimmer">
            <div v-show="open" class="cp-side-menu dimmer" ref="dimmer"></div>
        </transition>
    </div>
</template>

<script>
    import ManAvatar from '../../assets/images/441441.png';
    import WomanAvatar from '../../assets/images/121556.png';
    import RolesMixin from '../../mixins/roles';
    import GroupItensMenu from './group-itens-menu.vue';

    export default {
        components: {
            'groupItensMenu': GroupItensMenu,
        },
        props: {
            open: {
                type: Boolean,
                default: true,
            }
        },
        mixins: [RolesMixin],
        data: function() {
            return {
                showElements: false,
                itens: [
                    {
                        title: 'adicionar espécie',
                        icon: 'fa-solid fa-plus',
                        admin: true,
                    },
                    {
                        title: 'editar perfil',
                        icon: 'fa-solid fa-user',
                        admin: false,
                    },
                    {
                        title: 'alterar senha',
                        icon: 'fa-solid fa-key',
                        admin: false,
                    },
                    /*{
                        title: 'alterar tokens',
                        icon: 'fa-solid fa-passport'
                    },
                    {
                        title: 'Sobre',
                        icon: 'fa-solid fa-plus'
                    },*/
                    {
                        title: 'sair',
                        icon: 'fa-solid fa-arrow-right-from-bracket',
                        admin: false,
                    },
                ],
                anonymou: [
                    {
                        title: 'acessar conta',
                        icon: 'fa-solid fa-key',
                    },
                    {
                        title: 'criar conta',
                        icon: 'fa-solid fa-user'
                    },
                    /*{
                        title: 'sobre',
                        icon: 'fa-solid fa-plus'
                    },*/
                ],
                events: {
                    move: null,
                    start: null,
                    click: null,
                },
                currentAvatar: null,
                clientXStart: null,
            }
        },
        watch: {
            '$store.state.user.status': function(data) {
                this.showElements = data;
            },
            '$store.state.user.sexo': function(data) {
                if (data == 'M') {
                    this.currentAvatar = ManAvatar;
                } else {
                    this.currentAvatar = WomanAvatar;
                }
            },
            open: function(data) {
                if (data) {
                    this.startEventStack();
                } else {
                    this.finishEventStack();
                }
            }
        },
        methods: {
            closeEvent: function() {
                this.$emit('close');
            },
            pressEvent: function(item) {
                this.$emit('press', item.title);
            },
            startEventStack: function() {
                this.events.start = (event) => {
                    this.clientXStart = event.touches[0].clientX;
                }
                
                this.events.move = (event) => {
                    if (event.touches[0].clientX < this.clientXStart) {
                        this.$emit('close');
                    }
                }

                this.events.click = (event) => {
                    this.$emit('close');
                }
                
                document.addEventListener('touchstart',  this.events.start);
                document.addEventListener('touchmove', this.events.move);
                this.$refs.dimmer.addEventListener('click', this.events.click);
            },
            finishEventStack: function() {
                document.removeEventListener('touchstart',  this.events.start);
                document.removeEventListener('touchmove', this.events.move);
                this.$refs.dimmer.removeEventListener('click', this.events.click);
            }
        }
    }
</script>

<style>
    .cp-side-menu.side-menu-container { display: table; }

    .cp-side-menu.aside-menu {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
        width: 320px;
        height: 100%;
        background: #f6f6f6;
        padding: 0 0 0 0;
        overflow: hidden;
    }

    .cp-side-menu.dimmer {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2)
    }

    .cp-side-menu.profile {
        padding: 40px 0 0 0;
        width: 100%;
    }

    .cp-side-menu.profile > .avatar {
        display: block;
        margin: 0 auto;
        padding: 0 0 0 0;
        max-width: 50%;
        height: auto;
        border-radius: 50px;
    }

    .cp-side-menu.profile > .nickname {
        margin: 20px 0 0 0;
        text-align: center;
        font-size: 1.3em;
        font-weight: 600;
        letter-spacing: 0.03em;
        color: #838385;
    }

    .cp-side-menu.itens {
        margin-top: 30px;
        overflow-y: auto;
        height: calc(100% - 240.8px);
    }

    .cp-side-menu.itens > .item i {
        display: inline-block;
        padding: 0 24px 0 40px;
        color: #838385;
        font-size: 1.2em;
        vertical-align: middle;
    }

    .cp-side-menu.itens > .item {
        color: #000000;
        padding: 14px 0 14px 0;
        text-transform: capitalize;
        letter-spacing: 0.03em;
        font-weight: 600;
        cursor: pointer;
    }

    .cp-side-menu.itens > .item:hover { background: #e0e0e3; }

    /* transtion */

    .aside-enter-active { animation: aside .3s; }

    .aside-leave-active { animation: aside .3s reverse; }

    @keyframes aside {
        0% {
            transform: translate(-320px, 0);
        }
        100% {
            transform: translate(0, 0);
        }
    }

    .dimmer-enter-active,
    .dimmer-leave-active  { transition: all .3s ease; }

    .dimmer-enter, .dimmer-leave-to { opacity: 0; }
</style>
