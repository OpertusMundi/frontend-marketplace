<template>
  <div class="post-card" :class="{'post-card--carousel': carouselElement}">
    <div class="img-container">
      <img :src="image" alt="blog post image">
    </div>

    <div class="category" @click="selectCategory">{{ categoryName }}</div>

    <!-- <router-link :to="`blog/post/${postID}`" style="text-decoration: none; color: inherit"> -->
    <router-link :to="{ name: 'BlogPost', params: { slug: postSlug, postID, postDate: date, categoryID: categoryID || categoryID === 0 ? categoryID : '' } }" style="text-decoration: none; color: inherit">
      <h3 class="title">{{ title }}</h3>
    </router-link>

    <p><small v-html="getFirstParagraphFromHTMLString(body)"></small></p>

    <div class="date-author-info">
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
  @Prop({ required: true }) readonly postID!: number;

  @Prop({ required: true }) readonly postSlug!: string;

  @Prop({ required: true }) readonly title!: string;

  @Prop({ required: true }) readonly body!: string;

  @Prop({ required: true }) readonly authorID!: number;

  @Prop({ required: true }) readonly authorName!: string;

  @Prop({ required: true }) readonly date!: string;

  @Prop({ required: true }) readonly image!: string;

  @Prop({ required: true }) readonly categoryID!: number;

  @Prop({ required: true }) readonly categoryName!: string;

  @Prop({ required: false }) readonly carouselElement?: boolean;

  formatDate(date: string): string {
    return moment(date).format('D MMM YYYY');
  }

  selectCategory(): void {
    this.$emit('selectCategory', this.categoryID);
  }

  getFirstParagraphFromHTMLString(htmlString: string): string {
    return '<p>'
      .concat(htmlString.split('</p>')[0].split('<p>')[1])
      .concat('</p>');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_blog.scss";
</style>
