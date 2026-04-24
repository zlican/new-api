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

import React, { useMemo, useState } from 'react';
import { Card, Collapsible, Skeleton, Tag } from '@douyinfe/semi-ui';
import { IconChevronDown, IconChevronUp } from '@douyinfe/semi-icons';
import { VChart } from '@visactor/react-vchart';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StatsCards = ({
  groupedStatsData,
  loading,
  getTrendSpec,
  CARD_PROPS,
  CHART_CONFIG,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const initialOpenState = useMemo(() => {
    const state = {};
    groupedStatsData.forEach((_, index) => {
      state[index] = true;
    });
    return state;
  }, [groupedStatsData]);
  const [openGroups, setOpenGroups] = useState(initialOpenState);

  const toggleGroup = (index) => {
    setOpenGroups((prev) => ({
      ...prev,
      [index]: !(prev[index] ?? true),
    }));
  };

  return (
    <div className='cyber-stats-console mb-4'>
      <div className='cyber-stats-accordion grid grid-cols-1 md:grid-cols-2 gap-4'>
        {groupedStatsData.map((group, idx) => (
          <Card
            key={idx}
            {...CARD_PROPS}
            className={`cyber-stat-group ${group.color} border-0 !rounded-2xl w-full`}
            title={
              <button
                type='button'
                className='cyber-stat-title'
                onClick={() => toggleGroup(idx)}
              >
                <span>{group.title}</span>
                <span className='cyber-stat-chevron'>
                  {(openGroups[idx] ?? true) ? (
                    <IconChevronUp />
                  ) : (
                    <IconChevronDown />
                  )}
                </span>
              </button>
            }
          >
            <Collapsible isOpen={openGroups[idx] ?? true} keepDOM>
              <div className='cyber-stat-items grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {group.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className='cyber-stat-item flex items-center justify-between cursor-pointer'
                    onClick={item.onClick}
                  >
                    <div className='flex items-center min-w-0'>
                      <div>
                        <div className='text-xs text-gray-500'>
                          {item.title}
                        </div>
                        <div className='text-lg font-normal'>
                          <Skeleton
                            loading={loading}
                            active
                            placeholder={
                              <Skeleton.Paragraph
                                active
                                rows={1}
                                style={{
                                  width: '65px',
                                  height: '24px',
                                  marginTop: '4px',
                                }}
                              />
                            }
                          >
                            {item.value}
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                    {item.title === t('当前余额') ? (
                      <Tag
                        color='white'
                        shape='circle'
                        size='large'
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/console/topup');
                        }}
                      >
                        {t('充值')}
                      </Tag>
                    ) : (
                      (loading ||
                        (item.trendData && item.trendData.length > 0)) && (
                        <div className='w-24 h-10'>
                          <VChart
                            spec={getTrendSpec(item.trendData, item.trendColor)}
                            option={CHART_CONFIG}
                          />
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
