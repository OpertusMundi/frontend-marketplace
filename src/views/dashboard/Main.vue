<template>
<div class="dashboard" v-bind:class="{sidebar_closed: sidebarClosed}">
    <div class="dashboard__sidebar" v-bind:class="{open: showMenuMobile, sidebar_closed: sidebarClosed}">
      <div class="dashboard__sidebar__inner">
        <nav class="dashboard__sidebar__nav">
          <ul>
            <li @click="toggleMobileMenu" class="logo">
              <router-link to="/" exact data-name="Homepage">
                <img class="logo__big" src="@/assets/images/logo-black.svg" alt=""><img class="logo__sm" src="@/assets/images/logo-black-sm.svg" alt="">
              </router-link>
            </li>
            <li @click="toggleMobileMenu">
              <router-link to="/dashboard" exact data-name="Dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="26.862" height="24" viewBox="0 0 26.862 24"><g id="Group_1971" data-name="Group 1971" transform="translate(-1761.883 -248.745)"><path id="Path_8965" data-name="Path 8965" d="M1779.2,270.282a2.131,2.131,0,0,0-.211-.353c-1.153-1.682-4.19-7-4.19-7a.5.5,0,0,0-.91.391s1.76,5.864,2.186,7.858a2.127,2.127,0,0,0,.11.4l0,.009h0a1.642,1.642,0,0,0,3.017-1.3h0Z" transform="translate(-2.396 -2.788)" fill="#333"/><path id="Path_8966" data-name="Path 8966" d="M1775.314,248.745a13.428,13.428,0,0,0-8.686,23.67,1.23,1.23,0,0,0,2.062-.775,1.192,1.192,0,0,0-.389-1.03,10.968,10.968,0,1,1,14.009.016,1.172,1.172,0,0,0-.372,1.014,1.229,1.229,0,0,0,2.021.811h0a13.429,13.429,0,0,0-8.646-23.706Z" fill="#333"/></g></svg>
                <span>Dashboard</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Assets')">
              <span>
                <router-link to="/dashboard/assets" data-name="Assets">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23.999" viewBox="0 0 24 23.999"><g id="Group_1969" data-name="Group 1969" transform="translate(-1493.5 -354.679)"><path id="Path_8960" data-name="Path 8960" d="M1505.595,376.4a.233.233,0,0,1-.218,0l-10.271-5.477a1.152,1.152,0,0,0-1.071,0h0a.953.953,0,0,0,0,1.713l11.2,5.972a.584.584,0,0,0,.542,0l11.178-5.961a.969.969,0,0,0,0-1.741h0a1.167,1.167,0,0,0-1.094,0Z" fill="#333"/><path id="Path_8961" data-name="Path 8961" d="M1505.609,371.288a.233.233,0,0,1-.218,0l-10.25-5.466a1.163,1.163,0,0,0-1.085,0h0a.965.965,0,0,0,0,1.735l11.178,5.961a.584.584,0,0,0,.542,0l11.179-5.962a.969.969,0,0,0,.005-1.74h0a1.169,1.169,0,0,0-1.095,0Z" fill="#333"/><path id="Path_8962" data-name="Path 8962" d="M1505.776,368.4l11.164-5.954a.973.973,0,0,0,0-1.749l-11.164-5.954a.584.584,0,0,0-.542,0L1494.07,360.7a.973.973,0,0,0,0,1.749l11.164,5.954A.584.584,0,0,0,1505.776,368.4Zm-8.825-6.916,8.445-4.5a.233.233,0,0,1,.218,0l8.444,4.5a.1.1,0,0,1,0,.175l-8.444,4.5a.234.234,0,0,1-.218,0l-8.445-4.5A.1.1,0,0,1,1496.951,361.487Z" fill="#333"/></g></svg>
                  <span>Assets</span>
                </router-link>
                <router-link v-if="!sidebarClosed" to="/dashboard/assets/create"><div class="btn--fab">+</div></router-link>
              </span>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Earnings')">
              <router-link to="/dashboard/earnings" data-name="Earnings">
                <svg xmlns="http://www.w3.org/2000/svg" width="24.004" height="24.055"><g data-name="Group 2645" fill="#333"><path data-name="Path 9480" d="M1 15.241a1 1 0 0 0-1 1v6.814a1 1 0 1 0 2 0v-6.813a1 1 0 0 0-1-1.001z"/><path data-name="Path 9481" d="M6.6 12.522a1 1 0 0 0-1 1v9.533a1 1 0 0 0 2 0v-9.532a1 1 0 0 0-1-1.001z"/><path data-name="Path 9482" d="M12.2 9.804a1 1 0 0 0-1 1v12.251a1 1 0 0 0 2 0v-12.25a1 1 0 0 0-1-1.001z"/><path data-name="Path 9483" d="M17.798 7.085a1 1 0 0 0-1 1v14.97a1 1 0 0 0 2 0V8.085a1 1 0 0 0-1-1z"/><path data-name="Path 9484" d="m23.674 4.973-5.2-4.714a1 1 0 0 0-1.342 0l-5.2 4.714a1 1 0 1 0 1.342 1.482l4.533-4.106 4.535 4.106a1 1 0 1 0 1.341-1.482z"/></g></svg>
                <span>Earnings</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Orders')">
              <router-link to="/dashboard/orders" data-name="Orders">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24.19"><g data-name="Group 2652" fill="#333"><path data-name="Path 9502" d="M10.691 22.18H2.01V2.015h14.956v12.648a1.006 1.006 0 0 0 2.011 0V2.015A2.013 2.013 0 0 0 16.966.004H2.01A2.013 2.013 0 0 0 0 2.015v20.169a2.013 2.013 0 0 0 2.01 2.01h8.681a1.005 1.005 0 1 0 0-2.01z"/><path data-name="Path 9503" d="M13.666 6.189h-8.16a1.006 1.006 0 0 0 0 2.011h8.16a1.006 1.006 0 0 0 0-2.011z"/><path data-name="Path 9504" d="M13.666 9.792h-8.16a1.006 1.006 0 0 0 0 2.011h8.16a1.006 1.006 0 0 0 0-2.011z"/><path data-name="Path 9505" d="M10.691 13.666H5.455a1.006 1.006 0 0 0 0 2.011h5.236a1.006 1.006 0 0 0 0-2.011z"/><path data-name="Path 9506" d="M23.509 12.256a1.006 1.006 0 0 0-1.379.35l-5.268 8.85-3.065-3.643a1.005 1.005 0 1 0-1.539 1.294l3.975 4.725a.86.86 0 0 0 .1.074.97.97 0 0 0 .157.143c.022.013.046.018.069.029a.709.709 0 0 0 .075.032 1.009 1.009 0 0 0 .37.08h.007a1 1 0 0 0 .3-.052c.029-.009.055-.021.084-.033a1.007 1.007 0 0 0 .213-.123c.015-.011.033-.015.048-.027s.009-.014.015-.019a1 1 0 0 0 .2-.236l5.991-10.065a1.006 1.006 0 0 0-.353-1.379z"/></g></svg>
                <span>Orders</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Contracts')">
              <router-link to="/dashboard/contracts" data-name="Contracts">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23.892"><g data-name="Group 2653" fill="#333"><path data-name="Path 9507" d="M20.291 21.892H3.709a1 1 0 0 0 0 2h16.583a1 1 0 0 0 0-2z"/><path data-name="Path 9508" d="M23 14.016h-2.2c-1.567-.088-4.328-.623-5.059-1.687-.639-.928-1.029-2.046.434-3.914l-.01-.008a5.169 5.169 0 0 0 .951-4.318 5.25 5.25 0 0 0-10.37 1.162 5.2 5.2 0 0 0 1.079 3.152l-.016.012c1.463 1.868 1.073 2.986.435 3.914-.759 1.1-3.737 1.613-5.06 1.687H.997a1 1 0 0 0-1 1v4.063a1 1 0 0 0 1 1h22a1 1 0 0 0 1-1v-4.063a1 1 0 0 0-.997-1zm-1 4.063H2v-2.063h1.572c1.012-.084 4.2-.475 5.828-2a3.359 3.359 0 0 0 .495-.555 4.781 4.781 0 0 0 .933-3.1 5.676 5.676 0 0 0-1.1-2.792 3.325 3.325 0 0 1-.334-.4 3.212 3.212 0 0 1-.539-2.735 3.25 3.25 0 0 1 6.4.816 3.222 3.222 0 0 1-.646 1.926 3.4 3.4 0 0 1-.23.279 5.8 5.8 0 0 0-1.2 2.9 4.721 4.721 0 0 0 .922 3.1 3.4 3.4 0 0 0 .495.555c1.567 1.465 4.565 1.892 5.7 2h1.71z"/></g></svg>
                <span>Contracts</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Analytics')">
              <router-link to="/dashboard/analytics" data-name="Analytics">
                <svg xmlns="http://www.w3.org/2000/svg" width="23.954" height="23.953" viewBox="0 0 23.954 23.953"><g id="Group_3586" data-name="Group 3586" transform="translate(-1396.997 -950.237)"><path id="Path_9719" data-name="Path 9719" d="M1419.882,964.082a1.006,1.006,0,0,0-1.224.707,10,10,0,1,1-12.325-12.24,1,1,0,1,0-.531-1.928,12,12,0,1,0,14.787,14.685A1,1,0,0,0,1419.882,964.082Z" fill="#333"/><path id="Path_9720" data-name="Path 9720" d="M1417.993,954.247a11.972,11.972,0,0,0-7.884-4.006,1.011,1.011,0,0,0-1.111,1v9.449a1.5,1.5,0,0,0,1.5,1.5h9.449a1.012,1.012,0,0,0,1-1.113A11.956,11.956,0,0,0,1417.993,954.247ZM1411,960.19v-7.8a10,10,0,0,1,7.8,7.8Z" fill="#333"/></g></svg>
                <span>Analytics</span>
              </router-link>
            </li>
            <hr>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Storage')">
              <router-link to="/dashboard/storage" data-name="Storage">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23.9" viewBox="0 0 24 23.9"><g id="Group_2758" data-name="Group 2758" transform="translate(-8.26 -339.4)"><path id="Path_9490" data-name="Path 9490" d="M30.36,348.2c-.7,1.1-4.1,2.9-10.1,2.9s-9.3-2-10.2-3a.992.992,0,1,0-1.5,1.3c1.6,1.8,5.8,3.7,11.7,3.7,6.4,0,10.6-2,11.8-3.8a1.012,1.012,0,1,0-1.7-1.1Z" fill="#333"/><path id="Path_9491" data-name="Path 9491" d="M31.76,353a.984.984,0,0,0-1.4.3c-.7,1.1-4.1,2.9-10.1,2.9s-9.3-2-10.2-3a.992.992,0,1,0-1.5,1.3c1.6,1.8,5.8,3.7,11.7,3.7,6.4,0,10.6-2,11.8-3.8A1.076,1.076,0,0,0,31.76,353Z" fill="#333"/><path id="Path_9492" data-name="Path 9492" d="M31.76,358.1a.984.984,0,0,0-1.4.3c-.7,1.1-4.1,2.9-10.1,2.9s-9.3-2-10.2-3a.992.992,0,0,0-1.5,1.3c1.6,1.8,5.9,3.7,11.7,3.7,6.4,0,10.6-2,11.8-3.8A1.076,1.076,0,0,0,31.76,358.1Z" fill="#333"/><path id="Path_9493" data-name="Path 9493" d="M20.26,348c5.8,0,12-1.4,12-4.3,0-3-6.2-4.3-12-4.3s-12,1.4-12,4.3S14.46,348,20.26,348Zm0-6.7c6.5,0,10,1.7,10,2.3s-3.5,2.3-10,2.3-10-1.7-10-2.3S13.76,341.3,20.26,341.3Z" fill="#333"/></g></svg>
                <span>t&#176;Drive</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Notebooks')">
              <router-link to="/dashboard/notebooks" data-name="Notebooks">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(-509.43 -974.84)" fill="#333" data-name="Group 3652"><path d="M531.338,974.841H514.511a2.047,2.047,0,0,0-2.092,2v2.674a1,1,0,1,0,1.993,0l-.009-2.638a.142.142,0,0,1,.108-.037h16.827c.06,0,.094.025.1.006l.009,19.967a.138.138,0,0,1-.106.037H514.511c-.062,0-.095-.022-.1-.008v-2.811a1,1,0,1,0-1.993,0v2.818a2.047,2.047,0,0,0,2.092,2h16.828a2.047,2.047,0,0,0,2.09-1.995V976.837A2.047,2.047,0,0,0,531.338,974.841Z" data-name="Path 9748"/><path d="m510.48 984.15h4.211a1 1 0 0 0 0-1.995h-4.211a1 1 0 0 0 0 1.995z" data-name="Path 9749"/><path d="m510.48 987.72h4.211a1 1 0 0 0 0-1.994h-4.211a1 1 0 0 0 0 1.994z" data-name="Path 9750"/><path d="m515.68 990.57a1 1 0 0 0-1-1h-4.262a1 1 0 0 0 0 2h4.262a1 1 0 0 0 1-1z" data-name="Path 9751"/><path d="m527.56 985.8a2 2 0 0 0 2-2v-2.952a2 2 0 0 0-2-2h-7.555a2 2 0 0 0-2 2v2.952a2 2 0 0 0 2 2zm-7.555-4.953h7.559v2.955h-7.56z" data-name="Path 9752"/></g></svg>
                <span>t&#176;Notebooks</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('TopioMaps')">
              <router-link to="/dashboard/topiomaps" data-name="TopioMaps">
                <svg xmlns="http://www.w3.org/2000/svg" width="23.892" height="24"><g data-name="Group 6109" fill="#333"><path data-name="Path 13503" d="m23.312 22.101-6.978-3.2a.99.99 0 0 0-.786-.018l-7.563 3.042-5.995-2.757V4.889a.995.995 0 0 0-1.99 0v14.917a1 1 0 0 0 .579.9l6.964 3.2a.992.992 0 0 0 .787.019l7.563-3.043 6.589 3.025a1 1 0 0 0 .83-1.809z"/><path data-name="Path 13504" d="M23.25 2.709 16.271.065a1 1 0 0 0-.666-.014L7.974 2.586 1.335.169a.995.995 0 0 0-.681 1.869l6.965 2.536a.991.991 0 0 0 .654.01l7.624-2.533 6.005 2.276v14.566a.995.995 0 0 0 1.99 0V3.64a1 1 0 0 0-.642-.931z"/><path data-name="Path 13505" d="M8.954 18.604V8.09a.995.995 0 1 0-1.99 0v10.514a.995.995 0 0 0 1.99 0z"/><path data-name="Path 13506" d="M16.914 15.824V5.503a1 1 0 0 0-1.99 0v10.321a1 1 0 0 0 1.99 0z"/></g></svg>
                <span>t&#176;Maps</span>
              </router-link>
            </li>
            <hr>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Purchases')">
              <router-link to="/dashboard/purchases" data-name="Purchases">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23.605"><g data-name="Group 2648" fill="#333"><path data-name="Path 9494" d="M23.971 21.303 21.483 6.939a.985.985 0 1 0-1.941.337l2.488 14.363H1.97L4.488 7.274a.986.986 0 0 0-1.942-.34L.028 21.303a1.972 1.972 0 0 0 1.943 2.3H22.03a1.972 1.972 0 0 0 1.941-2.307z"/><path data-name="Path 9495" d="M7.061 10.208a.985.985 0 0 0 .985-.985v-3.3a3.954 3.954 0 1 1 7.908 0v3.3a.985.985 0 1 0 1.97 0v-3.3a5.924 5.924 0 1 0-11.848 0v3.3a.984.984 0 0 0 .985.985z"/><path data-name="Path 9496" d="M10.362 6.116a.985.985 0 1 0 0 1.97h3.285a.985.985 0 1 0 0-1.97z"/></g></svg>
                <span>Purchases</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Subscriptions')">
              <router-link to="/dashboard/subscriptions" data-name="Subscriptions">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g data-name="Group 2654" fill="#333"><path data-name="Path 9509" d="M15.36 8.897a5.693 5.693 0 1 0-1.74 11.113 5.567 5.567 0 0 0 .749-.05.929.929 0 0 0-.245-1.841 3.835 3.835 0 1 1 .667-7.453 3.805 3.805 0 0 1 1.994 1.521l-1.927.012a1.02 1.02 0 0 0 .006 2.04h.006l5.193-.032V8.994a1.02 1.02 0 0 0-2.039 0v1.727a5.641 5.641 0 0 0-2.664-1.824z"/><path data-name="Path 9510" d="M19.267 1.019A1.019 1.019 0 0 0 18.247 0H2.039A2.042 2.042 0 0 0 0 2.039v16.208a1.02 1.02 0 1 0 2.039 0V2.039h16.208a1.019 1.019 0 0 0 1.02-1.02z"/><path data-name="Path 9511" d="M21.882 3.985H6.104a2.121 2.121 0 0 0-2.118 2.119v15.778A2.121 2.121 0 0 0 6.104 24h15.778A2.121 2.121 0 0 0 24 21.882V6.104a2.121 2.121 0 0 0-2.118-2.119zm0 17.9H6.104V6.104h15.778z"/></g></svg>
                <span>Subscriptions</span>
              </router-link>
            </li>
            <hr>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Messages')">
              <router-link to="/dashboard/messages" data-name="Messages">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16.667" viewBox="0 0 24 16.667"><g id="Group_1968" data-name="Group 1968" transform="translate(-1619.5 -489.374)"><path id="Path_8958" data-name="Path 8958" d="M1642.5,489.374h-22a1,1,0,0,0-1,1v14.667a1,1,0,0,0,1,1h22a1,1,0,0,0,1-1V490.374A1,1,0,0,0,1642.5,489.374Zm-1,14.667h-20V491.374h20Z" fill="#333"/><path id="Path_8959" data-name="Path 8959" d="M1630.831,501.357a1,1,0,0,0,1.341,0l6.944-6.292a1,1,0,1,0-1.344-1.482l-6.275,5.687-6.273-5.642a1,1,0,0,0-1.338,1.486Z" fill="#333"/></g></svg>
                <span>Messages</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Favorites')">
              <router-link to="/dashboard/favorites" data-name="Favorites">
                <svg xmlns="http://www.w3.org/2000/svg" width="22.854" height="24" viewBox="0 0 22.854 24"><g id="Group_1967" data-name="Group 1967" transform="translate(-1619.885 -604.282)"><path id="Path_8957" data-name="Path 8957" d="M1631.167,628.282l-.725-.762c-.307-.323-7.526-7.942-9.37-11.518a.982.982,0,1,1,1.746-.9c1.393,2.7,6.433,8.251,8.325,10.291,1.908-2.12,7.076-7.97,8.4-10.542l.109-.21a7.877,7.877,0,0,0,1.107-3.36,4.387,4.387,0,0,0-1.165-3.393,5.115,5.115,0,0,0-7.7.218l-.758.917-.758-.917a5.1,5.1,0,0,0-3.943-1.859,4.383,4.383,0,0,0-3.219,1.3,5.144,5.144,0,0,0-1.361,3.779.985.985,0,0,1-.959,1.007,1.006,1.006,0,0,1-1.006-.959,7.1,7.1,0,0,1,1.92-5.2,6.388,6.388,0,0,1,4.625-1.893,7.08,7.08,0,0,0,9.4,0,7.062,7.062,0,0,1,5.208,2.281,6.344,6.344,0,0,1,1.67,4.9,9.812,9.812,0,0,1-1.318,4.083l-.107.206c-1.741,3.39-9.1,11.418-9.411,11.759Z" fill="#333"/></g></svg>
                <span>Favorites</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Settings')">
              <router-link to="/dashboard/settings" data-name="Settings">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g id="Group_1966" data-name="Group 1966" transform="translate(-1496.007 -722.685)"><path id="Path_8954" data-name="Path 8954" d="M1508.093,730.748a3.938,3.938,0,1,0,3.939,3.937A3.942,3.942,0,0,0,1508.093,730.748Zm0,6.029a2.091,2.091,0,1,1,2.093-2.092A2.094,2.094,0,0,1,1508.093,736.777Z" fill="#333"/><path id="Path_8955" data-name="Path 8955" d="M1519.084,731.916h-1.228a9.977,9.977,0,0,0-.933-2.23l.874-.875a.922.922,0,0,0,0-1.3l-2.61-2.611a.921.921,0,0,0-1.305,0l-.9.9a10.034,10.034,0,0,0-2.207-.9v-1.29a.923.923,0,0,0-.923-.923h-3.692a.922.922,0,0,0-.923.923v1.339a10.02,10.02,0,0,0-2.145.908l-.961-.96a.95.95,0,0,0-1.3,0l-2.611,2.611a.923.923,0,0,0,0,1.3l.984.985a10.064,10.064,0,0,0-.871,2.12h-1.4a.923.923,0,0,0-.923.923v3.692a.922.922,0,0,0,.923.923h1.4a10.032,10.032,0,0,0,.871,2.122l-.985.984a.924.924,0,0,0,0,1.3l2.611,2.612a.923.923,0,0,0,1.3,0l.96-.961a10,10,0,0,0,2.146.908v1.338a.922.922,0,0,0,.923.923h3.692a.923.923,0,0,0,.923-.923v-1.289a10.043,10.043,0,0,0,2.207-.9l.9.9a.923.923,0,0,0,1.305,0l2.61-2.612a.922.922,0,0,0,0-1.3l-.874-.874a10.011,10.011,0,0,0,.933-2.232h1.228a.922.922,0,0,0,.923-.923v-3.692A.923.923,0,0,0,1519.084,731.916Zm-.923,3.692h-1.016a.732.732,0,0,0-.081.017.883.883,0,0,0-.212.042,1.008,1.008,0,0,0-.122.051.915.915,0,0,0-.184.124.925.925,0,0,0-.089.088.885.885,0,0,0-.125.186.978.978,0,0,0-.051.12,1.01,1.01,0,0,0-.047.112,8.232,8.232,0,0,1-1.24,2.966.77.77,0,0,0-.043.1.932.932,0,0,0-.1.34.92.92,0,0,0,0,.149.9.9,0,0,0,.038.193.892.892,0,0,0,.058.144.984.984,0,0,0,.11.165c.02.023.028.053.05.075l.729.73-1.3,1.3-.748-.748a.809.809,0,0,0-.078-.052.9.9,0,0,0-.148-.1.923.923,0,0,0-.165-.07.941.941,0,0,0-.168-.032.833.833,0,0,0-.173,0,.893.893,0,0,0-.177.034.94.94,0,0,0-.159.063.883.883,0,0,0-.09.036,8.216,8.216,0,0,1-2.95,1.2c-.029.006-.05.024-.078.032a.914.914,0,0,0-.191.079.857.857,0,0,0-.127.085.876.876,0,0,0-.136.136.882.882,0,0,0-.161.3.875.875,0,0,0-.036.176c0,.033-.019.062-.019.1v1.092h-1.846v-1.127c0-.025-.013-.047-.015-.072a.89.89,0,0,0-.041-.206.875.875,0,0,0-.058-.142.849.849,0,0,0-.1-.155.837.837,0,0,0-.117-.121.926.926,0,0,0-.143-.1.875.875,0,0,0-.175-.075.653.653,0,0,0-.076-.033,8.232,8.232,0,0,1-2.891-1.225.808.808,0,0,0-.085-.036.881.881,0,0,0-.172-.071.921.921,0,0,0-.171-.034.91.91,0,0,0-.173,0,.872.872,0,0,0-.173.034.9.9,0,0,0-.159.064.939.939,0,0,0-.156.1c-.024.02-.054.029-.077.051l-.819.819-1.305-1.3.838-.837a.719.719,0,0,0,.049-.074,1,1,0,0,0,.17-.315.935.935,0,0,0,.032-.166.915.915,0,0,0,0-.182.936.936,0,0,0-.1-.343c-.013-.025-.015-.052-.03-.077a8.217,8.217,0,0,1-1.177-2.859.926.926,0,0,0-.036-.087.9.9,0,0,0-.081-.19.792.792,0,0,0-.07-.1.906.906,0,0,0-.179-.176l-.06-.04a.916.916,0,0,0-.274-.113l-.043-.009a.894.894,0,0,0-.165-.033h-1.193v-1.846h1.195a.918.918,0,0,0,.338-.069c.031-.013.056-.033.086-.049a.917.917,0,0,0,.194-.13c.029-.028.052-.059.078-.089a.909.909,0,0,0,.12-.178.982.982,0,0,0,.048-.121.788.788,0,0,0,.04-.1,8.225,8.225,0,0,1,1.179-2.872.832.832,0,0,0,.033-.083.842.842,0,0,0,.067-.17.857.857,0,0,0,.034-.171.909.909,0,0,0,0-.173.844.844,0,0,0-.034-.173.868.868,0,0,0-.066-.158.947.947,0,0,0-.1-.155c-.019-.023-.028-.052-.049-.074l-.836-.835,1.305-1.306.822.821c.005.005.012.006.017.012a.926.926,0,0,0,.257.17.8.8,0,0,0,.081.03.908.908,0,0,0,.262.051.711.711,0,0,0,.093,0,.909.909,0,0,0,.241-.047.86.86,0,0,0,.119-.056,1.026,1.026,0,0,0,.095-.045,8.23,8.23,0,0,1,2.887-1.225c.025-.006.045-.023.069-.031a.921.921,0,0,0,.193-.083.87.87,0,0,0,.122-.083.892.892,0,0,0,.139-.143.88.88,0,0,0,.084-.126.959.959,0,0,0,.1-.344.662.662,0,0,0,.019-.091v-1.128h1.846v1.093a.847.847,0,0,0,.021.1.814.814,0,0,0,.033.163.875.875,0,0,0,.075.178.942.942,0,0,0,.086.127.849.849,0,0,0,.138.137.821.821,0,0,0,.13.088.88.88,0,0,0,.182.075.9.9,0,0,0,.085.035,8.2,8.2,0,0,1,2.946,1.192.937.937,0,0,0,.09.041.888.888,0,0,0,.117.054.909.909,0,0,0,.229.045.833.833,0,0,0,.356-.043,1.025,1.025,0,0,0,.1-.038.9.9,0,0,0,.245-.163c.007-.006.015-.007.021-.014l.752-.751,1.3,1.306-.732.732c-.019.019-.026.045-.043.065a.857.857,0,0,0-.119.18.937.937,0,0,0-.055.135.9.9,0,0,0-.038.193,1.035,1.035,0,0,0,0,.158.926.926,0,0,0,.035.18.937.937,0,0,0,.07.167.83.83,0,0,0,.036.087,8.2,8.2,0,0,1,1.241,2.966,1.037,1.037,0,0,0,.039.1.9.9,0,0,0,.052.133.832.832,0,0,0,.376.384,1.04,1.04,0,0,0,.1.058.921.921,0,0,0,.334.067h1.023Z" fill="#333"/></g></svg>
                <span>Settings</span>
              </router-link>
            </li>
            <li @click="toggleMobileMenu" v-if="isShownDueToUserRole('Users')">
              <router-link to="/dashboard/users" data-name="Users">
                <svg xmlns="http://www.w3.org/2000/svg" width="20.454" height="24"><g data-name="Group 3347" fill="#333"><path data-name="Path 8974" d="M10.227 11.113A5.557 5.557 0 1 0 4.67 5.557a5.563 5.563 0 0 0 5.557 5.556zm0-9.125a3.568 3.568 0 1 1-3.568 3.569 3.572 3.572 0 0 1 3.568-3.568z"/><path data-name="Path 8975" d="M10.227 12.12C6.69 12.12 0 14.394 0 23.006V24h20.454v-.994c0-8.612-6.689-10.886-10.227-10.886zm-8.2 9.891c.572-7.809 7.879-7.9 8.2-7.9s7.63.093 8.2 7.9z"/></g></svg>
                <span>Users</span>
              </router-link>
            </li>
          </ul>
        </nav>
        <a href="#" class="dashboard__sidebar__toggle" v-bind:class="{active: sidebarClosed}" @click.prevent="sidebarClosed = !sidebarClosed"><svg xmlns="http://www.w3.org/2000/svg" width="17.404" height="25.65" viewBox="0 0 17.404 25.65"><path id="Path_2292" data-name="Path 2292" d="M-1105.012-7721.223l11.469 14.086 11.871-14.086" transform="translate(-7704.786 1106.175) rotate(90)" fill="none" stroke="#333" stroke-width="3"/></svg></a>
      </div>
    </div>
    <div class="dashboard__wrapper">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import store from '@/store';
import { RouteConfig } from 'vue-router';
import { routes } from '../../router/index';

@Component
export default class DashboardMain extends Vue {
  @Prop({ required: false, default: false }) readonly showMenuMobile!: boolean;

  sidebarClosed = false;

  toggleMobileMenu():void {
    this.$emit('showHideMobileMenu', false);
  }

  // routeName must be exact same as .name in router/index.js
  isShownDueToUserRole(routeName: string): boolean {
    const route = routes.filter((x) => !x.children).concat(routes.filter((x) => x.children).flatMap((x) => x.children) as RouteConfig[])
      .find((x) => x.name === routeName);

    const requiredRole: string[] | null = route && route.meta && route.meta.requiresRole ? route.meta.requiresRole : null;

    if (requiredRole && !store.getters.hasRole(requiredRole)) {
      return false;
    }
    return true;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_dashboard.scss";
</style>
