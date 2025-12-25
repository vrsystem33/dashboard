import { registerLocaleData } from '@angular/common';

// Americas
import localeEn from '@angular/common/locales/en';      // Inglês (default US)
import localePt from '@angular/common/locales/pt';      // Português Brasil
import localeEs from '@angular/common/locales/es';      // Espanhol (genérico)
import localeEsMx from '@angular/common/locales/es-MX'; // Espanhol México
import localeEsAr from '@angular/common/locales/es-AR'; // Espanhol Argentina
import localeEsCl from '@angular/common/locales/es-CL'; // Espanhol Chile

// Europa
import localeFr from '@angular/common/locales/fr';      // Francês
import localeFrCa from '@angular/common/locales/fr-CA'; // Francês Canadá
import localeDe from '@angular/common/locales/de';      // Alemão
import localeIt from '@angular/common/locales/it';      // Italiano
import localeNl from '@angular/common/locales/nl';      // Holandês
import localeRu from '@angular/common/locales/ru';      // Russo

// Ásia / Oriente Médio
import localeJa from '@angular/common/locales/ja';      // Japonês
import localeZh from '@angular/common/locales/zh';      // Chinês simplificado
import localeZhHant from '@angular/common/locales/zh-Hant'; // Chinês tradicional
import localeKo from '@angular/common/locales/ko';      // Coreano
import localeHi from '@angular/common/locales/hi';      // Hindi
import localeAr from '@angular/common/locales/ar';      // Árabe
import localeTr from '@angular/common/locales/tr';      // Turco

import localePl from '@angular/common/locales/pl';      // Polonês
import localeSv from '@angular/common/locales/sv';      // Sueco
import localeNo from '@angular/common/locales/no';      // Norueguês
import localeDa from '@angular/common/locales/da';      // Dinamarquês

// Registra apenas os que você quer suportar
const locales: Record<string, any> = {
  'en-US': localeEn,
  'pt-BR': localePt,
  'es-ES': localeEs,
  'es-MX': localeEsMx,
  'es-AR': localeEsAr,
  'es-CL': localeEsCl,
  'fr-FR': localeFr,
  'fr-CA': localeFrCa,
  'de-DE': localeDe,
  'it-IT': localeIt,
  'nl-NL': localeNl,
  'ru-RU': localeRu,
  'ja-JP': localeJa,
  'zh-CN': localeZh,
  'zh-Hant': localeZhHant,
  'ko-KR': localeKo,
  'hi-IN': localeHi,
  'ar-SA': localeAr,
  'tr-TR': localeTr,
  'pl-PL': localePl,
  'sv-SE': localeSv,
  'no-NO': localeNo,
  'da-DK': localeDa
};


export function loadLocale(locale: string) {
  if (locales[locale]) {
    registerLocaleData(locales[locale], locale);
  }
}
