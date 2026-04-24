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

import React, { useMemo } from 'react';
import { Table, Tag, Typography } from '@douyinfe/semi-ui';
import { calculateModelPrice } from '../../../../../helpers';

const { Text } = Typography;

const getBillingType = (modelData, t) => {
  if (modelData?.billing_mode === 'tiered_expr') return t('动态计费');
  if (modelData?.quota_type === 0) return t('按量计费');
  if (modelData?.quota_type === 1) return t('按次计费');
  return '-';
};

const getBillingTagColor = (text, t) => {
  if (text === t('按量计费')) return 'violet';
  if (text === t('按次计费')) return 'teal';
  if (text === t('动态计费')) return 'amber';
  return 'white';
};

const formatPrice = (value) => value || '-';

const ModelPricingTable = ({
  modelData,
  groupRatio,
  currency,
  siteDisplayType,
  tokenUnit,
  displayPrice,
  usableGroup,
  t,
}) => {
  const tableData = useMemo(() => {
    if (!modelData) return [];

    const modelEnableGroups = Array.isArray(modelData.enable_groups)
      ? modelData.enable_groups
      : [];
    const availableGroups = Object.keys(usableGroup || {})
      .filter((group) => group && group !== 'auto')
      .filter((group) => modelEnableGroups.length === 0 || modelEnableGroups.includes(group));
    const selectedGroup = availableGroups[0] || modelEnableGroups[0] || 'all';
    const priceData = calculateModelPrice({
      record: modelData,
      selectedGroup,
      groupRatio: groupRatio || {},
      tokenUnit,
      displayPrice,
      currency,
      quotaDisplayType: siteDisplayType,
    });

    return [
      {
        key: modelData.model_name,
        modelName: modelData.model_name || '-',
        billingType: getBillingType(modelData, t),
        inputPrice: formatPrice(priceData.inputPrice || priceData.price),
        outputPrice: formatPrice(priceData.completionPrice || priceData.price),
        cachePrice: formatPrice(priceData.cachePrice),
      },
    ];
  }, [
    modelData,
    usableGroup,
    groupRatio,
    tokenUnit,
    displayPrice,
    currency,
    siteDisplayType,
    t,
  ]);

  const columns = [
    {
      title: t('模型名称'),
      dataIndex: 'modelName',
      width: 220,
      render: (text) => <Text strong ellipsis={{ showTooltip: true }}>{text}</Text>,
    },
    {
      title: t('计费类型'),
      dataIndex: 'billingType',
      width: 110,
      render: (text) => (
        <Tag color={getBillingTagColor(text, t)} size='small' shape='circle'>
          {text || '-'}
        </Tag>
      ),
    },
    {
      title: t('输入价格'),
      dataIndex: 'inputPrice',
      width: 120,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t('补全价格'),
      dataIndex: 'outputPrice',
      width: 120,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: t('缓存读取价格'),
      dataIndex: 'cachePrice',
      width: 140,
      render: (text) => <Text strong>{text}</Text>,
    },
  ];

  return (
    <div className='model-detail-pricing-section'>
      <div className='mb-4'>
        <Text className='text-lg font-medium'>{t('模型与价格详细')}</Text>
      </div>
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={false}
        size='small'
        bordered={false}
        className='model-detail-price-table !rounded-lg'
        scroll={{ x: 720 }}
      />
    </div>
  );
};

export default ModelPricingTable;
