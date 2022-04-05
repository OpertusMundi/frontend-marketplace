const europeanCodeToISOCode = (code: string): string => {
  if (code === 'EL') return 'GR';
  return code;
};

// eslint-disable-next-line
export { europeanCodeToISOCode };
