<template>
    <div v-if="!posts.length" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle md-background p-2">
            <div class="spinner-border text-4" role="status"></div>
        </div>
    </div>
    <TopAppBar ref="topbar" subreddit="My Subreddits" @params_changed="params_changed" />
    <div class="cards dpb-16">
        <Post v-for="post in posts" :post="post.data" />
    </div>
    <div v-show="!scroll_loaded" class="md-progress-container">
        <div class="md-progress">
            <div class="md-progress-indicator"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated, onDeactivated } from 'vue';
import { Geddit } from "/js/geddit.js";
import Post from './CompactPost.vue';
import TopAppBar from './TopAppBar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const geddit = new Geddit();
const topbar = ref(null);

const posts = ref([]);
const after = ref(null);

const scroll_loaded = ref(true);

async function setup() {
    let response = await geddit.getSubmissions("hot", router.currentRoute.value.params.id, {
        t: "day"
    });
    if (!response) return;

    posts.value = response.posts;
    after.value = response.after;
}

async function get_posts() {
    let response = await geddit.getSubmissions(topbar.value.sort, router.currentRoute.value.params.id, {
        t: topbar.value.time
    });
    if (!response) return;

    posts.value = response.posts;
    after.value = response.after;
}

async function scroll() {
    scroll_loaded.value = false;

    let response = await geddit.getSubmissions(topbar.value.sort, router.currentRoute.value.params.id, {
        after: after.value,
        t: topbar.value.time
    });
    if (!response || !response.posts.length) {
        after.value = null;
        scroll_loaded.value = true;
        return
    }

    posts.value.push(...response.posts);
    after.value = response.after;

    scroll_loaded.value = true;
}

async function params_changed() {
    posts.value = [];
    after.value = null;
    scroll_loaded.value = true;
    get_posts();
}

import { store, silently_hide } from '/js/store.js'

async function silently_hide_post(postid) {
    // check if post is already silently hidden:
    if (store.silently_hidden.includes(postid)) {
        return
    } else {
        silently_hide(postid);
    }
}

async function handlePostsInViewport() {
    const postElements = document.querySelectorAll('.card-container');

    postElements.forEach((postElement, index) => {
        const rect = postElement.getBoundingClientRect();
        if (rect.bottom < 0) {
            // The post element is above the viewport
            // Add your logic here
            silently_hide_post(postElement.dataset.postid);
        }
    });
}

function scroll_handle(el) {
    handlePostsInViewport();
    if (el.target.scrollTop + el.target.clientHeight >= el.target.scrollHeight - window.innerWidth && scroll_loaded.value && after.value) {
        scroll();
    }
}

onBeforeMount(() => {
    setup();
})

onActivated(() => {
    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', scroll_handle)

    // Scroll to the last position
    let pages = JSON.parse(localStorage.getItem("pages"));
    let this_page = pages.find(page => page.path == window.location.pathname);
    if (this_page) {
        document.querySelector('.content-view').scrollTop = parseInt(this_page.scroll);
    }
})

onDeactivated(() => {
    // Disable scroll event listener
    let view = document.querySelector('.content-view');
    view.removeEventListener('scroll', scroll_handle);
})
</script>