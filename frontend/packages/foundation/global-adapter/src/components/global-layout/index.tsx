/*
 * Copyright 2025 coze-dev Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Outlet } from 'react-router-dom';
import { type FC, useEffect, useMemo } from 'react';

import { useUpdate } from 'ahooks';
import { BrowserUpgradeWrap } from '@coze-foundation/browser-upgrade-banner';
import { I18nProvider } from '@coze-arch/i18n/i18n-provider';
import { I18n } from '@coze-arch/i18n';
import { zh_CN, en_US } from '@coze-arch/coze-design/locales';
import {
  CDLocaleProvider,
  ThemeProvider,
  enUS,
  zhCN,
} from '@coze-arch/coze-design';
import { LocaleProvider } from '@coze-arch/bot-semi';

import { GlobalLayoutComposed } from '@/components/global-layout-composed';

const FORCED_LOCALE = 'zh-CN';

export const GlobalLayout: FC = () => {
  const update = useUpdate();
  const currentLocale = FORCED_LOCALE;

  // For historical reasons, en-US needs to be converted to en.
  const transformedCurrentLocale = currentLocale;

  useEffect(() => {
    if (I18n.language !== transformedCurrentLocale) {
      localStorage.setItem('i18next', transformedCurrentLocale);
      I18n.setLang(transformedCurrentLocale);
      // Force an update, otherwise the language switch will not take effect
      update();
    }
  }, [transformedCurrentLocale, update]);

  const isEnglishLocale = currentLocale === 'en-US';
  const cozeDesignLocale = useMemo(
    () =>
      isEnglishLocale
        ? { ...en_US, platform_name: 'Sailor' }
        : { ...zh_CN, platform_name: '水手' },
    [isEnglishLocale],
  );

  return (
    <I18nProvider i18n={I18n}>
      <CDLocaleProvider locale={cozeDesignLocale}>
        <LocaleProvider locale={currentLocale === 'en-US' ? enUS : zhCN}>
          <ThemeProvider
            defaultTheme="light"
            changeSemiTheme={true}
            changeBySystem={IS_BOE}
          >
            <BrowserUpgradeWrap>
              <GlobalLayoutComposed>
                <Outlet />
              </GlobalLayoutComposed>
            </BrowserUpgradeWrap>
          </ThemeProvider>
        </LocaleProvider>
      </CDLocaleProvider>
    </I18nProvider>
  );
};
