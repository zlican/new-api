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

import React from 'react';
import { Button, Tag } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';
import { calculateModelPrice } from '../../../../../helpers';

const getModelType = (record) => {
  const vendorName = (record.vendor_name || '').toLowerCase();
  const modelName = (record.model_name || '').toLowerCase();

  if (vendorName.includes('anthropic') || modelName.includes('claude'))
    return 'anthropic';
  if (vendorName.includes('google') || modelName.includes('gemini'))
    return 'gemini';
  if (
    vendorName.includes('moonshot') ||
    modelName.includes('moonshot') ||
    modelName.includes('kimi')
  )
    return 'moonshot';
  if (vendorName.includes('deepseek') || modelName.includes('deepseek'))
    return 'deepseek';
  if (vendorName.includes('minimax') || modelName.includes('minimax'))
    return 'minimax';
  if (
    vendorName.includes('openai') ||
    modelName.includes('gpt') ||
    modelName.includes('openai')
  )
    return 'openai';

  return vendorName || 'model';
};

const renderBillingType = (quotaType, t) => {
  if (quotaType === 0) return t('按量计费');
  if (quotaType === 1) return t('按次计费');
  return t('按量计费');
};

const renderPrice = (record, priceData, t) => {
  if (priceData.isDynamicPricing) {
    return <span className='cheapai-price-muted'>{t('动态计费')}</span>;
  }

  if (priceData.isPerToken) {
    const unit = priceData.unitLabel || 'M';
    return (
      <div className='cheapai-price-stack'>
        <div>
          <strong>{priceData.inputPrice || '-'}</strong>
          <span>
            / {unit} {t('输入 tokens')}
          </span>
        </div>
        <div>
          <strong>{priceData.completionPrice || '-'}</strong>
          <span>
            / {unit} {t('输出 tokens')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='cheapai-price-stack'>
      <div>
        <strong>{priceData.price || '-'}</strong>
        <span>/ {t('次')}</span>
      </div>
    </div>
  );
};

export const getPricingTableColumns = ({
  t,
  selectedGroup,
  groupRatio,
  copyText,
  currency,
  siteDisplayType,
  tokenUnit,
  displayPrice,
}) => {
  const priceDataCache = new WeakMap();

  const getPriceData = (record) => {
    let cache = priceDataCache.get(record);
    if (!cache) {
      cache = calculateModelPrice({
        record,
        selectedGroup,
        groupRatio,
        tokenUnit,
        displayPrice,
        currency,
        quotaDisplayType: siteDisplayType,
        precision: 3,
      });
      priceDataCache.set(record, cache);
    }
    return cache;
  };

  return [
    {
      title: t('模型名称'),
      dataIndex: 'model_name',
      width: '46%',
      render: (text) => (
        <div className='cheapai-model-name-cell'>
          <button
            type='button'
            className='cheapai-model-name-copy'
            onClick={(event) => {
              event.stopPropagation();
              copyText(text);
            }}
          >
            <span>{text}</span>
          </button>
          <Button
            theme='borderless'
            type='tertiary'
            size='small'
            icon={<IconCopy />}
            onClick={(event) => {
              event.stopPropagation();
              copyText(text);
            }}
          />
        </div>
      ),
      onFilter: (value, record) =>
        record.model_name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: t('类型'),
      dataIndex: 'vendor_name',
      width: '18%',
      render: (_, record) => (
        <Tag color='green' shape='circle' className='cheapai-model-type-tag'>
          {getModelType(record)}
        </Tag>
      ),
    },
    {
      title: t('计费类型'),
      dataIndex: 'quota_type',
      width: '16%',
      render: (value) => (
        <Tag color='grey' shape='circle'>
          {renderBillingType(value, t)}
        </Tag>
      ),
      sorter: (a, b) => a.quota_type - b.quota_type,
    },
    {
      title: t('价格（输入 / 输出 tokens）'),
      dataIndex: 'price',
      width: '20%',
      render: (_, record) => renderPrice(record, getPriceData(record), t),
    },
  ];
};
