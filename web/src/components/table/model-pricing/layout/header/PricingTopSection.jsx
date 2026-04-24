/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { memo, useMemo } from 'react';
import { Input, Skeleton } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

const TAB_CONFIG = [
  { key: 'all', label: '全部模型', icon: '✦' },
  { key: 'OpenAI', label: 'OpenAI', icon: '◎' },
  { key: 'Anthropic', label: 'Anthropic', icon: '◈' },
  { key: 'Gemini', label: 'Gemini', icon: '◆' },
  { key: 'Moonshot', label: 'Moonshot', icon: '☾' },
  { key: 'DeepSeek', label: 'DeepSeek', icon: '◇' },
  { key: 'MiniMax', label: 'MiniMax', icon: '▣' },
];

const normalizeVendorName = (value = '') => value.toLowerCase();

const matchVendor = (model, vendorKey) => {
  if (vendorKey === 'all') return true;
  const vendorName = normalizeVendorName(model.vendor_name || '');
  const modelName = normalizeVendorName(model.model_name || '');
  const target = normalizeVendorName(vendorKey);

  if (target === 'gemini') {
    return vendorName.includes('google') || modelName.includes('gemini');
  }

  return vendorName.includes(target) || modelName.includes(target);
};

const PricingTopSection = memo(
  ({
    filterVendor,
    setFilterVendor,
    models = [],
    loading,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    searchValue,
    t,
  }) => {
    const tabs = useMemo(
      () =>
        TAB_CONFIG.map((tab) => ({
          ...tab,
          count:
            tab.key === 'all'
              ? models.length
              : models.filter((model) => matchVendor(model, tab.key)).length,
        })),
      [models],
    );

    return (
      <div className='cheapai-pricing-header'>
        <div className='cheapai-pricing-title-row'>
          <div>
            <h1>{t('模型与价格')}</h1>
            <p>{t('按模型厂商筛选，快速查看输入与输出价格')}</p>
          </div>
        </div>

        {loading ? (
          <Skeleton
            placeholder={
              <Skeleton.Title style={{ width: '100%', height: 48 }} />
            }
            loading
            active
          />
        ) : (
          <div className='cheapai-pricing-tabs'>
            {tabs.map((tab) => {
              const active = filterVendor === tab.key;
              return (
                <button
                  key={tab.key}
                  type='button'
                  className={`cheapai-pricing-tab ${active ? 'active' : ''}`}
                  onClick={() => setFilterVendor(tab.key)}
                >
                  <span className='cheapai-pricing-tab-icon'>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className='cheapai-tab-count'>{tab.count}</span>
                </button>
              );
            })}
          </div>
        )}

        <Input
          prefix={<IconSearch />}
          placeholder={t('搜索模型')}
          value={searchValue}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onChange={handleChange}
          showClear
          size='large'
          className='pricing-model-search cheapai-pricing-search'
        />
      </div>
    );
  },
);

PricingTopSection.displayName = 'PricingTopSection';

export default PricingTopSection;
