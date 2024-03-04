<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition
        name="fade" mode="out-in"
        appear
      >
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </RouterView>
</template>
