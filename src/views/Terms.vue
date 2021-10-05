<template>
  <div class="page terms">
    <div class="m_container">
      <div class="terms__inner">
        <div class="terms__sidebar">
            <h1 class="terms__sidebar__title">Terms of Service</h1>
            <div class="terms__sidebar__menu">
              <ul>
                <li><a id="side1" :class="{active: activeMenuItem == 1}" href="#" @click.prevent="scrollToSection('1')">Preamble</a></li>
                <li><a id="side2" :class="{active: activeMenuItem == 2}" href="#" @click.prevent="scrollToSection('2')">Definitions</a></li>
                <li><a id="side3" :class="{active: activeMenuItem == 3}" href="#" @click.prevent="scrollToSection('3')">1. Purpose</a></li>
                <li><a id="side4" :class="{active: activeMenuItem == 4}" href="#" @click.prevent="scrollToSection('4')">2. Legal documentation</a></li>
                <li><a id="side5" :class="{active: activeMenuItem == 5}" href="#" @click.prevent="scrollToSection('5')">3. Site and platform accessibility</a></li>
                <li><a id="side6" :class="{active: activeMenuItem == 6}" href="#" @click.prevent="scrollToSection('6')">4. Infrastructure location and security</a></li>
                <li><a id="side7" :class="{active: activeMenuItem == 7}" href="#" @click.prevent="scrollToSection('7')">5. Description of services provided</a></li>
                <li><a id="side8" :class="{active: activeMenuItem == 8}" href="#" @click.prevent="scrollToSection('8')">6. Creating a Vendor account</a></li>
              </ul>
            </div>
        </div>
        <div id="terms-main" class="terms__main">
          <div class="terms__main__text">
            <p>February 02, 2020</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <!-- <p>A translated version of the Dawex General Terms and Conditions is provided to facilitate your understanding. However, it is the French version of the General Terms and Conditions that is legally binding in case of a dispute.</p> -->
          </div>
          <h2 class="terms__main__title" id="main1">Preamble</h2>
          <div class="terms__main__text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <h2 class="terms__main__title" id="main2">Definitions</h2>
          <div class="terms__main__text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <h2 class="terms__main__title" id="main3">1. Purpose</h2>
          <div class="terms__main__text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <h2 class="terms__main__title" id="main4">2. Legal documentation</h2>
          <div class="terms__main__text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <h2 class="terms__main__title" id="main5">3. Site and platform accessibility</h2>
          <div class="terms__main__text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <h2 class="terms__main__title" id="main6">4. Infrastructure location and security</h2>
          <div class="terms__main__text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <h2 class="terms__main__title" id="main7">5. Description of services provided</h2>
          <div class="terms__main__text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <h2 class="terms__main__title" id="main8">6. Creating a Vendor account</h2>
          <div class="terms__main__text">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component
export default class Terms extends Vue {
  activeMenuItem = 1;

  TitleOffsets = [];

  topPos = 0;

  mounted():void {
    this.initAOS();
    window.addEventListener('scroll', this.changeActiveSideItem);
  }

  changeActiveSideItem():void {
    const titles:any = document.getElementsByClassName('terms__main__title');
    // const titlesArray = Array.prototype.slice.call(titles);
    for (let i = 0; i <= titles.length; i += 1) {
      if (titles[i]) {
        if (document.documentElement.scrollTop + 245 >= titles[i].offsetTop) {
          this.activeMenuItem = i + 1;
        }
      }
    }
  }

  initAOS = (): void => {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  }

  scrollToSection(section:number):void {
    this.activeMenuItem = section;
    const MainID = `main${section}`;
    const MainEl = document.getElementById(MainID);
    if (MainEl) {
      this.topPos = MainEl.offsetTop;
    }
    document.documentElement.scrollTop = this.topPos - 230;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_terms.scss";
</style>
