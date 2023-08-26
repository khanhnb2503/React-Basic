import { useIntl } from "react-intl";

export function useTranslation() {
  const intl = useIntl();

  const translate = (key, params = {}) => {
    return intl.formatMessage({ id: key }, { ...params });
  };

  return { t: translate };
}
