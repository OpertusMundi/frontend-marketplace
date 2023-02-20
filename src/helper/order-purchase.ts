import { EnumOrderStatus, ConsumerOrder, ProviderOrder } from '@/model/order';
import { EnumDeliveryMethod } from '@/model/catalogue';

const getOrderSteps = (order: ConsumerOrder | ProviderOrder): { status: EnumOrderStatus, label: string, completed: boolean, active: boolean }[] => {
  let steps = [] as { status: EnumOrderStatus, label: string, completed?: boolean, active?: boolean }[];

  switch (order.deliveryMethod) {
    case EnumDeliveryMethod.DIGITAL_PLATFORM: {
      steps = [
        { status: EnumOrderStatus.CREATED, label: 'Purchase requested' },
        { status: EnumOrderStatus.CHARGED, label: 'PayIn created' },
        { status: EnumOrderStatus.SUCCEEDED, label: 'Order complete' },
      ];
      break;
    }
    case EnumDeliveryMethod.PHYSICAL_PROVIDER:
    case EnumDeliveryMethod.DIGITAL_PROVIDER: {
      steps = [
        { status: EnumOrderStatus.CREATED, label: 'Purchase requested' },
        { status: EnumOrderStatus.CHARGED, label: 'PayIn created' },
        { status: EnumOrderStatus.PENDING_PROVIDER_SEND_CONFIRMATION, label: 'Payment has been received<br>Shipping is pending' },
        { status: EnumOrderStatus.PENDING_CONSUMER_RECEIVE_CONFIRMATION, label: 'Order is shipped<br>Delivery is pending' },
        { status: EnumOrderStatus.ASSET_REGISTRATION, label: 'Order is delivered<br>Registration is pending' },
        { status: EnumOrderStatus.SUCCEEDED, label: 'Order complete' },
      ];
      break;
    }
    default:
      break;
  }

  if (order.vettingRequired) {
    steps.splice(1, 0, ...[
      { status: EnumOrderStatus.PENDING_PROVIDER_APPROVAL, label: 'Pending provider approval' },
      { status: EnumOrderStatus.PROVIDER_ACCEPTED, label: 'Accepted by provider<br> Awaiting PayIn' },
    ]);
  }

  const currentStep = steps.findIndex((x) => x.status === order.status);
  steps = steps.map((x, i) => ({ ...x, completed: i < currentStep, active: i === currentStep }));

  return steps as { status: EnumOrderStatus, label: string, completed: boolean, active: boolean }[];
};

const getOrderStatusDescription = (status: EnumOrderStatus): string => {
  const descriptions: { status: EnumOrderStatus, description: string }[] = [
    { status: EnumOrderStatus.CREATED, description: 'Order created.' },
    { status: EnumOrderStatus.PENDING_PROVIDER_APPROVAL, description: 'Order created. Awaiting vendor\'s approval.' },
    { status: EnumOrderStatus.PROVIDER_REJECTED, description: 'Order has been rejected.' },
    { status: EnumOrderStatus.PROVIDER_ACCEPTED, description: 'Order has been accepted.' },
    { status: EnumOrderStatus.CHARGED, description: 'PayIn created. Awaiting payment receival.' },
    { status: EnumOrderStatus.PENDING_PROVIDER_SEND_CONFIRMATION, description: 'Payment received. Awaiting shipping.' },
    { status: EnumOrderStatus.PENDING_CONSUMER_RECEIVE_CONFIRMATION, description: 'Order shipped. Awaiting delivery.' },
    { status: EnumOrderStatus.ASSET_REGISTRATION, description: 'Asset/subscription registration is pending.' },
    { status: EnumOrderStatus.CANCELLED, description: 'Order has been cancelled, no payment received' },
    { status: EnumOrderStatus.REFUNDED, description: 'Order has been cancelled, PayIn has been refunded' },
    { status: EnumOrderStatus.SUCCEEDED, description: 'Order has been completed.' },
  ];

  return descriptions.find((x) => x.status === status)?.description || '';
};

export { getOrderSteps, getOrderStatusDescription };
