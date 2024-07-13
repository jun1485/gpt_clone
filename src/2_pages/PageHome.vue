<script setup lang="ts">
import { ChatContents, SideBar } from "../3_widgets/navigation";
import { useMessageQuery } from "../5_entities/message/api/query";

const { data: chatData } = useMessageQuery();
</script>

<template>
  <div class="flex">
    <SideBar :chatData="chatData" />

    <ChatContents :chatData="chatData" />
  </div>
</template>

<style lang="scss"></style>
