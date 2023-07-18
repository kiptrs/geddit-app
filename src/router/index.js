import { createRouter, createWebHistory } from 'vue-router';

import Home from '/components/Home.vue';

import User from '/components/User.vue';
import Post from '/components/Post.vue';
import Search from '/components/Search.vue';
import Subreddit from '/components/Subreddit.vue';
import Subreddits from '/components/Subreddits.vue';
import SubredditsGroup from '/components/SubredditsGroup.vue';
import Settings from '/components/Settings.vue';
import Gallery from '/components/Gallery.vue';

const routes = [
    {
        path: "/",
        component: Home,
        name: "home"
    },
    {
        path: "/subreddits",
        component: Subreddits,
        name: "subreddits"
    },
    {
        path: "/search",
        component: Search,
        name: "search"
    },
    {
        path: "/settings",
        component: Settings,
        name: "settings"
    },
    {
        path: "/gallery",
        component: Gallery,
        name: "gallery"
    },
    {
        path: "/u/:id",
        component: User,
        name: "user"
    },
    {
        path: "/post/:id",
        component: Post,
        name: "post"
    },
    {
        path: "/r/:id",
        component: Subreddit,
        name: "subreddit"
    },
    {
        path: "/rg/:id",
        component: SubredditsGroup,
        name: "subredditsgroup"
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    let pages = JSON.parse(localStorage.getItem("pages"));
    pages = pages.slice(-1);

    pages.push({
        path: from.path,
        scroll: document.querySelector('.content-view').scrollTop
    })
    localStorage.setItem("pages", JSON.stringify(pages));
    next();
});

export default router