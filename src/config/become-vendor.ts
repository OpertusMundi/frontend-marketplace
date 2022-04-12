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

interface InputsConfig {
  [key: string]: InputData[],
}

const inputsConfig: InputsConfig = {
  step1: [
    {
      id: 'name',
      label: 'Name',
      customErrorMessages: { unique_name: 'This company is already registered as a supplier' },
    },
    {
      id: 'email',
      label: 'Email',
    },
    {
      id: 'site_url',
      label: 'Website',
    },
    {
      id: 'headquarters_address_line_1',
      label: 'Address Line 1',
    },
    {
      id: 'headquarters_address_line_2',
      label: 'Address Line 2',
    },
    {
      id: 'headquarters_country',
      label: 'Country',
    },
    {
      id: 'headquarters_region',
      label: 'Region',
    },
    {
      id: 'headquarters_city',
      label: 'City',
    },
    {
      id: 'headquarters_postal_code',
      label: 'ZIP code',
    },
    {
      id: 'company_number',
      label: 'VAT number',
    },
  ],
  step2: [
    {
      id: 'representative_first_name',
      label: 'First name',
    },
    {
      id: 'representative_last_name',
      label: 'Last name',
    },
    {
      id: 'representative_email',
      label: 'Email',
    },
    {
      id: 'representative_birthdate',
      label: 'Birthdate',
    },
    {
      id: 'representative_nationality',
      label: 'Nationality',
    },
    {
      id: 'representative_country_residence',
      label: 'Country of residence',
    },
    {
      id: 'representative_address_line_1',
      label: 'Address line 1',
    },
    {
      id: 'representative_address_line_2',
      label: 'Address line 2',
    },
    {
      id: 'representative_country',
      label: 'Country',
    },
    {
      id: 'representative_region',
      label: 'Region',
    },
    {
      id: 'representative_city',
      label: 'City',
    },
    {
      id: 'representative_postal_code',
      label: 'ZIP code',
    },
  ],
  step3: [
    {
      id: 'bankaccount_owner_name',
      label: 'Holder name',
    },
    {
      id: 'bankaccount_iban',
      label: 'IBAN',
    },
    {
      id: 'bankaccount_bic',
      label: 'BIC',
    },
    {
      id: 'bankaccount_address_line_1',
      label: 'Address Line 1',
    },
    {
      id: 'bankaccount_address_line_2',
      label: 'Address Line 2',
    },
    {
      id: 'bankaccount_country',
      label: 'Country',
    },
    {
      id: 'bankaccount_region',
      label: 'Region',
    },
    {
      id: 'bankaccount_city',
      label: 'City',
    },
    {
      id: 'bankaccount_postal_code',
      label: 'ZIP code',
    },
  ],
};

// eslint-disable-next-line
export { inputsConfig };
