import IndexPage from '../views/index/index.vue';

export default function() {
    return [
        {
            path: '/:id?',
            name: 'index',
            component: IndexPage,
        },
    ];
}