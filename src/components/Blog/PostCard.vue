<template>
  <div class="post-card">
    <img :src="image" alt="blog post image">

    <div class="category">{{ categoryName }}</div>

    <h3 class="title">{{ title }}</h3>

    <p><small v-html="body"></small></p>

    <div class="bottom">
      <small>
        {{ formatDate(date) }}
        •
        <span class="author">{{ authorName }}</span>
      </small>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import moment from 'moment';

@Component
export default class PostCard extends Vue {
  @Prop({ required: true }) readonly title!: string;

  @Prop({ required: true }) readonly body!: string;

  @Prop({ required: true }) readonly authorID!: number;

  @Prop({ required: true }) readonly authorName!: string;

  @Prop({ required: true }) readonly date!: string;

  @Prop({ required: true }) readonly image!: string;

  @Prop({ required: true }) readonly categoryID!: number;

  @Prop({ required: true }) readonly categoryName!: string;

  formatDate(date: string): string {
    return moment(date).format('D MMM YYYY');
  }
}
</script>
<style lang="scss">
.post-card {
  width: 100%;
  margin-bottom: 2em;

  img {
    display: block;
    width: 100%;
    height: 50%;
    border-radius: 5px;
  }

  p {
    margin: 0.5em 0;
    color: $darkColor;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .category, .bottom {
    color: $secondColor;
  }

  .category, .title, .author {
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .category {
    text-transform: uppercase;
    font-size: .7em;
    font-weight: 500;
    margin: 0.8em 0;
  }

  .bottom {
    margin: 0.5em 0;
    font-size: .9em;
  }
}
</style>
