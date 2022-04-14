type ValidationType =
| 'required'
| 'email'
| 'confirmed'
| 'min'
| 'phone_number'
| 'vat'
| 'unique_name'
| 'iban'
| 'bic'

interface InputData {
  id: string,
  label: string,
  placeholder?: string,
  customErrorMessages?: {
    [key in ValidationType]?: string;
  },
}

type InputsConfig = { [key: string]: InputData[] } | InputData[];

export { InputData, InputsConfig };
