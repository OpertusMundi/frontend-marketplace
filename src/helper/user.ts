import ProfileApi from '@/service/profile';
import CartApi from '@/service/cart';
import store from '@/store';
import { EnumActivationStatus } from '@/model/account';
import { EnumRole } from '@/model/role';

const recursionInterval = 7000;

const fetchProfileRecursivelyUntilActivationCompleted = async (): Promise<void> => {
  const profileApi = new ProfileApi();

  try {
    const response = await profileApi.getProfile();

    if (response.success) store.commit('setUserData', response.result);

    if (!response.success || response.result.activationStatus !== EnumActivationStatus.COMPLETED) {
      setTimeout(() => {
        fetchProfileRecursivelyUntilActivationCompleted();
      }, recursionInterval);
    }
  } catch (err) {
    setTimeout(() => {
      fetchProfileRecursivelyUntilActivationCompleted();
    }, recursionInterval);
  }
};

const fetchUserProfileAndCart = async (): Promise<{ success: boolean }> => {
  const profileApi = new ProfileApi();
  const cartApi = new CartApi();

  try {
    const profileResponse = await profileApi.getProfile();
    if (!profileResponse.success) return { success: false };
    store.commit('setUserData', profileResponse.result);

    if (profileResponse.result.roles.some((x) => [EnumRole.ROLE_CONSUMER].includes(x))) {
      const cartResponse = await cartApi.getCart();
      if (!cartResponse.success) return { success: false };
      store.commit('setCartItems', cartResponse.result);
    }

    if (profileResponse.result.activationStatus !== EnumActivationStatus.COMPLETED) {
      setTimeout(() => {
        fetchProfileRecursivelyUntilActivationCompleted();
      }, recursionInterval);
    }

    return { success: true };
  } catch (err) {
    return { success: false };
  }
};

// eslint-disable-next-line
export { fetchUserProfileAndCart };
