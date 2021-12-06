import ProfileApi from '@/service/profile';
import CartApi from '@/service/cart';
import store from '@/store';
import { EnumActivationStatus } from '@/model/account';

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
    const responses = await Promise.all([
      profileApi.getProfile(),
      cartApi.getCart(),
    ]);

    const { 0: profileResponse } = responses;
    const { 1: cartResponse } = responses;

    if (!profileResponse.success || !cartResponse.success) return { success: false };

    store.commit('setUserData', profileResponse.result);
    store.commit('setCartItems', cartResponse.result);
    console.log('cart', cartResponse);

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
