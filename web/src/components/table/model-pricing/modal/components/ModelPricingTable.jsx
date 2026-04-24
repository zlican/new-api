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
import { Typography, Table, Tag } from '@douyinfe/semi-ui';
import { calculateModelPrice } from '../../../../../helpers';

const { Text } = Typography;

const ModelPricingTable = ({
  modelData,
  groupRatio,
  currency,
  siteDisplayType,
  tokenUnit,
  displayPrice,
  usableGroup,
  autoGroups = [],
  t,
}) => {
  const modelEnableGroups = Array.isArray(modelData?.enable_groups)
    ? modelData.enable_groups
    : [];
  const autoChain = autoGroups.filter((g) => modelEnableGroups.includes(g));
  const renderGroupPriceTable = () => {
    // 仅展示模型可用的分组：模型 enable_groups 与用户可用分组的交集

    const availableGroups = Object.keys(usableGroup || {})
      .filter((g) => g !== '')
      .filter((g) => g !== 'auto')
      .filter((g) => modelEnableGroups.includes(g));

    // 准备表格数据
    const tableData = availableGroups.map((group) => {
      const priceData = modelData
        ? calculateModelPrice({
            record: modelData,
            selectedGroup: group,
            groupRatio,
            tokenUnit,
            displayPrice,
            currency,
            quotaDisplayType: siteDisplayType,
          })
        : { inputPrice: '-', outputPrice: '-', price: '-' };

      // 获取分组倍率
      const groupRatioValue =
        groupRatio && groupRatio[group] ? groupRatio[group] : 1;

      return {
        key: group,
        group: group,
        ratio: groupRatioValue,
        billingType:
          modelData?.billing_mode === 'tiered_expr'
            ? t('动态计费')
            : modelData?.quota_type === 0
              ? t('按量计费')
              : modelData?.quota_type === 1
                ? t('按次计费')
                : '-',
        inputPrice: priceData.inputPrice || '-',
        outputPrice: priceData.completionPrice || priceData.price || '-',
        cachePrice: priceData.cachePrice || '-',
      };
    });

    const columns = [
      {
        title: t('模型名称'),
        dataIndex: 'modelName',
        render: () => <Text strong>{modelData?.model_name || '-'}</Text>,
      },
      {
        title: t('计费类型'),
        dataIndex: 'billingType',
        render: (text) => {
          let color = 'white';
          if (text === t('按量计费')) color = 'violet';
          else if (text === t('按次计费')) color = 'teal';
          else if (text === t('动态计费')) color = 'amber';
          return (
            <Tag color={color} size='small' shape='circle'>
              {text || '-'}
            </Tag>
          );
        },
      },
      {
        title: t('输入价格'),
        dataIndex: 'inputPrice',
        render: (text) => <Text strong>{text || '-'}</Text>,
      },
      {
        title: t('补全价格'),
        dataIndex: 'outputPrice',
        render: (text) => <Text strong>{text || '-'}</Text>,
      },
      {
        title: t('缓存读取价格'),
        dataIndex: 'cachePrice',
        render: (text) => <Text strong>{text || '-'}</Text>,
      },
      {
        title: t('分组'),
        dataIndex: 'group',
        render: (text) => (
          <Tag color='white' size='small' shape='circle'>
            {text}
            {t('分组')}
          </Tag>
        ),
      },
    ];

    return (
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={false}
        size='small'
        bordered={false}
        className='model-detail-price-table !rounded-lg'
        scroll={{ x: 'max-content' }}
      />
    );
  };

  return (
    <div>
      <div className='mb-4'>
        <Text className='text-lg font-medium'>{t('模型与价格详细')}</Text>
        <div className='text-xs text-gray-600'>
          {t('横向展示模型名称、计费类型与关键价格')}
        </div>
      </div>
      {autoChain.length > 0 && (
        <div className='flex flex-wrap items-center gap-1 mb-4'>
          <span className='text-sm text-gray-600'>{t('auto分组调用链路')}</span>
          <span className='text-sm'>→</span>
          {autoChain.map((g, idx) => (
            <React.Fragment key={g}>
              <Tag color='white' size='small' shape='circle'>
                {g}
                {t('分组')}
              </Tag>
              {idx < autoChain.length - 1 && <span className='text-sm'>→</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      {renderGroupPriceTable()}
    </div>
  );
};

export default ModelPricingTable;
