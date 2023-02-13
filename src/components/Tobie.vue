<template>
  <div class="tobie">
    <transition name="fade" mode="out-in" v-if="isChatOpen">
      <div class="tobie__chatbox">
        <div class="tobie__chatbox__header">
          <div class="tobie__chatbox__header__title">tobie</div>
          <div class="tobie__chatbox__header__subtitle">Your Topio assistant</div>
        </div>

        <div class="tobie__chatbox__main">
          <div
            v-for="message, i in messages" :key="i"
            class="tobie__chatbox__main__message"
            :class="message.isBot ? 'tobie__chatbox__main__message--bot' : 'tobie__chatbox__main__message--human'"
          >
            <div class="tobie__chatbox__main__message__bot-icon" v-if="message.isBot">
              <svg data-name="tobie avatar inside chat" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35"><g data-name="Ellipse 2" fill="#fff" stroke="#bcbcbc" stroke-width=".5"><circle cx="17.5" cy="17.5" r="17.5" stroke="none"/><circle cx="17.5" cy="17.5" r="17.25" fill="none"/></g><path data-name="Path 8740" d="m21.843 11.15.915-2.032a2.172 2.172 0 0 0 .527.064 2.308 2.308 0 0 0 1.106-.276A2.126 2.126 0 0 0 25.53 6.97a2.126 2.126 0 0 0-.638-1.6 2.355 2.355 0 0 0-3.2.024 2.1 2.1 0 0 0-.654 1.568 2.068 2.068 0 0 0 .31 1.115 2.217 2.217 0 0 0 .63.681l-.906 2.013a9.014 9.014 0 0 0-7.144 0l-.906-2.013a2.217 2.217 0 0 0 .627-.677 2.068 2.068 0 0 0 .31-1.115 2.1 2.1 0 0 0-.656-1.568 2.355 2.355 0 0 0-3.2-.024 2.126 2.126 0 0 0-.638 1.6 2.126 2.126 0 0 0 1.144 1.932 2.308 2.308 0 0 0 1.106.276 2.172 2.172 0 0 0 .527-.064l.915 2.032a9 9 0 0 0-1.53 14.693l5.915 5.915v-3.731a9 9 0 0 0 4.3-16.877m.448-5.175a1.479 1.479 0 0 1 1.987 0 1.328 1.328 0 0 1 .39 1 1.344 1.344 0 0 1-.39 1 1.479 1.479 0 0 1-1.987 0 1.336 1.336 0 0 1-.391-1 1.343 1.343 0 0 1 .391-1m-11.569 2a1.344 1.344 0 0 1-.39-1 1.328 1.328 0 0 1 .39-1 1.479 1.479 0 0 1 1.987 0 1.343 1.343 0 0 1 .391 1 1.336 1.336 0 0 1-.391 1 1.479 1.479 0 0 1-1.987 0m6.782 16.322a5.267 5.267 0 1 1 5.267-5.267 5.267 5.267 0 0 1-5.267 5.267" fill="#100699"/></svg>
            </div>
            <div class="tobie__chatbox__main__message__text">
              {{ message.text }}
            </div>
          </div>

          <div class="tobie__bottom"></div>
        </div>

        <div class="tobie__chatbox__new-message">
          <input type="text" placeholder="Type your message" v-model="newMessage" @keyup.enter="sendMessage">

          <div class="tobie__chatbox__new-message__btn-send" @click="sendMessage">
            <svg xmlns="http://www.w3.org/2000/svg" width="21.032" height="21.03" viewBox="0 0 21.032 21.03"><g data-name="Send icon"><g data-name="Group 1808"><path data-name="Path 8738" d="M20.118 9.83 1.547.599a.684.684 0 0 0-.854.215.813.813 0 0 0-.017.945l6.107 8.77-6.107 8.769a.816.816 0 0 0 .016.945.694.694 0 0 0 .556.286.66.66 0 0 0 .3-.071l18.571-9.231a.8.8 0 0 0 0-1.4Z" fill="#fff" stroke="#bcbcbc"/></g></g></svg>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div class="tobie__icon" @click="isChatOpen = true" v-if="!isChatOpen">
        <svg data-name="tobie avatar outside chat" xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62"><circle data-name="Ellipse 1" cx="31" cy="31" r="31" fill="#100699"/><path data-name="Path 8739" d="m38.073 20.262 1.511-3.355a3.587 3.587 0 0 0 .87.106 3.811 3.811 0 0 0 1.826-.456 3.51 3.51 0 0 0 1.881-3.2 3.511 3.511 0 0 0-1.054-2.637 3.888 3.888 0 0 0-5.283.04 3.461 3.461 0 0 0-1.079 2.593 3.414 3.414 0 0 0 .512 1.841 3.661 3.661 0 0 0 1.035 1.118l-1.5 3.324a14.884 14.884 0 0 0-11.8 0l-1.5-3.324a3.661 3.661 0 0 0 1.053-1.118 3.414 3.414 0 0 0 .51-1.841 3.461 3.461 0 0 0-1.08-2.589 3.888 3.888 0 0 0-5.283-.04 3.511 3.511 0 0 0-1.047 2.635 3.51 3.51 0 0 0 1.881 3.2 3.811 3.811 0 0 0 1.819.453 3.587 3.587 0 0 0 .87-.106l1.511 3.355a14.854 14.854 0 0 0-2.522 24.264l9.768 9.767v-6.161a14.858 14.858 0 0 0 7.1-27.869m.74-8.546a2.443 2.443 0 0 1 3.281 0 2.192 2.192 0 0 1 .644 1.653 2.22 2.22 0 0 1-.644 1.653 2.443 2.443 0 0 1-3.281 0 2.206 2.206 0 0 1-.646-1.653 2.217 2.217 0 0 1 .646-1.653m-19.103 3.306a2.22 2.22 0 0 1-.644-1.653 2.192 2.192 0 0 1 .644-1.653 2.443 2.443 0 0 1 3.281 0 2.217 2.217 0 0 1 .646 1.653 2.206 2.206 0 0 1-.646 1.653 2.443 2.443 0 0 1-3.281 0m11.193 26.95a8.7 8.7 0 1 1 8.7-8.7 8.7 8.7 0 0 1-8.7 8.7" fill="#fff"/></svg>
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div class="tobie__icon" @click="isChatOpen = false" v-if="isChatOpen">
        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62"><circle data-name="Ellipse 1" cx="31" cy="31" r="31" fill="#100699"/><g data-name="Group 3" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="3"><path data-name="Path 8" d="m19 20 23.802 22.196"/><path data-name="Path 9" d="M42.802 20 18.999 42.196"/></g></svg>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TobieApi from '@/service/tobie';

@Component
export default class Tobie extends Vue {
  tobieApi = new TobieApi();

  isChatOpen = false;

  messages = [
    {
      isBot: true,
      text: 'How can I help you with your data search?',
    },
  ];

  newMessage = '';

  sendMessage(): void {
    const message = this.newMessage;
    this.newMessage = '';

    this.messages.push({
      isBot: false,
      text: message,
    });
    this.scrollBottom();

    this.tobieApi.sendMessage({
      sender: 'user',
      message,
    }).then((response) => {
      this.messages.push({
        isBot: true,
        text: response.text,
      });

      this.scrollBottom();
    });
  }

  scrollBottom(): void {
    this.$nextTick(() => {
      (document.querySelector('.tobie__bottom') as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }

  // sendDummyMessage(): void {
  //   const message = this.newMessage;
  //   this.newMessage = '';

  //   this.messages.push({
  //     isBot: false,
  //     text: message,
  //   });

  //   setTimeout(() => {
  //     this.messages.push({
  //       isBot: true,
  //       text: 'blah blah blah blah. this is just a dummy response from bot. lorem ipsum...',
  //     });
  //   }, 600);
  // }
}
</script>
<style lang="scss" scoped>
  $tobieBlue: #100699;
  .tobie {
    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      right: 15px;
      bottom: 15px;
      z-index: 999999;
      border-radius: 50%;
      cursor: pointer;
    }

    &__chatbox {
      width: 360px;
      height: 560px;
      position: fixed;
      right: 15px;
      bottom: calc(15px + 62px + 15px);
      background: #fff;
      z-index: 999999;
      border-radius: 10px;
      box-shadow: 0px 0px 3px 1px $greyColor;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      &__header {
        background: $tobieBlue;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: .5rem 0;

        &__title {
          font-family: $titleFont;
          font-size: 2rem;
        }

        &__subtitle {
          font-size: .8rem;
        }
      }

      &__main {
        flex-grow: 1;
        padding: 15px;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;

        &__message {
          display: flex;
          margin-bottom: 15px;
          font-size: 0.9em;

          &:last-child {
            margin-bottom: 0;
          }

          &__bot-icon {
            margin-right: 10px;
          }

          &__text {
            padding: 10px 10px;
            border-radius: 9px;
          }

          &--bot {
            .tobie__chatbox__main__message__text {
              background: $lightBgColor;
              border-top-left-radius: 0;
            }
          }

          &--human {
            align-self: flex-end;
            color: #fff;
            .tobie__chatbox__main__message__text {
              background: $tobieBlue;
              border-top-right-radius: 0;
            }
          }
        }
      }

      &__new-message {
        bottom: 0;
        width: 100%;
        border-top: solid 2px $greyColor;
        display: flex;

        input {
          flex-grow: 1;
          border: none;
          outline: none;
          margin: 10px 0 10px 10px;
          font-size: 0.9em;
          color: $darkColor;
        }

        &__btn-send {
          margin: 10px;
          cursor: pointer;
        }
      }
    }

    &__bottom {
      margin-top: 15px;
    }
  }
</style>
