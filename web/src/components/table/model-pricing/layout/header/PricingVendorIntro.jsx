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

import React, { useMemo, useCallback, memo } from 'react';
import { Card, Tag } from '@douyinfe/semi-ui';
import SearchActions from './SearchActions';

const CONFIG = {
  UNKNOWN_VENDOR: 'unknown',
};

const THEME_COLORS = {
  allVendors: {
    primary: '37 99 235',
    background: 'rgba(59, 130, 246, 0.08)',
  },
  specific: {
    primary: '16 185 129',
    background: 'rgba(16, 185, 129, 0.1)',
  },
};

const COMPONENT_STYLES = {
  tag: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    color: '#1f2937',
    border: '1px solid rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  titleText: { color: 'white' },
};

const CONTENT_TEXTS = {
  unknown: {
    displayName: (t) => t('未知模型'),
  },
};

const getVendorDisplayName = (vendorName, t) => {
  return vendorName === CONFIG.UNKNOWN_VENDOR
    ? CONTENT_TEXTS.unknown.displayName(t)
    : vendorName;
};

const PricingVendorIntro = memo(
  ({
    filterVendor,
    models = [],
    allModels = [],
    t,
    selectedRowKeys = [],
    copyText,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    isMobile = false,
    searchValue = '',
    setShowFilterModal,
    showWithRecharge,
    setShowWithRecharge,
    currency,
    setCurrency,
    showRatio,
    setShowRatio,
    viewMode,
    setViewMode,
    tokenUnit,
    setTokenUnit,
  }) => {
    const vendorInfo = useMemo(() => {
      const vendors = new Map();
      let unknownCount = 0;

      const sourceModels =
        Array.isArray(allModels) && allModels.length > 0 ? allModels : models;

      sourceModels.forEach((model) => {
        if (model.vendor_name) {
          const existing = vendors.get(model.vendor_name);
          if (existing) {
            existing.count++;
          } else {
            vendors.set(model.vendor_name, {
              name: model.vendor_name,
              icon: model.vendor_icon,
              description: model.vendor_description,
              count: 1,
            });
          }
        } else {
          unknownCount++;
        }
      });

      const vendorList = Array.from(vendors.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      if (unknownCount > 0) {
        vendorList.push({
          name: CONFIG.UNKNOWN_VENDOR,
          icon: null,
          count: unknownCount,
        });
      }

      return vendorList;
    }, [allModels, models, t]);

    const currentModelCount = models.length;

    const createCoverStyle = useCallback(
      (primaryColor) => ({
        '--palette-primary-darkerChannel': primaryColor,
        backgroundImage: `linear-gradient(0deg, rgba(var(--palette-primary-darkerChannel) / 80%), rgba(var(--palette-primary-darkerChannel) / 80%)), url('/cover-4.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }),
      [],
    );

    const renderSearchActions = useCallback(
      () => (
        <SearchActions
          selectedRowKeys={selectedRowKeys}
          copyText={copyText}
          handleChange={handleChange}
          handleCompositionStart={handleCompositionStart}
          handleCompositionEnd={handleCompositionEnd}
          isMobile={isMobile}
          searchValue={searchValue}
          setShowFilterModal={setShowFilterModal}
          showWithRecharge={showWithRecharge}
          setShowWithRecharge={setShowWithRecharge}
          currency={currency}
          setCurrency={setCurrency}
          showRatio={showRatio}
          setShowRatio={setShowRatio}
          viewMode={viewMode}
          setViewMode={setViewMode}
          tokenUnit={tokenUnit}
          setTokenUnit={setTokenUnit}
          t={t}
        />
      ),
      [
        selectedRowKeys,
        copyText,
        handleChange,
        handleCompositionStart,
        handleCompositionEnd,
        isMobile,
        searchValue,
        setShowFilterModal,
        showWithRecharge,
        setShowWithRecharge,
        currency,
        setCurrency,
        showRatio,
        setShowRatio,
        viewMode,
        setViewMode,
        tokenUnit,
        setTokenUnit,
        t,
      ],
    );

    const renderHeaderCard = useCallback(
      ({ title, count, primaryDarkerChannel }) => (
        <Card
          className='cyber-pricing-heading-card !rounded-2xl shadow-sm border-0'
          cover={
            <div
              className='relative h-full'
              style={createCoverStyle(primaryDarkerChannel)}
            >
              <div className='relative z-10 h-full flex items-center justify-between p-4'>
                <div className='flex-1 min-w-0 mr-4'>
                  <div className='flex flex-row flex-wrap items-center gap-2 sm:gap-3 mb-2'>
                    <h2
                      className='text-lg sm:text-xl font-bold truncate'
                      style={COMPONENT_STYLES.titleText}
                    >
                      {title}
                    </h2>
                  </div>
                </div>

                <Tag
                  style={COMPONENT_STYLES.tag}
                  shape='circle'
                  size='large'
                  className='cyber-pricing-model-count flex-shrink-0'
                >
                  {t('共 {{count}} 个模型', { count })}
                </Tag>
              </div>
            </div>
          }
        >
          {renderSearchActions()}
        </Card>
      ),
      [renderSearchActions, createCoverStyle, t],
    );

    if (filterVendor === 'all') {
      const headerCard = renderHeaderCard({
        title: t('模型与价格'),
        count: currentModelCount,
        primaryDarkerChannel: THEME_COLORS.allVendors.primary,
      });
      return (
        <>{headerCard}</>
      );
    }

    const currentVendor = vendorInfo.find((v) => v.name === filterVendor);
    if (!currentVendor) {
      return null;
    }

    const vendorDisplayName = getVendorDisplayName(currentVendor.name, t);

    const headerCard = renderHeaderCard({
      title: `${vendorDisplayName} · ${t('模型与价格')}`,
      count: currentModelCount,
      primaryDarkerChannel: THEME_COLORS.specific.primary,
    });

    return (
      <>{headerCard}</>
    );
  },
);

PricingVendorIntro.displayName = 'PricingVendorIntro';

export default PricingVendorIntro;
