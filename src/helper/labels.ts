import labels from '@/config/labels';

export default (text: string, searchById = false): string => (labels.find((x) => (searchById ? x.id === text : x.text === text))?.label || 'ERR');
