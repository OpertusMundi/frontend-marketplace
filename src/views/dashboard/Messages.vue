<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Messages</h1>
        <router-link class="btn--std btn--blue" to="messages/create">NEW MESSAGE</router-link>
        <div class="dashboard__head__helpers__mobile">
          <div class="dashboard__head__helpers__mobile__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17">
              <g id="Group_2023" data-name="Group 2023" transform="translate(-201.983 -142.983)">
                <path id="Union_13" data-name="Union 13" d="M6.375,14.874v-4.25H2.125a2.125,2.125,0,1,1,0-4.25h4.25V2.125a2.125,2.125,0,0,1,4.251,0v4.25h4.25a2.125,2.125,0,1,1,0,4.25h-4.25v4.25a2.125,2.125,0,1,1-4.251,0Z" transform="translate(201.983 142.983)" fill="#fff"/>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <!-- <div class="dashboard__head__helpers">
        <div class="asset_search asset_search--sm asset_search--grey-border">
          <div class="asset_search__upper">
            <input type="text" name="" id="" placeholder="Search in messages" class="asset_search__upper__input">
            <div class="asset_search__upper__icon asset_search__upper__icon--open"><img src="/assets/images/icons/search_black.svg" alt=""></div>
            <div class="asset_search__upper__icon asset_search__upper__icon--close"><img src="/assets/images/icons/close_icon.svg" alt=""></div>
          </div>
        </div>
      </div> -->
    </div>
    <div class="messages">
      <div class="filters">
        <div class="filters__block">
          <p class="filters__title">{{ paginationData.itemsTotal }} threads</p>
        </div>
        <div class="filters__block">
          <div class="filters__block__select">
            <select name="filter" id="filter" v-model="typeFilter">
              <option value="ALL">ALL</option>
              <option value="UNREAD">UNREAD</option>
            </select>
          </div>
        </div>
      </div>

      <div class="messages__main">
        <router-link class="messages__main__row" :class="{'messages__main__row--read': message.read}" :to="`/dashboard/messages/${message.thread}`" v-for="message in messages" :key="message.id">
          <div class="messages__main__row__view"><span>VIEW MESSAGE</span></div>
          <div class="messages__main__row__inner">
            <div class="messages__main__row__block">
              <div class="messages__main__row__block__icon">
                <img :src="getContactProfile(message).logoImage ? 'data:' + getContactProfile(message).logoImageMimeType + ';base64, ' + getContactProfile(message).logoImage : defaultLogo()" alt="user image">
              </div>
              <div class="messages__main__row__block__name">
                {{ getContactProfile(message).name }}
              </div>
            </div>
            <span class="messages__main__row__block" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis !important;">
              <p class="messages__main__row__block__title">{{ '' }} <span>{{ message.text }}</span> </p>
            </span>
            <div class="messages__main__row__block">
              <p class="messages__main__row__block__date">{{ formatDate(message.createdAt).date }} • {{ formatDate(message.createdAt).time }}</p>
            </div>
          </div>
        </router-link>

        <!--<router-link class="messages__main__row" to="/dashboard/messages/1">
          <div class="messages__main__row__view"><span>VIEW MESSAGE</span></div>
          <div class="messages__main__row__inner">
            <div class="messages__main__row__block">
              <div class="messages__main__row__block__icon">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20.568" height="20.72" viewBox="0 0 20.568 20.72">
                  <defs>
                    <clipPath id="clip-path">
                      <path id="Path_8708" data-name="Path 8708" d="M31.324,10.724c-1.958,2.319-2.868,5.583-4.8,7.872-1.438,1.7-3.491,3.523-6.87,2.374,1.891,2.4,5.628,3.044,8.637,1.84a10.883,10.883,0,0,0,3.919-2.939c1.467-1.653,1.84-2,2.379-1.98l.077.012c.867.29.426,1.5.082,2.024C31.881,24.333,26.5,24.88,23,23.785a11.019,11.019,0,0,0,4.7,1.2h.114a10.483,10.483,0,0,0,8.619-4.629,9.74,9.74,0,0,0,1.477-3.431c.171-.938.205-2.274-.547-2.726-1.16-.738-2.85.218-3.777,1.183-1.4,1.456-2.4,2.8-3.863,4.324-1.511,1.578-3.83,3.068-6.071,2.439,2.942-.086,5.183-2.64,6.9-4.768,1.738-2.158,4.88-7.387,7.56-4-.249-2.579-1.9-4.268-3.764-4.268a4,4,0,0,0-3.023,1.612M27.879,4.266H27.84A10.481,10.481,0,0,0,19.221,8.9a9.778,9.778,0,0,0-1.478,3.429c-.17.94-.2,2.274.549,2.727,1.158.74,2.85-.219,3.776-1.183,1.4-1.456,2.4-2.8,3.863-4.323,1.513-1.58,3.83-3.071,6.071-2.441-2.943.086-5.184,2.64-6.9,4.768-1.739,2.159-4.88,7.388-7.56,4,.382,3.977,4.1,5.837,6.788,2.657,1.958-2.32,2.868-5.582,4.8-7.873,1.438-1.7,3.491-3.52,6.871-2.373-1.892-2.405-5.628-3.042-8.637-1.841A10.883,10.883,0,0,0,23.447,9.38c-1.468,1.654-1.84,2-2.379,1.98l-.076-.013c-.867-.29-.426-1.5-.083-2.023,2.865-4.405,8.25-4.954,11.748-3.858a11,11,0,0,0-4.692-1.2Z" transform="translate(-17.543 -4.266)"/>
                    </clipPath>
                  </defs>
                  <g id="Group_753" data-name="Group 753" opacity="0.65">
                    <path id="Path_8707" data-name="Path 8707" d="M31.324,10.724c-1.958,2.319-2.868,5.583-4.8,7.872-1.438,1.7-3.491,3.523-6.87,2.374,1.891,2.4,5.628,3.044,8.637,1.84a10.883,10.883,0,0,0,3.919-2.939c1.467-1.653,1.84-2,2.379-1.98l.077.012c.867.29.426,1.5.082,2.024C31.881,24.333,26.5,24.88,23,23.785a11.019,11.019,0,0,0,4.7,1.2h.114a10.483,10.483,0,0,0,8.619-4.629,9.74,9.74,0,0,0,1.477-3.431c.171-.938.205-2.274-.547-2.726-1.16-.738-2.85.218-3.777,1.183-1.4,1.456-2.4,2.8-3.863,4.324-1.511,1.578-3.83,3.068-6.071,2.439,2.942-.086,5.183-2.64,6.9-4.768,1.738-2.158,4.88-7.387,7.56-4-.249-2.579-1.9-4.268-3.764-4.268a4,4,0,0,0-3.023,1.612M27.879,4.266H27.84A10.481,10.481,0,0,0,19.221,8.9a9.778,9.778,0,0,0-1.478,3.429c-.17.94-.2,2.274.549,2.727,1.158.74,2.85-.219,3.776-1.183,1.4-1.456,2.4-2.8,3.863-4.323,1.513-1.58,3.83-3.071,6.071-2.441-2.943.086-5.184,2.64-6.9,4.768-1.739,2.159-4.88,7.388-7.56,4,.382,3.977,4.1,5.837,6.788,2.657,1.958-2.32,2.868-5.582,4.8-7.873,1.438-1.7,3.491-3.52,6.871-2.373-1.892-2.405-5.628-3.042-8.637-1.841A10.883,10.883,0,0,0,23.447,9.38c-1.468,1.654-1.84,2-2.379,1.98l-.076-.013c-.867-.29-.426-1.5-.083-2.023,2.865-4.405,8.25-4.954,11.748-3.858a11,11,0,0,0-4.692-1.2Z" transform="translate(-17.543 -4.266)"/>
                    <g id="Group_752" data-name="Group 752" transform="translate(0)" clip-path="url(#clip-path)">
                      <rect id="Rectangle_4127" data-name="Rectangle 4127" width="20.577" height="20.72" transform="translate(-0.005 0)"/>
                    </g>
                  </g>
                </svg>
              </div>
              <div class="messages__main__row__block__name">
                Synergise
              </div>
            </div>
            <div class="messages__main__row__block">
              <p class="messages__main__row__block__title">Asset delivery specifications <span>- Message content preview Lorem ipsum dolor sit amet,  magna ipsum dolor sit amet, consectetur adipiscing magna</span> </p>
            </div>
            <div class="messages__main__row__block">
              <p class="messages__main__row__block__date">20 Nov 2020 • 09:23</p>
            </div>
          </div>
        </router-link>

        <div class="messages__main__row messages__main__row--noback">
          <div class="messages__main__row__view"><span>VIEW MESSAGE</span></div>
          <div class="messages__main__row__inner">
            <div class="messages__main__row__block">
              <div class="messages__main__row__block__icon">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20.568" height="20.72" viewBox="0 0 20.568 20.72">
                  <defs>
                    <clipPath id="clip-path">
                      <path id="Path_8708" data-name="Path 8708" d="M31.324,10.724c-1.958,2.319-2.868,5.583-4.8,7.872-1.438,1.7-3.491,3.523-6.87,2.374,1.891,2.4,5.628,3.044,8.637,1.84a10.883,10.883,0,0,0,3.919-2.939c1.467-1.653,1.84-2,2.379-1.98l.077.012c.867.29.426,1.5.082,2.024C31.881,24.333,26.5,24.88,23,23.785a11.019,11.019,0,0,0,4.7,1.2h.114a10.483,10.483,0,0,0,8.619-4.629,9.74,9.74,0,0,0,1.477-3.431c.171-.938.205-2.274-.547-2.726-1.16-.738-2.85.218-3.777,1.183-1.4,1.456-2.4,2.8-3.863,4.324-1.511,1.578-3.83,3.068-6.071,2.439,2.942-.086,5.183-2.64,6.9-4.768,1.738-2.158,4.88-7.387,7.56-4-.249-2.579-1.9-4.268-3.764-4.268a4,4,0,0,0-3.023,1.612M27.879,4.266H27.84A10.481,10.481,0,0,0,19.221,8.9a9.778,9.778,0,0,0-1.478,3.429c-.17.94-.2,2.274.549,2.727,1.158.74,2.85-.219,3.776-1.183,1.4-1.456,2.4-2.8,3.863-4.323,1.513-1.58,3.83-3.071,6.071-2.441-2.943.086-5.184,2.64-6.9,4.768-1.739,2.159-4.88,7.388-7.56,4,.382,3.977,4.1,5.837,6.788,2.657,1.958-2.32,2.868-5.582,4.8-7.873,1.438-1.7,3.491-3.52,6.871-2.373-1.892-2.405-5.628-3.042-8.637-1.841A10.883,10.883,0,0,0,23.447,9.38c-1.468,1.654-1.84,2-2.379,1.98l-.076-.013c-.867-.29-.426-1.5-.083-2.023,2.865-4.405,8.25-4.954,11.748-3.858a11,11,0,0,0-4.692-1.2Z" transform="translate(-17.543 -4.266)"/>
                    </clipPath>
                  </defs>
                  <g id="Group_753" data-name="Group 753" opacity="0.65">
                    <path id="Path_8707" data-name="Path 8707" d="M31.324,10.724c-1.958,2.319-2.868,5.583-4.8,7.872-1.438,1.7-3.491,3.523-6.87,2.374,1.891,2.4,5.628,3.044,8.637,1.84a10.883,10.883,0,0,0,3.919-2.939c1.467-1.653,1.84-2,2.379-1.98l.077.012c.867.29.426,1.5.082,2.024C31.881,24.333,26.5,24.88,23,23.785a11.019,11.019,0,0,0,4.7,1.2h.114a10.483,10.483,0,0,0,8.619-4.629,9.74,9.74,0,0,0,1.477-3.431c.171-.938.205-2.274-.547-2.726-1.16-.738-2.85.218-3.777,1.183-1.4,1.456-2.4,2.8-3.863,4.324-1.511,1.578-3.83,3.068-6.071,2.439,2.942-.086,5.183-2.64,6.9-4.768,1.738-2.158,4.88-7.387,7.56-4-.249-2.579-1.9-4.268-3.764-4.268a4,4,0,0,0-3.023,1.612M27.879,4.266H27.84A10.481,10.481,0,0,0,19.221,8.9a9.778,9.778,0,0,0-1.478,3.429c-.17.94-.2,2.274.549,2.727,1.158.74,2.85-.219,3.776-1.183,1.4-1.456,2.4-2.8,3.863-4.323,1.513-1.58,3.83-3.071,6.071-2.441-2.943.086-5.184,2.64-6.9,4.768-1.739,2.159-4.88,7.388-7.56,4,.382,3.977,4.1,5.837,6.788,2.657,1.958-2.32,2.868-5.582,4.8-7.873,1.438-1.7,3.491-3.52,6.871-2.373-1.892-2.405-5.628-3.042-8.637-1.841A10.883,10.883,0,0,0,23.447,9.38c-1.468,1.654-1.84,2-2.379,1.98l-.076-.013c-.867-.29-.426-1.5-.083-2.023,2.865-4.405,8.25-4.954,11.748-3.858a11,11,0,0,0-4.692-1.2Z" transform="translate(-17.543 -4.266)"/>
                    <g id="Group_752" data-name="Group 752" transform="translate(0)" clip-path="url(#clip-path)">
                      <rect id="Rectangle_4127" data-name="Rectangle 4127" width="20.577" height="20.72" transform="translate(-0.005 0)"/>
                    </g>
                  </g>
                </svg>
              </div>
              <div class="messages__main__row__block__name">
                Roleplay Roleplay
              </div>
            </div>
            <div class="messages__main__row__block">
              <p class="messages__main__row__block__title">Asset delivery specifications <span>- Message content preview Lorem ipsum dolor sit amet,  magna ipsum dolor sit amet, consectetur adipiscing magna</span> </p>
            </div>
            <div class="messages__main__row__block">
              <p class="messages__main__row__block__date">20 Nov 2020 • 09:23</p>
            </div>
          </div>
        </div>

        <router-link class="messages__main__row" to="/dashboard/messages/1">
          <div class="messages__main__row__view"><span>VIEW MESSAGE</span></div>
          <div class="messages__main__row__inner">
            <div class="messages__main__row__block">
              <div class="messages__main__row__block__icon">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20.568" height="20.72" viewBox="0 0 20.568 20.72">
                  <defs>
                    <clipPath id="clip-path">
                      <path id="Path_8708" data-name="Path 8708" d="M31.324,10.724c-1.958,2.319-2.868,5.583-4.8,7.872-1.438,1.7-3.491,3.523-6.87,2.374,1.891,2.4,5.628,3.044,8.637,1.84a10.883,10.883,0,0,0,3.919-2.939c1.467-1.653,1.84-2,2.379-1.98l.077.012c.867.29.426,1.5.082,2.024C31.881,24.333,26.5,24.88,23,23.785a11.019,11.019,0,0,0,4.7,1.2h.114a10.483,10.483,0,0,0,8.619-4.629,9.74,9.74,0,0,0,1.477-3.431c.171-.938.205-2.274-.547-2.726-1.16-.738-2.85.218-3.777,1.183-1.4,1.456-2.4,2.8-3.863,4.324-1.511,1.578-3.83,3.068-6.071,2.439,2.942-.086,5.183-2.64,6.9-4.768,1.738-2.158,4.88-7.387,7.56-4-.249-2.579-1.9-4.268-3.764-4.268a4,4,0,0,0-3.023,1.612M27.879,4.266H27.84A10.481,10.481,0,0,0,19.221,8.9a9.778,9.778,0,0,0-1.478,3.429c-.17.94-.2,2.274.549,2.727,1.158.74,2.85-.219,3.776-1.183,1.4-1.456,2.4-2.8,3.863-4.323,1.513-1.58,3.83-3.071,6.071-2.441-2.943.086-5.184,2.64-6.9,4.768-1.739,2.159-4.88,7.388-7.56,4,.382,3.977,4.1,5.837,6.788,2.657,1.958-2.32,2.868-5.582,4.8-7.873,1.438-1.7,3.491-3.52,6.871-2.373-1.892-2.405-5.628-3.042-8.637-1.841A10.883,10.883,0,0,0,23.447,9.38c-1.468,1.654-1.84,2-2.379,1.98l-.076-.013c-.867-.29-.426-1.5-.083-2.023,2.865-4.405,8.25-4.954,11.748-3.858a11,11,0,0,0-4.692-1.2Z" transform="translate(-17.543 -4.266)"/>
                    </clipPath>
                  </defs>
                  <g id="Group_753" data-name="Group 753" opacity="0.65">
                    <path id="Path_8707" data-name="Path 8707" d="M31.324,10.724c-1.958,2.319-2.868,5.583-4.8,7.872-1.438,1.7-3.491,3.523-6.87,2.374,1.891,2.4,5.628,3.044,8.637,1.84a10.883,10.883,0,0,0,3.919-2.939c1.467-1.653,1.84-2,2.379-1.98l.077.012c.867.29.426,1.5.082,2.024C31.881,24.333,26.5,24.88,23,23.785a11.019,11.019,0,0,0,4.7,1.2h.114a10.483,10.483,0,0,0,8.619-4.629,9.74,9.74,0,0,0,1.477-3.431c.171-.938.205-2.274-.547-2.726-1.16-.738-2.85.218-3.777,1.183-1.4,1.456-2.4,2.8-3.863,4.324-1.511,1.578-3.83,3.068-6.071,2.439,2.942-.086,5.183-2.64,6.9-4.768,1.738-2.158,4.88-7.387,7.56-4-.249-2.579-1.9-4.268-3.764-4.268a4,4,0,0,0-3.023,1.612M27.879,4.266H27.84A10.481,10.481,0,0,0,19.221,8.9a9.778,9.778,0,0,0-1.478,3.429c-.17.94-.2,2.274.549,2.727,1.158.74,2.85-.219,3.776-1.183,1.4-1.456,2.4-2.8,3.863-4.323,1.513-1.58,3.83-3.071,6.071-2.441-2.943.086-5.184,2.64-6.9,4.768-1.739,2.159-4.88,7.388-7.56,4,.382,3.977,4.1,5.837,6.788,2.657,1.958-2.32,2.868-5.582,4.8-7.873,1.438-1.7,3.491-3.52,6.871-2.373-1.892-2.405-5.628-3.042-8.637-1.841A10.883,10.883,0,0,0,23.447,9.38c-1.468,1.654-1.84,2-2.379,1.98l-.076-.013c-.867-.29-.426-1.5-.083-2.023,2.865-4.405,8.25-4.954,11.748-3.858a11,11,0,0,0-4.692-1.2Z" transform="translate(-17.543 -4.266)"/>
                    <g id="Group_752" data-name="Group 752" transform="translate(0)" clip-path="url(#clip-path)">
                      <rect id="Rectangle_4127" data-name="Rectangle 4127" width="20.577" height="20.72" transform="translate(-0.005 0)"/>
                    </g>
                  </g>
                </svg>
              </div>
              <div class="messages__main__row__block__name">
                Synergise
              </div>
            </div>
            <div class="messages__main__row__block">
              <p class="messages__main__row__block__title">Asset delivery specifications <span>- Message content preview Lorem ipsum dolor sit amet,  magna ipsum dolor sit amet, consectetur adipiscing magna</span> </p>
            </div>
            <div class="messages__main__row__block">
              <p class="messages__main__row__block__date">20 Nov 2020 • 09:23</p>
            </div>
          </div>
        </router-link> -->

      </div>

      <div class="more__bottom">
        <!-- <div class="more__bottom__block"> -->
          <pagination :currentPage="paginationData.currentPage" :itemsPerPage="paginationData.itemsPerPage" :itemsTotal="paginationData.itemsTotal" @pageSelection="onPageSelect"></pagination>
          <!-- <a href="#"> <p>LOAD MORE</p><p><svg xmlns="http://www.w3.org/2000/svg" width="17.404" height="25.65" viewBox="0 0 17.404 25.65"><path id="Path_2292" data-name="Path 2292" d="M-1105.012-7721.223l11.469 14.086 11.871-14.086" transform="translate(-7704.786 1106.175) rotate(90)" fill="none" stroke="#333" stroke-width="3"></path></svg></p> </a> -->
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Pagination from '@/components/Pagination.vue';
import MessageApi from '@/service/message';
import { ClientContact, Message } from '@/model/message';
import getDefaultLogo from '@/helper/logo';
import store from '@/store';
import moment from 'moment';

@Component({
  components: { Pagination },
})
export default class DashboardMessages extends Vue {
  messageApi = new MessageApi();

  contacts: ClientContact[] = [];

  messages: Message[] | null = null;

  paginationData: {
    currentPage: number,
    itemsPerPage: number,
    itemsTotal: number,
  } = {
    currentPage: 0,
    itemsPerPage: 10,
    itemsTotal: 0,
  };

  typeFilter: 'ALL' | 'UNREAD' = 'ALL';

  created(): void {
    this.findMessages();
  }

  @Watch('$store.getters.getUnreadMessagesCount')
  onUnreadMessagesCountChange(): void {
    this.findMessages();
  }

  @Watch('typeFilter')
  onTypeFilterChange(): void {
    this.findMessages();
  }

  getContactProfile(message: Message): ClientContact {
    const contactsExcludingCurrentUser = this.contacts.filter((x) => x.id !== store.getters.getUserKey);
    console.log(contactsExcludingCurrentUser);

    const userIDs = [message.senderId, message.recipientId];
    if (contactsExcludingCurrentUser.some((x) => userIDs.includes(x.id))) {
      // eslint-disable-next-line
      return contactsExcludingCurrentUser.find((x) => userIDs.includes(x.id))!;
    }
    // eslint-disable-next-line
    return { id: '', logoImage: '', logoImageMimeType: '', name: '' };
  }

  defaultLogo(): string {
    return getDefaultLogo();
  }

  formatDate(datetime: string): { date: string, time: string } {
    const date = moment(datetime).format('D MMM YY');
    const time = moment(datetime).format('HH:mm');

    return {
      date,
      time,
    };
  }

  onPageSelect(page: number): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.findMessages(page);
  }

  findMessages(page = 0): void {
    store.commit('setLoading', true);

    const view = this.typeFilter === 'ALL' ? 'THREAD_ONLY' : 'THREAD_ONLY_UNREAD';

    this.messageApi.find(page, this.paginationData.itemsPerPage, null, null, view).then((response) => {
      Vue.set(this.paginationData, 'itemsTotal', response.result.count);
      Vue.set(this.paginationData, 'currentPage', response.result.pageRequest.page);
      Vue.set(this.paginationData, 'itemsPerPage', response.result.pageRequest.size);

      this.contacts = Object.keys(response.contacts).map((x) => response.contacts[x]);

      this.messages = response.result.items;

      store.commit('setLoading', false);
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_messages.scss";
  @import "@/assets/styles/_search.scss";
</style>
