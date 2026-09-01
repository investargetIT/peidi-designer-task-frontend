<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import LaySearch from "../lay-search/index.vue";
import LayNotice from "../lay-notice/index.vue";
import LayNavMix from "../lay-sidebar/NavMix.vue";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import LaySidebarFullScreen from "../lay-sidebar/components/SidebarFullScreen.vue";
import LaySidebarBreadCrumb from "../lay-sidebar/components/SidebarBreadCrumb.vue";
import LaySidebarTopCollapse from "../lay-sidebar/components/SidebarTopCollapse.vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import GlobalizationIcon from "@/assets/svg/globalization.svg?component";
import LogoutCircleRLine from "~icons/ri/logout-circle-r-line";
import EpEdit from "~icons/ep/edit";
import Setting from "~icons/ri/settings-3-line";
import Check from "~icons/ep/check";
import EpArrowDown from "~icons/ep/arrow-down";
import RiFormatClear from "~icons/ri/format-clear";
import { isDevEnv } from "@/utils/debug";
import { emitter } from "@/utils/mitt";
import { formatToken, getToken } from "@/utils/auth";
import { storageLocal } from "@pureadmin/utils";
import { computed, ref } from "vue";

// 从本地存储中读取用户信息，作为登录用户名的兜底来源
const USER_INFO: any = storageLocal().getItem("dataSource");

const { onReset } = useDataThemeChange();

const {
  layout,
  device,
  logout,
  onPanel,
  pureApp,
  username,
  userAvatar,
  avatarsStyle,
  toggleSideBar,
  getDropdownItemStyle,
  getDropdownItemClass
} = useNav();

const { t, locale, translationCh, translationEn } = useTranslationLang();

// 登录用户名：优先使用 store 中的昵称/用户名，为空时回退到 dataSource 中的 username
const displayUsername = computed(
  () => username.value || USER_INFO?.username || ""
);

emitter.on("logout", () => {
  logout();
});

const PWD_CHANGE_REQUEST_CONFIG = {
  url: "https://user.peidigroup.cn/user/update-password",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: formatToken(getToken().accessToken)
  },
  data: {
    identifier: JSON.parse(localStorage.getItem("dataSource") || "{}")?.id
  },
  timeout: 1000 * 10
};
const pwdChangeVisible = ref(false);
</script>

<template>
  <div class="navbar bg-[#fff] shadow-xs shadow-[rgba(0,21,41,0.08)]">
    <LaySidebarTopCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />

    <LaySidebarBreadCrumb
      v-if="layout !== 'mix' && device !== 'mobile'"
      class="breadcrumb-container"
    />

    <LayNavMix v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- 菜单搜索 -->
      <LaySearch v-show="false" id="header-search" />
      <!-- 国际化 -->
      <el-dropdown v-show="isDevEnv()" id="header-translation" trigger="click">
        <GlobalizationIcon
          class="navbar-bg-hover w-[40px] h-[48px] p-[11px] cursor-pointer outline-hidden"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['dark:text-white!', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <IconifyIconOffline
                v-show="locale === 'zh'"
                class="check-zh"
                :icon="Check"
              />
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              :class="['dark:text-white!', getDropdownItemClass(locale, 'en')]"
              @click="translationEn"
            >
              <span v-show="locale === 'en'" class="check-en">
                <IconifyIconOffline :icon="Check" />
              </span>
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 全屏 -->
      <LaySidebarFullScreen v-show="false" id="full-screen" />
      <!-- 消息通知 -->
      <LayNotice v-show="false" id="header-notice" />
      <!-- 清空缓存 -->
      <el-button v-show="isDevEnv()" text @click="onReset">
        <IconifyIconOffline :icon="RiFormatClear" class="text-[#09090b]" />
      </el-button>

      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link user-info navbar-bg-hover select-none">
          <img
            :src="userAvatar"
            :style="avatarsStyle"
            class="user-avatar"
          />
          <p v-if="displayUsername" class="user-name dark:text-white">
            {{ displayUsername }}
          </p>
          <el-icon class="user-caret"><EpArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="pwdChangeVisible = true">
              <IconifyIconOffline :icon="EpEdit" style="margin: 5px" />
              {{ t("pd.navbar.changePassword") }}
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              {{ t("buttons.pureLoginOut") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span
        v-show="false"
        class="set-icon navbar-bg-hover"
        :title="t('buttons.pureOpenSystemSet')"
        @click="onPanel"
      >
        <IconifyIconOffline :icon="Setting" />
      </span>
    </div>

    <pd-PwdChangeForm
      v-model:visible="pwdChangeVisible"
      :requestConfig="PWD_CHANGE_REQUEST_CONFIG"
    />
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    color: #000000d9;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 48px;
      padding: 10px;
      color: #000000d9;
      cursor: pointer;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }

    /* 用户信息样式 */
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 34px;
      padding: 0 12px;
      margin-right: 8px;
      border-radius: 999px;
      background: #f4f6fa;
      transition: all 0.25s ease;

      &:hover {
        background: #e8edf5;
        box-shadow: 0 2px 8px rgba(0, 21, 41, 0.08);
      }

      .user-avatar {
        width: 26px;
        height: 26px;
        border: 2px solid #fff;
        box-shadow: 0 0 0 1px rgba(0, 21, 41, 0.08);
        flex-shrink: 0;
      }

      .user-name {
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 500;
        line-height: 1;
        color: #1f2d3d;
      }

      .user-caret {
        font-size: 12px;
        color: #909399;
        transition: transform 0.25s ease;
      }

      &:hover .user-caret {
        transform: rotate(-180deg);
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.logout {
  width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
