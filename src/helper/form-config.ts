import { InputData, InputsConfig } from '@/model/forms-config';

const getFormInputData = (
  inputsConfig: InputsConfig,
  type: 'label' | 'placeholder' | 'customErrorMessages',
  id: string,
  step?: string,
): string | {[key: string]: string} | null => {
  if (step && Array.isArray(inputsConfig)) return null;
  /* eslint-disable */
  if (step) {
    if (!inputsConfig[step].some((x) => x.id === id) || !inputsConfig[step].find((x) => x.id === id)![type]) return null;
    return inputsConfig[step].find((x) => x.id === id)![type] as string | {[key: string]: string};
  }
  if (!(inputsConfig as InputData[]).some((x) => x.id === id) || !(inputsConfig as InputData[]).find((x) => x.id === id)![type]) return null;
  return (inputsConfig as InputData[]).find((x) => x.id === id)![type] as string | {[key: string]: string};
  /* eslint-enable */
};

// eslint-disable-next-line
export { getFormInputData };
