
export type StatColor = 'blue' | 'orange' | 'cyan' | 'purple' | 'green' | 'red' | 'gray';
export type FormatType = 'number' | 'currency' | 'text';

export interface StatItem {
  /** Título acima do valor (ex: "Orders") */
  label: string;

  /** Valor principal (número ou texto) */
  value: number | string;

  /** Formatação do valor principal */
  format?: {
    type: FormatType;
    currency?: string;     // se type='currency'
    digits?: string;       // ex: '1.0-0', '1.2-2'
    locale?: string;       // opcional; cai no LOCALE_ID se não vier
    prefix?: string;       // ex: 'R$ ' (quando quiser forçar um prefixo simples)
    suffix?: string;       // ex: 'k', '%'
  };

  /** Texto auxiliar (ex: "24 new", "since last week") */
  deltaText?: string;
  deltaSuffix?: string; // ex: "since last visit"

  /** Ícone PrimeIcons (ex: 'pi-shopping-cart') */
  icon?: string;

  /** Cor do “badge ícone” */
  color?: StatColor;

  /** Quando definido, o card vira um link */
  routerLink?: string | any[];

  /** Estado de carregamento por item */
  loading?: boolean;

  /** Dica (title/tooltip simples) */
  tooltip?: string;
}