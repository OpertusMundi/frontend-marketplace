<template>
  <header class="header" v-bind:class="[headerClass, scrollClass, {'open':showMobileMenu}]">
    <div class="header__inner">
      <div class="header__logo"><router-link to="/"><img src="@/assets/images/logo.svg" alt=""></router-link></div>
      <div class="header__mobile">
        <a href="#" class="header__mobile__burger" v-bind:class="{'open':showMobileMenu}" @click.prevent="toggleMobileMenu">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve">
            <rect x="1.2" y="9" style="fill:#FFFFFF;" width="33.5" height="2"/>
            <path style="fill:#FFFFFF;" d="M34.2,19h-6v-2h6V19z M24.2,19h-9v-2h9V19z M11.2,19h-9v-2h9V19z"/>
            <rect x="1.2" y="25" style="fill:#FFFFFF;" width="33.5" height="2"/>
          </svg>
        </a>
        <router-link to="/" class="header__mobile__logo header__mobile__logo--closed"><img src="@/assets/images/logo_mobile.svg" alt=""></router-link>
        <router-link to="/" class="header__mobile__logo header__mobile__logo--open"><img src="@/assets/images/logo.svg" alt=""></router-link>
        <a href="#" class="header__mobile__search"><svg xmlns="http://www.w3.org/2000/svg" width="29.014" height="22.358"><g data-name="Group 1700" fill="none" stroke="#fff" stroke-width="2"><g data-name="Ellipse 7"><circle cx="10.5" cy="10.5" r="10.5" stroke="none"/><circle cx="10.5" cy="10.5" r="9.5"/></g><path data-name="Path 29" d="M19.375 16.031l9.125 5.47"/></g></svg></a>
      </div>
      <div class="header__menu">
        <nav>
          <ul>
            <li><a href="#">Sell</a></li>
            <li><a href="#">Buy</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </nav>
        <div class="header__menu__btn">
          <a href="#" class="btn btn--std btn--blue">become a vendor</a>
        </div>
      </div>
      <div class="header__right">
        <div class="header__search">
          <input type="text" name="search" id="" placeholder="Search" >
          <a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="29.014" height="22.358"><g data-name="Group 1700" fill="none" stroke="#fff" stroke-width="2"><g data-name="Ellipse 7"><circle cx="10.5" cy="10.5" r="10.5" stroke="none"/><circle cx="10.5" cy="10.5" r="9.5"/></g><path data-name="Path 29" d="M19.375 16.031l9.125 5.47"/></g></svg></a>
        </div>
        <div class="header__cart">
          <a href="#"><img src="@/assets/images/icons/cart_icon.svg" alt=""><span>0</span></a>
        </div>
        <div class="header__login" v-if="$store.getters.isAuthenticated" @mouseover="showUserMenu=true" @mouseleave="showUserMenu=false">
          <div class="user_menu">
            <img src="@/assets/images/icons/dashboard/profile_white.svg" alt="">
            <transition name="fade" mode="out-in">
            <div class="user_menu__dropdown" v-show="showUserMenu">
              <ul>
                <li><router-link to="/dashboard"><img src="@/assets/images/icons/dashboard/dashboard.svg" alt="">Dashboard</router-link></li>
                <li><router-link to="/dashboard"><img src="@/assets/images/icons/dashboard/profile.svg" alt="">My profile</router-link></li>
                <li><router-link to="/dashboard"><img src="@/assets/images/icons/dashboard/settings.svg" alt="">Settings</router-link></li>
                <li><a href="#" @click.prevent="logout"><img src="@/assets/images/icons/dashboard/logout.svg" alt="">Logout</a></li>
              </ul>
            </div>
            </transition>
          </div>
        </div>
        <div class="header__login" v-else>
          <router-link to="/signin">Login</router-link><span>/</span><router-link to="/login">Register</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import store from '@/store';
import AccountApi from '@/service/account';
import {
  ServerResponse, LogoutResult,
} from '@/model';

@Component
export default class Header extends Vue {
  @Prop({ default: 'header--nobg' }) private headerClass!: string;

  scrollClass = '';

  showMobileMenu = false;

  showUserMenu = false;

  accountApi: AccountApi;


  constructor() {
    super();

    this.accountApi = new AccountApi();
  }

  mounted(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  destroyed(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (): void => {
    this.bgColor();
  }

  toggleMobileMenu():void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  bgColor():void {
    if (document.documentElement.scrollTop >= 50) {
      this.scrollClass = 'add_bg';
    } else {
      this.scrollClass = '';
    }
  }

  logout(): void {
    const router = this.$router;

    const name = 'Home';

    // Logout
    this.accountApi
      .logout()
      .then((logoutResponse: ServerResponse<LogoutResult>) => {
        if (logoutResponse.success) {
          // Set CSRF Token
          const {
            csrfToken: token,
            csrfHeader: header,
          } = logoutResponse.result;

          store.commit('setCsrfToken', { token, header });

          // Update user data
          store.commit('logout');

          if (router.currentRoute.name !== name) {
            router.push({ name });
          }
        }
      });
  }
}
</script>
