import { Feature } from '@/model/sentinel-hub';

export const fallbackThumbnail = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZYAAADpCAIAAACImYZhAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAMUSURBVHhe7dQxDQAwDMCwbvwhFdyekYhkP2GQs7sD0HR/AYIsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoAwCwPCLAwIszAgzMKAMAsDwiwMCLMwIMzCgDALA8IsDAizMCDMwoCsmQc7rwQGCUtr1QAAAABJRU5ErkJggg==';

export const getFeatureThumbnail = (collectionId: string, feature: Feature): string => {
  switch (collectionId) {
    case 'sentinel-1-grd':
    case 'sentinel-2-l1c': {
      return feature.assets?.thumbnail?.href || fallbackThumbnail;
    }
    case 'sentinel-2-l2a': {
      return feature.assets?.data?.href && feature.assets.data.href.split('/tiles/').length > 1
        ? `https://roda.sentinel-hub.com/sentinel-s2-l1c/tiles/${feature.assets.data.href.split('/tiles/')[1]}preview.jpg`
        : fallbackThumbnail;
    }
    case 'landsat-8-l1c': {
      return `https://landsatlook.usgs.gov/gen-browse?size=thumb&type=refl&product_id=${feature.id}`;
    }
    case 'sentinel-5p-l2':
    default: {
      return fallbackThumbnail;
    }
  }
};
